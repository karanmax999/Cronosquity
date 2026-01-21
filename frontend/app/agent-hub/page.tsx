"use client";

import React, { useState, useEffect } from "react";
import { BrainCircuit, Terminal, Activity, ShieldAlert, CheckCircle, Search, Cpu, Zap, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_LOGS = [
    { type: 'info', msg: "Facilitator SDK initialized on Cronos Testnet", time: "22:15:01" },
    { type: 'success', msg: "Connected to ProgramRegistry: 0x55c5FAAf...69f", time: "22:15:02" },
    { type: 'info', msg: "Polling 4 active programs for new submissions...", time: "22:16:00" },
    { type: 'warning', msg: "Sub-threshold payout detected ($45). Skipping x402 bridge.", time: "22:16:15" },
    { type: 'info', msg: "Analyzing submission #241 against Policy ID: HACK-2026-01", time: "22:17:10" },
    { type: 'success', msg: "Policy Check PASSED. Generating EIP-3009 Payment Header...", time: "22:17:12" },
    { type: 'info', msg: "X402 Settlement initiated for 0xf39F...266 (333.33 USDC.e)", time: "22:17:15" },
    { type: 'success', msg: "TX Confirmed: 0xb7a2...192. Payout finalized.", time: "22:17:45" },
];

export default function AgentHubPage() {
    const [logs, setLogs] = useState(MOCK_LOGS);
    const [status, setStatus] = useState("Operational");

    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = {
                type: Math.random() > 0.8 ? 'warning' : 'info',
                msg: `Orchestration loop: Step ${Math.floor(Math.random() * 4) + 1} processing programs...`,
                time: new Date().toLocaleTimeString([], { hour12: false })
            };
            setLogs(prev => [newLog, ...prev.slice(0, 50)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-universe-black pt-24 pb-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glow-purple/10 border border-glow-purple/20 text-glow-purple text-[10px] font-black uppercase tracking-widest">
                            <Radio className="w-3 h-3 animate-pulse" /> Live Orchestration
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
                            Agent <span className="text-glow-purple">Mission Control.</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-sm font-medium">
                            Real-time view into the Croquity AI Steward. Monitor the orchestration loop, policy compliance checks, and cross-chain settlement status.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-6 px-4">
                            <div className="text-right">
                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">System Status</div>
                                <div className="text-sm font-black text-emerald-400 mt-1 uppercase flex items-center gap-1.5 justify-end">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    {status}
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-right">
                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">Uptime</div>
                                <div className="text-sm font-black text-white mt-1 uppercase">99.98%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Log Terminal */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-black text-white flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-glow-purple" />
                                Execution Logs
                            </h3>
                            <button className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Clear Console</button>
                        </div>

                        <div className="glass-dark rounded-[2rem] border border-white/5 overflow-hidden h-[600px] flex flex-col">
                            <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                                <span className="text-[10px] font-mono text-white/20 uppercase ml-4">croquity-agent-v1.0.0@cronos-testnet</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-3 scrollbar-hide">
                                <AnimatePresence initial={false}>
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex gap-4 group"
                                        >
                                            <span className="text-white/20 shrink-0">[${log.time}]</span>
                                            <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-gray-400'}>
                                                {log.msg}
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Metrics & State */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                                <Activity className="w-5 h-5 text-glow-blue" />
                                Loop Metrics
                            </h3>
                            <div className="grid gap-4">
                                <div className="glass-dark p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Cpu className="w-4 h-4 text-white/40" />
                                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">CPU Load</span>
                                        </div>
                                        <span className="text-xs font-black text-white">12%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[12%] bg-glow-blue" />
                                    </div>
                                </div>

                                <div className="glass-dark p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-white/40" />
                                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Memory</span>
                                        </div>
                                        <span className="text-xs font-black text-white">242 MB</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[45%] bg-glow-purple" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-dark p-8 rounded-[2rem] border border-white/5 space-y-8">
                            <h3 className="text-lg font-black text-white flex items-center gap-3">
                                <ShieldAlert className="w-5 h-5 text-glow-purple" />
                                Current Policy
                            </h3>
                            <div className="space-y-4 font-mono text-[10px]">
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-gray-500 line-clamp-6 leading-relaxed">
                                    {`// Policy enforced globally
if (amount > 1000) requiresVerification();
if (pType == HACKATHON) enforceScoreThreshold(80);
if (!recipient.isVerified) skipPayout();` }
                                </div>
                                <button className="w-full py-3 rounded-xl bg-glow-purple/10 border border-glow-purple/20 text-glow-purple text-[10px] font-black uppercase tracking-widest hover:bg-glow-purple/20 transition-all">
                                    Refresh Policy Registry
                                </button>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-glow-purple/10 to-glow-blue/10 border border-white/10 flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Policy Compliant</h4>
                            <p className="text-[10px] text-white/40 leading-relaxed">
                                No anomalies detected in current cycle. All orchestration loops strictly adhering to on-chain governance rules.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}
