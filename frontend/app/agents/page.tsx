"use client";

import { TransparencyFeed } from "@/components/TransparencyFeed";
import { BrainCircuit, Activity, Zap, CheckCircle } from "lucide-react";

export default function AgentsPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-universe-black">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 flex items-center gap-4">
                        <BrainCircuit className="w-12 h-12 text-glow-purple" />
                        Agent <span className="bg-clip-text text-transparent bg-gradient-to-r from-glow-purple to-glow-blue">Swarm</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl text-lg">
                        Monitor the real-time decision making of Croquity's autonomous stewards.
                        Each action is verified against on-chain policy before execution.
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-dark p-8 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-3 mb-4 text-emerald-400">
                            <Activity className="w-6 h-6" />
                            <span className="font-bold uppercase tracking-widest text-xs">System Status</span>
                        </div>
                        <div className="text-4xl font-black text-white mb-1">Online</div>
                        <div className="text-white/40 text-sm">99.9% Uptime</div>
                    </div>
                    <div className="glass-dark p-8 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-3 mb-4 text-glow-blue">
                            <Zap className="w-6 h-6" />
                            <span className="font-bold uppercase tracking-widest text-xs">Total Actions</span>
                        </div>
                        <div className="text-4xl font-black text-white mb-1">1,428</div>
                        <div className="text-white/40 text-sm">Last 30 days</div>
                    </div>
                    <div className="glass-dark p-8 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-3 mb-4 text-glow-purple">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-bold uppercase tracking-widest text-xs">Policy Compliance</span>
                        </div>
                        <div className="text-4xl font-black text-white mb-1">100%</div>
                        <div className="text-white/40 text-sm">Zero violations detected</div>
                    </div>
                </div>

                {/* Live Feed */}
                <div className="glass-dark p-1 rounded-3xl border border-white/10 overflow-hidden">
                    <div className="bg-black/40 p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Live Decision Feed</h3>
                        <TransparencyFeed programId={1} />
                        {/* Using Program 1 as default for the main feed view */}
                    </div>
                </div>
            </div>
        </main>
    );
}
