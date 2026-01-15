import { Program, Policy, ScoreEntry, PayoutPlanEntry } from '../policies/schema';

export class PayoutPlanner {
    computePayoutPlan(program: Program, policy: Policy, scores: ScoreEntry[]): PayoutPlanEntry[] {
        // 1. Filter and Sort scores
        const sortedScores = [...scores].sort((a, b) => b.score - a.score);

        // 2. Determine winner count based on policy
        const targetWinnerCount = Math.min(sortedScores.length, policy.maxRecipients);
        const winners = sortedScores.slice(0, targetWinnerCount);

        // Use the actual program budget defined on-chain
        // SAFETY: Use 90% of budget to handle potential rounding dust or fees
        const deployableBudget = parseFloat(program.budget) * 0.90;

        const plan: PayoutPlanEntry[] = [];

        // Simple default logic: Equal split among top candidates, respecting per-recipient cap
        if (winners.length > 0) {
            // Distribute budget equally among winners
            const rawAmountPerWinner = deployableBudget / winners.length;
            // Apply the per-recipient cap from policy
            const finalAmountPerWinner = Math.min(rawAmountPerWinner, policy.maxPerRecipient);

            for (const w of winners) {
                plan.push({
                    recipient: w.address,
                    amount: finalAmountPerWinner.toString(),
                    reason: `Calculated distribution for ${winners.length} winners. Agent Score: ${w.score}`,
                    policyCheck: 'PENDING_VERIFICATION',
                    status: 'VALID' // Initial assumption, verifier will confirm
                });
            }
        }

        return plan;
    }
}
