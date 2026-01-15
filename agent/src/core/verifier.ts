import { Policy, ScoreEntry, PayoutPlanEntry } from '../policies/schema';

export class PolicyVerifier {
    /**
     * @dev Validates a proposed payout plan against deterministic policy constraints.
     * Surface violations clearly for treasury transparency.
     */
    verifyPlan(plan: PayoutPlanEntry[], policy: Policy): { isValid: boolean; failures: string[] } {
        const failures: string[] = [];

        // 1. Total Budget Check
        const totalProposed = plan.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        if (totalProposed > policy.maxTotalBudget) {
            failures.push(`BUDGET_EXCEEDED: Proposed ${totalProposed} exceeds limit of ${policy.maxTotalBudget}`);
        }

        // 2. Recipient Count Checks
        if (plan.length < policy.minRecipients) {
            failures.push(`MIN_RECIPIENTS_NOT_MET: Required ${policy.minRecipients}, found ${plan.length}`);
        }
        if (plan.length > policy.maxRecipients) {
            failures.push(`MAX_RECIPIENTS_EXCEEDED: Allowed ${policy.maxRecipients}, found ${plan.length}`);
        }

        // 3. Per-Recipient Checks
        for (const entry of plan) {
            if (parseFloat(entry.amount) > policy.maxPerRecipient) {
                failures.push(`RECIPIENT_CAP_VIOLATION: ${entry.recipient} proposed ${entry.amount} > limit ${policy.maxPerRecipient}`);
            }
        }

        // 4. Uniqueness Check
        if (policy.requireUniqueWallets) {
            const recipients = plan.map(p => p.recipient.toLowerCase());
            const uniqueRecipients = new Set(recipients);
            if (uniqueRecipients.size !== recipients.length) {
                failures.push(`SYBIL_DETECTED: Duplicate wallet addresses found in payout plan`);
            }
        }

        return {
            isValid: failures.length === 0,
            failures
        };
    }

    /**
     * @dev Simple single-entry check for individual status marking
     */
    verifyEntry(entry: PayoutPlanEntry, policy: Policy): { status: 'VALID' | 'INVALID'; violation?: string } {
        if (parseFloat(entry.amount) > policy.maxPerRecipient) {
            return { status: 'INVALID', violation: 'EXCEEDS_PER_RECIPIENT_CAP' };
        }
        return { status: 'VALID' };
    }
}
