"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    { id: "ingest", name: "Ingest", icon: Activity, color: "text-blue-500" },
    { id: "plan", name: "Plan", icon: Zap, color: "text-amber-500" },
    { id: "verify", name: "Verify", icon: ShieldCheck, color: "text-emerald-500" },
    { id: "explain", name: "Explain", icon: MessageSquareQuote, color: "text-purple-500" },
];

export function AgentPulse({ activeStep = "ingest" }: { activeStep?: string }) {
    return (
        <div className="glass rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    AI Steward Heartbeat
                </h3>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    Live Sync
                </span>
            </div>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-[1.125rem] top-0 bottom-0 w-px bg-gray-100" />

                <div className="space-y-6">
                    {STEPS.map((step, idx) => {
                        const isActive = activeStep === step.id;
                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "flex items-center gap-4 relative z-10",
                                    !isActive && "opacity-40 grayscale-[0.5]"
                                )}
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500",
                                    isActive ? "bg-white border-emerald-200 shadow-sm scale-110" : "bg-gray-50 border-gray-100"
                                )}>
                                    <Icon className={cn("w-5 h-5", isActive ? step.color : "text-gray-400")} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className={cn(
                                            "font-semibold transition-colors",
                                            isActive ? "text-gray-900" : "text-gray-500"
                                        )}>
                                            {step.name}
                                        </p>
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className="text-[10px] uppercase tracking-wider font-bold text-emerald-600"
                                            >
                                                Analyzing...
                                            </motion.div>
                                        )}
                                    </div>
                                    {isActive && (
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                            Processing latest chain events and policies.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
