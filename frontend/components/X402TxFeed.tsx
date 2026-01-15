"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Loader2, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface X402Transaction {
    id: string;
    txHash: string;
    amount: string;
    status: 'verified' | 'settling' | 'executed';
    timestamp: string;
    recipient: string;
}

// Mock data for demonstration
const MOCK_TRANSACTIONS: X402Transaction[] = [
    {
        id: "1",
        txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
        amount: "333333",
        status: "executed",
        timestamp: new Date(Date.now() - 120000).toISOString(),
        recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    },
    {
        id: "2",
        txHash: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        amount: "250000",
        status: "settling",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        recipient: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    },
    {
        id: "3",
        txHash: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        amount: "500000",
        status: "verified",
        timestamp: new Date(Date.now() - 30000).toISOString(),
        recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    }
];

export function X402TxFeed({ programId }: { programId?: string }) {
    const [transactions, setTransactions] = useState<X402Transaction[]>(MOCK_TRANSACTIONS);

    const getStatusBadge = (status: X402Transaction['status']) => {
        switch (status) {
            case 'executed':
                return (
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-glow-purple/20 text-glow-purple border border-glow-purple/30 text-[10px] font-black uppercase tracking-tighter">
                        <CheckCircle className="w-3 h-3 mr-1" /> Executed
                    </div>
                );
            case 'settling':
                return (
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-tighter">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Settling
                    </div>
                );
            case 'verified':
                return (
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-glow-blue/20 text-glow-blue border border-glow-blue/30 text-[10px] font-black uppercase tracking-tighter">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </div>
                );
        }
    };

    return (
        <div className="glass-dark rounded-3xl border border-white/10 p-6 space-y-6">
            {/* Header with Badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-glow-purple/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-glow-purple" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">X402 Transactions</h4>
                        <p className="text-xs text-gray-500">EIP-3009 Gasless Payments</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glow-purple/10 border border-glow-purple/20">
                    <div className="w-2 h-2 rounded-full bg-glow-purple animate-pulse" />
                    <span className="text-xs font-bold text-glow-purple uppercase tracking-widest">LIVE</span>
                </div>
            </div>

            {/* EIP-3009 Compliance Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-gray-400">EIP-3009 Compliant</span>
                <span className="text-xs text-gray-600">• Gasless • Secure • Instant</span>
            </div>

            {/* Transactions Table */}
            <div className="space-y-3">
                {transactions.map((tx, index) => (
                    <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-glow-purple/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold text-white">
                                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                                    </span>
                                    <a
                                        href={`https://explorer.zkevm.cronos.org/testnet/tx/${tx.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ExternalLink className="w-3 h-3 text-gray-500 hover:text-glow-purple" />
                                    </a>
                                </div>
                                <div className="text-[10px] text-gray-500">
                                    To: {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-4)}
                                </div>
                            </div>
                            {getStatusBadge(tx.status)}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div>
                                <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-0.5">Amount</div>
                                <div className="font-mono text-sm font-black text-white">
                                    ${(parseFloat(tx.amount) / 1e6).toLocaleString()} USDC
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-0.5">Time</div>
                                <div className="text-xs text-gray-400">
                                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Volume</div>
                    <div className="font-mono text-sm font-bold text-white">
                        ${(transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) / 1e6).toLocaleString()}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Transactions</div>
                    <div className="font-mono text-sm font-bold text-glow-purple">{transactions.length}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Success Rate</div>
                    <div className="font-mono text-sm font-bold text-emerald-500">100%</div>
                </div>
            </div>
        </div>
    );
}
