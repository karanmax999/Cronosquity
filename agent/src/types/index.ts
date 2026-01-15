export interface Program {
    id: bigint;
    owner: string;
    programType: number;    // enum index: Hackathon, Bounty, Grant, Payroll
    token: string;          // Token address for this program
    metadataURI: string;
    policyURI: string;
    budget: bigint;
    status: number;         // enum index: Active, Closed
}

export interface Policy {
    maxPerAddress?: number;
    maxWinners?: number;
    minWinners?: number;
    tiers?: Array<{ rank: number; amountPct?: number; fixedAmount?: number }>;
    needsApprovalAbove?: number;
}

export interface ScoreEntry {
    address: string;
    score: number;
}

export interface PayoutPlanEntry {
    programId: bigint;
    recipient: string;
    amount: bigint;
    reasons: string[];
    policySatisfied: string[];
}
