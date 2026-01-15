"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, Clock } from "lucide-react";

const LIVE_TRANSACTIONS = [
    {
        hash: "0x5ceb4fa23ec5e97ef0bfc7e23275e6ecf5ece3fbee33025bb8472488e576b661",
        program: "Hackathon Q1",
        amount: "300.00 USDC",
        status: "CONFIRMED",
        time: "Jan 14, 2025"
    },
    {
        hash: "0x6bbc28e3fa884ec803a65aaf51a7a665afbb3494e99c019bee7472195a194712",
        program: "BioMed Grant",
        amount: "500.00 USDC",
        status: "CONFIRMED",
        time: "Jan 14, 2025"
    },
    {
        hash: "0xaa6f9e73f3124bbbf622b691c4779260f72610b269b83bdeb016abd6b5e5ac12",
        program: "Security Bounty",
        amount: "200.00 USDC",
        status: "CONFIRMED",
        time: "Jan 14, 2025"
    },
    {
        hash: "0x4797ae999476e186ac35e9d743affb7008ed7f548c62f8ce718462db07adf8cb",
        program: "Core Contributor",
        amount: "250.00 USDC",
        status: "CONFIRMED",
        time: "Jan 14, 2025"
    },
    {
        hash: "0xf14377fadf5b67450e1a73708ae06221daad3da481271b4b3261e154cd08e18a",
        program: "RWA Settlement",
        amount: "750.00 USDC",
        status: "CONFIRMED",
        time: "Jan 14, 2025"
    },
    {
        hash: "0x09405df501e759d17c30b180cfa0aa7c9ec41ed7bd7b8cee454b189f333f89c0",
        program: "Dev Tooling Grant",
        amount: "450.00 USDC",
        status: "CONFIRMED",
        time: "Jan 14, 2025"
    }
];

import { motion } from "framer-motion";

export function X402TxHistory() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                    </div>
                    <h3 className="text-sm font-black text-white/90 uppercase tracking-[0.2em]">
                        Live Execution Log <span className="text-white/30 font-medium ml-2">[{LIVE_TRANSACTIONS.length} Confirmations]</span>
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
                        {LIVE_TRANSACTIONS.map((tx, idx) => (
                            <motion.tr
                                key={tx.hash}
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
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
