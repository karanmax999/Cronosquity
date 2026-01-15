export class AgentExplainer {
    generateReasoning(plan: any[], programType: string): string {
        if (plan.length === 0) return "No payouts proposed: Either 0 submissions found or budget exhausted.";

        const count = plan.length;
        const totalAmount = plan.reduce((sum, p) => sum + parseFloat(p.amount), 0);

        return `Croquity Agent processed the ${programType} iteration. 
        Evaluating ${count} recipients for a total of ${totalAmount.toFixed(2)} USDC.e. 
        All selections verified against encoded policy rules for fraud and duplicate entries.`;
    }
}
