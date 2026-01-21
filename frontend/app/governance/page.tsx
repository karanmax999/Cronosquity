"use client";

import React, { useState } from "react";
import { Vote, Users, FileText, BarChart3, ShieldCheck, Activity, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GovStatCard, ProposalCard, PolicyVisualizer } from "@/components/governance/GovComponents";

const stats = [
    { label: "Governance Volume", value: "$4.8M", icon: BarChart3, color: "glow-purple" },
    { label: "Token Holders", value: "2,401", icon: Users, color: "blue" },
    { label: "Active Proposals", value: "3", icon: Activity, color: "emerald" },
    { label: "Delegated Power", value: "12.4M", icon: ShieldCheck, color: "glow-blue" },
];

const initialProposals = [
    {
        id: "GP-12",
        title: "Update Grant Allotment Policy for Q1 2026",
        status: "active" as const,
        type: "Policy Update",
        votesFor: 1240000,
        votesAgainst: 120000,
    },
    {
        id: "GP-11",
        title: "Adjust Treasury Allocation: Cronos L3 Migration",
        status: "queued" as const,
        type: "Treasury",
        votesFor: 4500000,
        votesAgainst: 156000,
    },
    {
        id: "GP-10",
        title: "Incorporate x402 Gasless Relay Subsidies",
        status: "passed" as const,
        type: "Infrastructure",
        votesFor: 8900000,
        votesAgainst: 45000,
    },
];

const agentPolicySnippet = `// Current Payout Logic Policy
const payoutPolicy = {
  maxSingleTx: ethers.utils.parseUnits("5000", 6),
  cooldownPeriod: 3600, // 1 hour
  allowedTokens: ["USDC.e", "TCRO"],
  requiresHumanVerification: (amount) => amount > 1000
};

// Proposed change via GP-12
// maxSingleTx -> parseUnits("7500", 6)`;

export default function GovernancePage() {
    const [proposals, setProposals] = useState(initialProposals);
    const [searchTerm, setSearchTerm] = useState("");

    const handleVote = (id: string) => {
        // Mock voting interaction
        setProposals(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, votesFor: p.votesFor + 1000 };
            }
            return p;
        }));
    };

    return (
        <main className="min-h-screen bg-universe-black pt-24 pb-24 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-glow-purple/5 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-glow-blue/5 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glow-purple/10 border border-glow-purple/20 text-glow-purple text-[10px] font-bold uppercase tracking-widest">
                            <Vote className="w-3 h-3" /> Agentic Governance
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tight">
                            Protocol <span className="text-glow-purple">Stewardship</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-sm leading-relaxed">
                            Participate in decentralized decision-making to update agent policies, adjust treasury allocations, and scale the Croquity ecosystem.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-glow-purple transition-colors" />
                            <input
                                type="text"
                                placeholder="Search proposals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-glow-purple/50 w-64 transition-all"
                            />
                        </div>
                        <button className="px-6 py-2.5 rounded-xl bg-glow-purple text-white text-sm font-bold shadow-lg shadow-glow-purple/20 hover:scale-[1.02] transition-all active:scale-95">
                            New Proposal
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <GovStatCard key={i} {...stat} />
                    ))}
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid lg:grid-cols-[1fr_350px] gap-8">

                    {/* Proposals List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-glow-purple" />
                                Active Proposals
                            </h3>
                            <button className="text-xs text-white/40 hover:text-white transition-colors">View Archive</button>
                        </div>

                        <div className="grid gap-6">
                            <AnimatePresence mode="popLayout">
                                {proposals
                                    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((proposal) => (
                                        <ProposalCard
                                            key={proposal.id}
                                            {...proposal}
                                            onVote={() => handleVote(proposal.id)}
                                        />
                                    ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar: Agent Insight */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-glow-blue" />
                                Agent Policy
                            </h3>
                            <PolicyVisualizer policy={agentPolicySnippet} />
                            <p className="mt-4 text-[10px] text-white/30 leading-relaxed italic">
                                Active policies are hard-coded into the orchestration loop. Updates via governance requires a multi-sig trigger on Cronos ProgramVault.
                            </p>
                        </div>

                        <div className="glass-dark p-6 rounded-2xl border border-white/10 space-y-4">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest text-center">Voting Strength</h4>
                            <div className="relative h-32 w-32 mx-auto">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray="364.4"
                                        initial={{ strokeDashoffset: 364.4 }}
                                        animate={{ strokeDashoffset: 364.4 * (1 - 0.72) }}
                                        className="text-glow-purple"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-white">72%</span>
                                    <span className="text-[10px] text-white/40 uppercase font-bold">Quorum</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/40 text-center">
                                Currently <span className="text-white">8,920,412 Tokens</span> are participating in governance.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}
