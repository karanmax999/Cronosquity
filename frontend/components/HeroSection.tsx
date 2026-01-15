"use client";

import { motion } from "framer-motion";
import { AgentPulse } from "./AgentPulse";
import { Shield, Zap, Lock } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 hero-glow -z-10" />

            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-center lg:text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-glow-purple/10 border border-glow-purple/20 text-glow-purple text-sm font-semibold mb-6">
                            v2.0 Universe Update
                        </span>
                        <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                            Autonomous
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-glow-purple via-glow-blue to-emerald-400">
                                Treasury Stewardship
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                            The first AI-orchestrated governance layer for Cronos x402. Launch, automate, and secure your ecosystem with zero-trust agentic policies.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap justify-center lg:justify-start gap-4"
                    >
                        <button className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-glow-purple hover:text-white transition-all shadow-2xl shadow-glow-purple/20">
                            Start Building
                        </button>
                        <button className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                            Read the Whitepaper
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="flex items-center justify-center lg:justify-start gap-8 pt-8"
                    >
                        {[
                            { icon: Shield, hex: "#a855f7", label: "Policy Guard" },
                            { icon: Zap, hex: "#3b82f6", label: "Instant Sync" },
                            { icon: Lock, hex: "#10b981", label: "X402 Secure" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2 group">
                                <item.icon className="w-5 h-5" style={{ color: item.hex }} />
                                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="flex-1 w-full max-w-[500px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Ambient Background for Agent */}
                        <div className="absolute inset-0 bg-glow-purple/20 blur-[80px] rounded-full animate-pulse" />
                        <div className="relative z-10 p-8 glass-dark rounded-[2.5rem] border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Agent Active</span>
                            </div>
                            <AgentPulse activeStep="verify" />
                            <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-glow-purple to-glow-blue"
                                        animate={{ width: ["20%", "80%", "40%", "90%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                                    <span>ANALYZING_POLICY</span>
                                    <span>v2.0.4</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
