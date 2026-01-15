import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Program, PayoutPlanEntry } from "../types";

dotenv.config();

// Updated ABIs for Program OS
const PROGRAM_REGISTRY_ABI = [
    "function getProgram(uint256) view returns (tuple(uint256 id, address owner, uint8 programType, address token, string metadataURI, string policyURI, uint256 budget, uint8 status))",
    "function nextProgramId() view returns (uint256)",
    "event ProgramCreated(uint256 indexed programId, address indexed owner, uint8 programType, uint256 budget)"
];

const PROGRAM_VAULT_ABI = [
    "function executePayout(uint256 programId, address recipient, uint256 amount, string reason)",
    "event PayoutExecuted(uint256 indexed programId, address indexed recipient, uint256 amount, string reason)"
];

export class CronosService {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private registry: ethers.Contract;
    private vault: ethers.Contract;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://evm-t3.cronos.org/");
        if (!process.env.PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY not set");
        }
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

        // contract addresses from env or hardcoded placeholder
        this.registry = new ethers.Contract(process.env.PROGRAM_REGISTRY_ADDRESS || ethers.ZeroAddress, PROGRAM_REGISTRY_ABI, this.wallet);
        this.vault = new ethers.Contract(process.env.PROGRAM_VAULT_ADDRESS || ethers.ZeroAddress, PROGRAM_VAULT_ABI, this.wallet);
    }

    async loadPrograms(): Promise<Program[]> {
        console.log("Loading programs from ProgramRegistry...");
        try {
            const count = await this.registry.nextProgramId();
            const programs: Program[] = [];
            for (let i = 0; i < BigInt(count); i++) {
                const p = await this.registry.getProgram(i);
                programs.push({
                    id: p.id,
                    owner: p.owner,
                    programType: p.programType,
                    token: p.token,
                    metadataURI: p.metadataURI,
                    policyURI: p.policyURI,
                    budget: p.budget,
                    status: p.status
                });
            }
            return programs;
        } catch (e) {
            console.error("Error loading programs", e);
            return [];
        }
    }

    async executePayoutLocal(entry: PayoutPlanEntry) {
        console.log(`Executing payout for Program ${entry.programId} to ${entry.recipient} for ${ethers.formatUnits(entry.amount, 18)} tokens...`);
        try {
            const tx = await this.vault.executePayout(
                entry.programId,
                entry.recipient,
                entry.amount,
                entry.reasons.join(", ")
            );
            await tx.wait();
            console.log("Payout confirmed on-chain:", tx.hash);
            return tx.hash;
        } catch (e) {
            console.error("Error executing payout on-chain", e);
            throw e;
        }
    }
}
