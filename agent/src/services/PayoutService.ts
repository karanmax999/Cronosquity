import { Program, Policy, ScoreEntry, PayoutPlanEntry } from "../types";
import { CronosService } from "./CronosService";
import { ethers } from "ethers";

export class PayoutService {
    private cronosService: CronosService;

    constructor(cronosService: CronosService) {
        this.cronosService = cronosService;
    }

    computePayoutPlan(
        programs: Program[],
        scoresByProgram: Map<bigint, ScoreEntry[]>,
        policiesByProgram: Map<bigint, Policy>
    ): PayoutPlanEntry[] {
        const fullPlan: PayoutPlanEntry[] = [];

        for (const program of programs) {
            const scores = scoresByProgram.get(program.id) || [];
            const policy = policiesByProgram.get(program.id) || {};

            console.log(`PayoutService: Computing plan for Program ${program.id} (${scores.length} scores)...`);

            // 1. Sort scores descending
            const sortedByScore = [...scores].sort((a, b) => b.score - a.score);

            // 2. Limit by maxWinners
            const maxWinners = policy.maxWinners || 10;
            const winners = sortedByScore.slice(0, maxWinners);

            if (winners.length === 0) continue;

            // 3. Distribution logic (Standard: Equal split of program budget)
            // Note: In a real app, this would be more complex based on tiers.
            const totalBudget = program.budget;
            const amountPerWinner = totalBudget / BigInt(winners.length);

            // Respect maxPerAddress
            const maxPerAddress = policy.maxPerAddress ? ethers.parseUnits(policy.maxPerAddress.toString(), 18) : ethers.MaxUint256;

            for (const winner of winners) {
                let finalAmount = amountPerWinner;
                const reasons: string[] = [`Ranked ${winners.indexOf(winner) + 1} with score ${winner.score}`];
                const policySatisfied: string[] = ["Top Score"];

                if (finalAmount > maxPerAddress) {
                    finalAmount = maxPerAddress;
                    reasons.push(`Capped at maxPerAddress: ${policy.maxPerAddress}`);
                    policySatisfied.push("MaxPerAddress Enforced");
                }

                fullPlan.push({
                    programId: program.id,
                    recipient: winner.address,
                    amount: finalAmount,
                    reasons,
                    policySatisfied
                });
            }
        }

        return fullPlan;
    }

    async executePayoutsViaFacilitator(plan: PayoutPlanEntry[]): Promise<void> {
        console.log(`PayoutService: Executing ${plan.length} payouts via Facilitator stub...`);
        for (const entry of plan) {
            console.log(`[FACILITATOR-STUB] x402 Cross-Chain Payout:
                To: ${entry.recipient}
                Amount: ${ethers.formatUnits(entry.amount, 18)}
                ProgramId: ${entry.programId}
                Policy: ${entry.policySatisfied.join(", ")}
            `);

            // For demo/local: Execute on ProgramVault
            try {
                await this.cronosService.executePayoutLocal(entry);
            } catch (err) {
                console.error(`Local execution failed for ${entry.recipient}`, err);
            }
        }
    }
}
