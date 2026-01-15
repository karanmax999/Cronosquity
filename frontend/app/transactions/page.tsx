"use client";

import { X402TxHistory } from "@/components/X402TxHistory";
import { ArrowLeft, Filter, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-universe-black">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Transaction <span className="text-glow-purple">History</span>
                        </h1>
                        <p className="text-white/60 mt-2 text-lg">
                            Complete ledger of all autonomous payouts executed via the X402 standard.
                        </p>
                    </div>
                </div>

                {/* Filters / Toolbar */}
                <div className="glass-dark p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search by TxHash, Program, or Amount..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-glow-purple/50 transition-all"
                        />
                    </div>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button className="bg-white/10 text-white hover:bg-white/20">
                        Export CSV
                    </Button>
                </div>

                {/* Main Table */}
                <div className="glass-dark p-1 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-glow-purple/5">
                    <div className="bg-black/40 p-6">
                        <X402TxHistory />
                    </div>
                </div>
            </div>
        </main>
    );
}
