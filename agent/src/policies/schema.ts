export interface Program {
    id: number;
    owner: string;
    programType: number;
    token: string;
    metadataURI: string;
    policyURI: string;
    budget: string;
    status: string;
}

export interface Policy {
    // Deterministic Constraints
    maxTotalBudget: number;       // The absolute ceiling for this program iteration
    maxPerRecipient: number;      // Cap per individual wallet
    minRecipients: number;        // Minimum number of winners required to execute
    maxRecipients: number;        // Maximum number of winners allowed
    requireUniqueWallets: boolean; // anti-sybil constraint
    usdCapPerMonth?: number;      // Periodic aggregate limit

    // Aesthetic/Template info
    template?: string;
}

export interface ScoreEntry {
    address: string;
    score: number;
    metadata?: string;
}

export interface PayoutPlanEntry {
    recipient: string;
    amount: string;
    reason: string;
    policyCheck: string;
    status: 'VALID' | 'INVALID';
    violation?: string;
}
