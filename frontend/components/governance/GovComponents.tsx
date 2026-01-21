"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Vote, Users, FileText, CheckCircle2, Clock, Play } from 'lucide-react';

export const GovStatCard = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) => (
    <div className="glass-dark p-6 rounded-3xl border border-white/10 relative group overflow-hidden">
        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
            <Icon className={`w-4 h-4 text-${color}-400`} />
            {label}
        </div>
        <div className="text-3xl font-black text-white">{value}</div>
    </div>
);

export const ProposalCard = ({
    title,
    status,
    type,
    votesFor,
    votesAgainst,
    onVote
}: {
    title: string;
    status: 'active' | 'passed' | 'failed' | 'queued';
    type: string;
    votesFor: number;
    votesAgainst: number;
    onVote?: () => void;
}) => {
    const totalVotes = votesFor + votesAgainst;
    const forPercent = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;

    const statusColors = {
        active: 'text-glow-purple bg-glow-purple/10 border-glow-purple/20',
        passed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        failed: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
        queued: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    };

    const icons = {
        active: <Clock className="w-3 h-3" />,
        passed: <CheckCircle2 className="w-3 h-3" />,
        failed: <FileText className="w-3 h-3" />,
        queued: <Play className="w-3 h-3" />
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded bg-white/5 text-white/40">
                    {type}
                </span>
                <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border ${statusColors[status]}`}>
                    {icons[status]}
                    {status}
                </span>
            </div>

            <h4 className="text-lg font-bold text-white mb-6 group-hover:text-glow-purple transition-colors leading-tight">
                {title}
            </h4>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                        <span>For: {votesFor.toLocaleString()}</span>
                        <span>{forPercent.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${forPercent}%` }}
                            className="h-full bg-glow-purple shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                        />
                    </div>
                </div>

                {status === 'active' && (
                    <button
                        onClick={onVote}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all"
                    >
                        Cast Your Vote
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export const PolicyVisualizer = ({ policy }: { policy: string }) => (
    <div className="glass-dark rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40 uppercase">Active Agent Policy Snippet</span>
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
            </div>
        </div>
        <pre className="p-4 font-mono text-[11px] text-gray-400 overflow-x-auto leading-relaxed">
            <code>{policy}</code>
        </pre>
    </div>
);
