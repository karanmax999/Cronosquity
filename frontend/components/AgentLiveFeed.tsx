"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, CheckCircle, Activity } from "lucide-react";

interface AgentLog {
    id: string;
    timestamp: string;
    message: string;
    description: string;
    type: "decision" | "info" | "error";
}

export function AgentLiveFeed() {
    const [logs, setLogs] = useState<AgentLog[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/agent-logs.json");
                const data = await res.json();
                setLogs(data.slice(0, 5)); // Only show latest 5
            } catch (e) {
                console.error("Failed to fetch agent logs", e);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Polling for demo
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-md glass-dark rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] border border-white/10">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                <Terminal className="w-4 h-4 text-glow-purple" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Core.Agent_Stream</span>
                <div className="ml-auto flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glow-purple opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-glow-purple"></span>
                    </span>
                    <span className="text-[10px] text-glow-purple font-black tracking-widest uppercase">Live</span>
                </div>
            </div>

            <div className="p-6 space-y-6 bg-black/40">
                <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                            className="flex gap-4 group cursor-default"
                        >
                            <div className="mt-1 flex-shrink-0">
                                {log.type === "decision" ? (
                                    <div className="p-2 rounded-lg bg-glow-purple/10 border border-glow-purple/20">
                                        <Shield className="w-3.5 h-3.5 text-glow-purple" />
                                    </div>
                                ) : (
                                    <div className="p-2 rounded-lg bg-glow-blue/10 border border-glow-blue/20">
                                        <Activity className="w-3.5 h-3.5 text-glow-blue" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1.5 flex-1 pt-0.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-black text-white/90 group-hover:text-glow-purple transition-colors font-mono uppercase tracking-tight">{log.message}</p>
                                    <span className="text-[9px] font-mono text-white/30">{log.timestamp}</span>
                                </div>
                                <p className="text-[11px] text-white/40 leading-relaxed font-medium font-mono line-clamp-2">
                                    {'> '} {log.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
