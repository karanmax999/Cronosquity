"use client";

import { motion } from "framer-motion";
import { TransparencyFeed } from "./TransparencyFeed";
import { Shield, Coins, Activity, Zap } from "lucide-react";

export function BentoGrid() {
    return (
        <section className="py-20 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
                {/* Transparency Feed - Large Feature */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="md:col-span-2 md:row-span-2 glass-dark rounded-3xl border border-white/10 p-8 overflow-hidden relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-glow-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Transparency Feed</h3>
                        <p className="text-gray-400">Real-time audit logs of every treasury action and policy check.</p>
                    </div>
                    <div className="h-[500px] overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                        <TransparencyFeed />
                    </div>
                </motion.div>

                {/* Payout Logic */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-dark rounded-3xl border border-white/10 p-8 flex flex-col justify-between group"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-glow-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Coins className="text-glow-blue w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Payout Logic</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            X402 integration for automated, gasless stablecoin distributions based on agent verification.
                        </p>
                    </div>
                    <div className="pt-6">
                        <span className="text-[10px] font-bold text-glow-blue uppercase tracking-widest">EIP-3009 Compliant</span>
                    </div>
                </motion.div>

                {/* Security Guardrails */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-dark rounded-3xl border border-white/10 p-8 flex flex-col justify-between group"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield className="text-emerald-500 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Security Guardrails</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Immutable policies enforced by off-chain agents with on-chain settlement certainty.
                        </p>
                    </div>
                    <div className="pt-6">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gray-800 border-2 border-black" />
                            ))}
                            <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-black flex items-center justify-center">
                                <span className="text-[8px] text-white">+8</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
