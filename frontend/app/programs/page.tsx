"use client";

import { motion } from "framer-motion";
import { ProgramCard } from "@/components/ProgramCard";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock data mirrored from homepage fallback
const PROGRAMS = [
    { id: "1", name: "BioMed Research Grant", type: "Grant", budget: "500000000000000000000", status: "Active" }, // 500 USDC
    { id: "2", name: "Cronos zkEVM Hackathon", type: "Hackathon", budget: "900000000000000000000", status: "Active" }, // 900 USDC
    { id: "3", name: "Protocol Security Bounty", type: "Bounty", budget: "200000000000000000000", status: "Active" }, // 200 USDC
    { id: "4", name: "Core Contributor Payroll", type: "Payroll", budget: "250000000000000000000", status: "Active" }, // 250 USDC
];

export default function ProgramsPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Active <span className="text-glow-purple">Programs</span>
                        </h1>
                        <p className="text-white/60 max-w-xl text-lg">
                            Explore autonomous funding initiatives managed by AI agents.
                            Transparent, policy-driven, and secured by the X402 standard.
                        </p>
                    </div>
                    <Link href="/launch">
                        <Button className="h-12 px-8 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl backdrop-blur-md transition-all">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Program
                        </Button>
                    </Link>
                </div>

                {/* Programs Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROGRAMS.map((program, index) => (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/programs/${program.id}`} className="block group h-full">
                                <div className="card-border-glow rounded-3xl overflow-hidden bg-black/40 backdrop-blur-sm transition-all group-hover:bg-white/5 h-full">
                                    <ProgramCard program={program} />
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Coming Soon Placeholder */}
                    <div className="border border-dashed border-white/10 rounded-3xl bg-white/5 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-white/40" />
                        </div>
                        <h3 className="text-xl font-bold text-white/40">New Program</h3>
                        <p className="text-sm text-white/20">Launch a customized funding initiative</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
