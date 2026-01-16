"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { usePublicClient } from "wagmi";
import { parseAbiItem, formatUnits } from "viem";
import { PROGRAM_VAULT_ADDRESS } from "@/lib/contracts";

// Hardcoded mapping for demo purposes since we don't fetch metadata yet
const PROGRAM_NAMES: Record<number, string> = {
    0: "Bounty Program",
    1: "Hackathon Q1",
    2: "BioMed Grant",
    3: "Security Bounty",
    4: "Core Contributor",
    5: "RWA Settlement",
    6: "Dev Tooling Grant",
    7: "Payroll",
};

interface Transaction {
    hash: string;
    program: string;
    amount: string;
    status: string;
    time: string;
}

export function X402TxHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const publicClient = usePublicClient();

    useEffect(() => {
        if (!publicClient) return;

        const fetchLogs = async () => {
            try {
                // Fetch last 1000 blocks or from deployment
                // PayoutExecuted(uint256 indexed programId, address indexed recipient, uint256 amount, string reason)
                const logs = await publicClient.getLogs({
                    address: PROGRAM_VAULT_ADDRESS,
                    event: parseAbiItem('event PayoutExecuted(uint256 indexed programId, address indexed recipient, uint256 amount, string reason)'),
                    fromBlock: 'earliest', // query from start for demo
                    toBlock: 'latest'
                });

                // Process logs into transactions (reverse chronological)
                const txs = await Promise.all(
                    logs.reverse().slice(0, 10).map(async (log) => {
                        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                        const date = new Date(Number(block.timestamp) * 1000).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        });

                        const programId = Number(log.args.programId);
                        const amount = log.args.amount ? formatUnits(log.args.amount, 6) : "0"; // USDC.e has 6 decimal places

                        return {
                            hash: log.transactionHash,
                            program: PROGRAM_NAMES[programId] || `Program #${programId}`,
                            amount: `${Number(amount).toFixed(2)} USDC.e`,
                            status: "CONFIRMED",
                            time: date
                        };
                    })
                );

                setTransactions(txs);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch logs:", error);
                setLoading(false);
            }
        };

        fetchLogs();

        // Optional: Set up polling or watch event here for live updates
        const interval = setInterval(fetchLogs, 15000); // Poll every 15s for new blocks

        return () => clearInterval(interval);

    }, [publicClient]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                    </div>
                    <h3 className="text-sm font-black text-white/90 uppercase tracking-[0.2em]">
                        Live Execution Log <span className="text-white/30 font-medium ml-2">[{transactions.length} On-Chain]</span>
                    </h3>
                </div>
                <Badge variant="outline" className="text-glow-purple border-glow-purple/30 bg-glow-purple/10 font-black tracking-widest text-[10px]">
                    MAIN TRACK: x402
                </Badge>
            </div>

            <div className="glass-dark rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                <Table>
                    <TableHeader className="bg-white/5 backdrop-blur-3xl">
                        <TableRow className="border-white/10 hover:bg-transparent px-6">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 pl-8">Transaction Hash</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Program</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Amount</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/40 pr-8">Explorer</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-black/20 font-mono">
                        {loading && transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-white/30">
                                    Loading blockchain data...
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-white/30">
                                    No payouts found on Cronos Testnet yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx, idx) => (
                                <motion.tr
                                    key={`${tx.hash}-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-white/5 hover:bg-white/[0.03] transition-colors group"
                                >
                                    <TableCell className="text-[11px] text-white/40 group-hover:text-glow-purple transition-colors pl-8">
                                        {tx.hash.slice(0, 14)}...{tx.hash.slice(-12)}
                                    </TableCell>
                                    <TableCell className="text-white font-bold text-xs uppercase tracking-tight">
                                        {tx.program}
                                    </TableCell>
                                    <TableCell className="text-white/90 font-black text-xs">
                                        {tx.amount}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 bg-emerald-400/5 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                            <span className="text-emerald-400 text-[9px] font-black tracking-widest uppercase">Confirmed</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <a
                                            href={`https://explorer.cronos.org/testnet/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-white transition-all uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20"
                                        >
                                            Inspect
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </TableCell>
                                </motion.tr>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
