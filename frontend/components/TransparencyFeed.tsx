"use client";

import { useEffect, useState } from "react";
import {
    Info,
    CheckCircle2,
    AlertCircle,
    Zap,
    ExternalLink,
    BrainCircuit,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogEntry {
    id: string;
    timestamp: string;
    programId: number;
    type: 'info' | 'success' | 'warning' | 'error' | 'decision';
    message: string;
    description?: string;
    txHash?: string;
}

export function TransparencyFeed({ programId }: { programId?: number }) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/agent-logs.json");
                if (res.ok) {
                    let allLogs: LogEntry[] = await res.json();
                    if (programId !== undefined) {
                        allLogs = allLogs.filter(l => l.programId === programId || l.programId === -1);
                    }
                    setLogs(allLogs);
                }
            } catch (e) {
                console.error("Failed to fetch agent logs", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [programId]);

    const getIcon = (type: LogEntry['type']) => {
        switch (type) {
            case 'info': return <Info className="w-4 h-4 text-blue-500" />;
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
            case 'decision': return <BrainCircuit className="w-4 h-4 text-purple-500" />;
            default: return <Zap className="w-4 h-4 text-gray-500" />;
        }
    };

    if (isLoading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-400">
                <Clock className="w-5 h-5 animate-pulse mr-2" />
                <span className="text-sm font-medium">Listening to Steward...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence initial={false}>
                {logs.length === 0 ? (
                    <div className="text-center py-12 px-6 glass rounded-2xl border-dashed">
                        <p className="text-gray-400 text-sm">No activity logs recorded for this program yet.</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative pl-8 group"
                        >
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-6 bottom-[-20px] w-px bg-gray-100 group-last:hidden" />

                            {/* Icon Circle */}
                            <div className="absolute left-0 top-0 w-6 h-6 rounded-full glass border border-white/50 flex items-center justify-center z-10">
                                {getIcon(log.type)}
                            </div>

                            <div className="glass p-4 rounded-2xl border border-white/20 hover:border-emerald-500/30 transition-all shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-bold text-gray-900 text-sm">{log.message}</h5>
                                    <span className="text-[10px] font-mono text-gray-400">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {log.description && (
                                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                        {log.description}
                                    </p>
                                )}
                                {log.txHash && (
                                    <a
                                        href={`https://explorer.zkevm.cronos.org/testnet/tx/${log.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        VIEW TRANSACTION
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
}
