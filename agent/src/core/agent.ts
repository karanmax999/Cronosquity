import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { Program, Policy, ScoreEntry, PayoutPlanEntry } from '../policies/schema';
import { PayoutPlanner } from './planner';
import { PolicyVerifier } from './verifier';
import { AgentExplainer } from './explainer';
import { MarketDataStub } from '../cronos/marketData';
import { X402Facilitator } from '../cronos/facilitator';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const PROGRAM_REGISTRY_ABI = [
    "function nextProgramId() view returns (uint256)",
    "function getProgram(uint256) view returns (tuple(uint256 id, address owner, uint8 programType, address token, string metadataURI, string policyURI, uint256 budget, uint8 status))"
];

const PROGRAM_VAULT_ABI = [
    "function executePayout(uint256, address, uint256, string) external"
];

interface LogEntry {
    id: string;
    timestamp: string;
    programId: number;
    type: 'info' | 'success' | 'warning' | 'error' | 'decision';
    message: string;
    description?: string;
    txHash?: string;
}

const LOG_FILE_PATH = path.resolve(process.cwd(), '../frontend/public/agent-logs.json');

function saveAgentLog(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
    try {
        // Ensure directory exists if we were creating a new one, but public/ should exist
        const dir = path.dirname(LOG_FILE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let logs: LogEntry[] = [];
        if (fs.existsSync(LOG_FILE_PATH)) {
            logs = JSON.parse(fs.readFileSync(LOG_FILE_PATH, 'utf8'));
        }

        const newEntry: LogEntry = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toISOString(),
            ...entry
        };

        logs.unshift(newEntry); // Newest first
        // Keep last 50 logs
        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs.slice(0, 50), null, 2));
    } catch (e) {
        console.error("Error saving agent log:", e);
    }
}

/**
 * @title Croquity Agent - Core Orchestration
 * @dev Implements the 4-step observability flow: Ingest -> Plan -> Verify -> Explain -> Execute
 * 
 * This module is designed to be called once per iteration by index.ts.
 * It follows a clean separation of concerns:
 * - Ingest: Load programs, policies, and scores
 * - Plan: Generate payout distribution using PayoutPlanner
 * - Verify: Check plan against policy constraints using PolicyVerifier
 * - Explain: Generate human-readable reasoning using AgentExplainer
 * - Execute: Broadcast transactions and X402 bridges for payouts > 100 USDC.e
 */

export async function runAgentOnce(
    loadPrograms: () => Promise<Program[]>,
    loadPolicy: (uri: string) => Policy,
    loadScores: (programId: string | number) => ScoreEntry[]
) {
    const planner = new PayoutPlanner();
    const verifier = new PolicyVerifier();
    const explainer = new AgentExplainer();
    const facilitator = new X402Facilitator();

    console.log("\n\x1b[35m╔══════════════════════════════════════════╗\x1b[0m");
    console.log("\x1b[35m║    🕵️  CROQUITY AGENT ITERATION CYCLE    ║\x1b[0m");
    console.log("\x1b[35m╚══════════════════════════════════════════╝\x1b[0m");

    saveAgentLog({
        programId: -1, // System log
        type: 'info',
        message: "Steward cycle started",
        description: "AI Steward is scanning for new programs and evaluating submissions."
    });

    try {
        // 1. INGEST: Load all active programs and their data
        console.log("\n\x1b[36m[STEP 1/4] INGESTING DATA\x1b[0m");
        const programs = await loadPrograms();
        console.log(`  ✓ Loaded ${programs.length} active programs`);

        if (programs.length === 0) {
            console.log("\x1b[33m  ! No active programs found. Skipping iteration.\x1b[0m");
            return;
        }

        // Process each program
        for (const program of programs) {
            console.log(`\n  \x1b[34m━━━ PROGRAM ${program.id} ━━━\x1b[0m`);

            // Load policy and scores for this program
            const policy = loadPolicy(program.policyURI);
            const scores = loadScores(program.id);

            console.log(`    • Policy: max ${policy.maxRecipients} recipients, ${policy.maxPerRecipient} USDC each`);
            console.log(`    • Submissions: ${scores.length} scores loaded`);

            if (scores.length === 0) {
                console.log(`    • ⚠️  No submissions for this program, skipping...`);
                continue;
            }

            // 2. PLAN: Generate payout distribution
            console.log("\n\x1b[36m[STEP 2/4] PLANNING PAYOUTS\x1b[0m");
            const plan = planner.computePayoutPlan(program, policy, scores);
            console.log(`  ✓ Generated plan for ${plan.length} recipients`);

            if (plan.length === 0) {
                console.log(`  ℹ️  No payouts to distribute for this program`);
                continue;
            }

            // 3. VERIFY: Check plan against policy
            console.log("\n\x1b[36m[STEP 3/4] VERIFYING AGAINST POLICY\x1b[0m");
            const verification = verifier.verifyPlan(plan, policy);

            if (!verification.isValid) {
                console.log(`\x1b[31m  ✗ POLICY VIOLATION - Plan rejected\x1b[0m`);
                verification.failures.forEach(f => console.log(`    • ${f}`));
                saveAgentLog({
                    programId: program.id,
                    type: 'warning',
                    message: "Policy Violation",
                    description: `Plan rejected: ${verification.failures.join(', ')}`
                });
                continue;
            }

            console.log(`\x1b[32m  ✓ POLICY VERIFIED - All constraints satisfied\x1b[0m`);

            // 4. EXPLAIN: Generate human-readable reasoning
            console.log("\n\x1b[36m[STEP 4/4] EXPLAINING DECISION\x1b[0m");
            const programTypeStr = ["Hackathon", "Bounty", "Grant", "Payroll"][program.programType] || "Unknown";
            const explanation = explainer.generateReasoning(plan, programTypeStr);
            console.log(`\x1b[34m  ${explanation.split('\n').map((l: string) => l.trim()).join('\n  ')}\x1b[0m`);

            saveAgentLog({
                programId: program.id,
                type: 'decision',
                message: `Agent processed ${programTypeStr} payouts`,
                description: explanation
            });

            // 5. EXECUTE: Broadcast payouts (if AUTO_EXECUTE is enabled)
            if (process.env.AUTO_EXECUTE === 'true') {
                console.log("\n\x1b[36m[EXECUTE] BROADCASTING PAYOUTS\x1b[0m");
                for (const entry of plan) {
                    console.log(`  → ${entry.amount} USDC to ${entry.recipient.slice(0, 10)}...`);
                    // Note: Real execution happens in CronosAgent.run()
                }
            } else {
                console.log("\n\x1b[33m[DRY RUN] AUTO_EXECUTE not enabled - payouts not broadcasted\x1b[0m");
                saveAgentLog({
                    programId: program.id,
                    type: 'info',
                    message: "Dry run completed",
                    description: "Payouts calculated and verified but not broadcasted to chain."
                });
            }
        }

        console.log("\n\x1b[35m╔══════════════════════════════════════════╗\x1b[0m");
        console.log("\x1b[35m║        ✅ ITERATION COMPLETE              ║\x1b[0m");
        console.log("\x1b[35m╚══════════════════════════════════════════╝\x1b[0m\n");

    } catch (error: any) {
        console.error("\n\x1b[31m[ERROR] Agent iteration failed:\x1b[0m", error.message);
        console.error(error.stack);
    }
}

/**
 * Internal CronosAgent class - orchestrates with blockchain integration
 */
class CronosAgent {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private registry: ethers.Contract;
    private vault: ethers.Contract;

    private planner: PayoutPlanner;
    private verifier: PolicyVerifier;
    private explainer: AgentExplainer;
    private market: MarketDataStub;
    private facilitator: X402Facilitator;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
        this.registry = new ethers.Contract(process.env.PROGRAM_REGISTRY_ADDRESS!, PROGRAM_REGISTRY_ABI, this.wallet);
        this.vault = new ethers.Contract(process.env.PROGRAM_VAULT_ADDRESS!, PROGRAM_VAULT_ABI, this.wallet);

        this.planner = new PayoutPlanner();
        this.verifier = new PolicyVerifier();
        this.explainer = new AgentExplainer();
        this.market = new MarketDataStub();
        this.facilitator = new X402Facilitator();
    }

    async run() {
        const programs = await this.loadActivePrograms();

        await runAgentOnce(
            async () => programs,
            (uri: string) => this.loadPolicy(uri),
            (programId: string | number) => this.loadScores(programId)
        );

        // Execute payouts if approved
        if (process.env.AUTO_EXECUTE !== 'true') {
            return;
        }

        for (const program of programs) {
            const policy = this.loadPolicy(program.policyURI);
            const scores = this.loadScores(program.id);
            const plan = this.planner.computePayoutPlan(program, policy, scores);

            const verification = this.verifier.verifyPlan(plan, policy);
            if (!verification.isValid) continue;

            for (const entry of plan) {
                try {
                    // Round to 18 decimals to avoid numeric underflow with long floating points
                    const roundedAmount = parseFloat(entry.amount).toFixed(18);
                    const amountWei = ethers.parseUnits(roundedAmount, 18);
                    const tx = await this.vault.executePayout(program.id, entry.recipient, amountWei, entry.reason);
                    const receipt = await tx.wait();
                    console.log(`  \x1b[32m✅ TX_CONFIRMED: ${receipt?.hash}\x1b[0m`);

                    saveAgentLog({
                        programId: program.id,
                        type: 'success',
                        message: `Payout executed for ${entry.recipient.slice(0, 10)}...`,
                        description: entry.reason,
                        txHash: receipt?.hash || undefined
                    });

                    // Bridge to Cronos if payout > 100 USDC.e
                    if (parseFloat(entry.amount) > 100) {
                        await this.facilitator.requestCrossChainPayout({
                            recipient: entry.recipient,
                            amount: ethers.parseUnits(entry.amount, 6).toString(),
                            description: entry.reason || 'Agent payout via X402'
                        });
                    }
                } catch (error: any) {
                    console.error(`  \x1b[31m❌ TX_FAILED for ${entry.recipient}:\x1b[0m`, error.message);
                }
            }
        }
    }

    private async loadActivePrograms(): Promise<Program[]> {
        const count = await this.registry.nextProgramId();
        console.log(`[DEBUG] nextProgramId returned: ${count}`);
        const programs: Program[] = [];
        for (let i = 0; i < count; i++) {
            const p = await this.registry.getProgram(i);
            console.log(`[DEBUG] Program ${i}: status=${p.status}, owner=${p.owner}`);
            if (Number(p.status) === 0) {
                programs.push({
                    id: Number(p.id),
                    owner: p.owner,
                    programType: Number(p.programType),
                    token: p.token,
                    metadataURI: p.metadataURI,
                    policyURI: p.policyURI,
                    budget: ethers.formatUnits(p.budget, 18), // Convert Wei to Human Readable
                    status: "Active"
                });
            }
        }
        console.log(`[DEBUG] Filtered to ${programs.length} active programs`);
        return programs;
    }

    private loadPolicy(uri: string): Policy {
        try {
            return JSON.parse(uri);
        } catch {
            return {
                maxTotalBudget: 10000,
                maxPerRecipient: 2000,
                minRecipients: 1,
                maxRecipients: 5,
                requireUniqueWallets: true
            };
        }
    }

    private loadScores(programId: string | number): ScoreEntry[] {
        const scorePath = path.join(__dirname, '../demo/sampleSubmissions.json');
        try {
            if (fs.existsSync(scorePath)) {
                return JSON.parse(fs.readFileSync(scorePath, 'utf8'));
            }
        } catch (e) {
            console.error("Error loading scores:", e);
        }
        return [];
    }
}

export { CronosAgent };
export type { Program, Policy, ScoreEntry, PayoutPlanEntry };
