"use client";

import { HeroSection } from "@/components/blocks/hero-section-1";
import { FeaturesSectionWithBentoGrid } from "@/components/blocks/feature-section-with-bento-grid";
import { ProgramCard } from "@/components/ProgramCard";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { Footerdemo } from "@/components/ui/footer-section";
import { Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X402TxHistory } from "@/components/X402TxHistory";

import { useReadContract, useReadContracts } from "wagmi";
import { PROGRAM_REGISTRY_ABI, PROGRAM_REGISTRY_ADDRESS } from "@/lib/contracts";

export default function LandingPage() {
  // 1. Get total number of programs
  const { data: nextProgramId } = useReadContract({
    address: PROGRAM_REGISTRY_ADDRESS,
    abi: PROGRAM_REGISTRY_ABI,
    functionName: "nextProgramId",
  });

  // 2. Fetch programs if we have a count
  const programCount = nextProgramId ? Number(nextProgramId) : 0;

  const { data: programsData, isLoading } = useReadContracts({
    contracts: Array.from({ length: Math.min(programCount, 6) }).map((_, i) => ({
      address: PROGRAM_REGISTRY_ADDRESS,
      abi: PROGRAM_REGISTRY_ABI,
      functionName: "getProgram",
      args: [BigInt(i)],
    })),
  });

  interface Program {
    id: string;
    type: string;
    budget: string;
    status: string;
    name: string;
  }

  const programs: Program[] = (programsData?.map((res: any) => {
    const p = res.result;
    if (!p) return null;
    return {
      id: p.id.toString(),
      type: ["Hackathon", "Bounty", "Grant", "Payroll"][Number(p.programType)],
      budget: p.budget.toString(),
      status: Number(p.status) === 0 ? "Active" : "Closed",
      name: p.metadataURI || `Program ${p.id}`
    };
  }) || []).filter((p): p is Program => p !== null);

  // Fallback mock data for hackathon demo if no active programs found
  const displayPrograms = programs.length > 0 ? programs : [
    { id: "1", name: "Global Builder Grant", type: "Grant", budget: "50000000000", status: "Active" },
    { id: "2", name: "Cronos zkEVM Hackathon", type: "Hackathon", budget: "25000000000", status: "Active" },
    { id: "3", name: "Protocol Security Audit", type: "Bounty", budget: "10000000000", status: "Active" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <HeroSection />

      {/* PRIORITY 2: CRONOS ECOSYSTEM SHOWCASE */}
      <div className="max-w-7xl mx-auto px-6 mb-12 -mt-10 relative z-10">
        <div className="glass-dark p-12 rounded-3xl mb-12 border border-white/10 shadow-2xl shadow-glow-purple/20">
          <div className="grid md:grid-cols-3 gap-8 text-center divide-x divide-white/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-black text-glow-purple mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">6</div>
              <div className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px]">Live x402 Txs</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-black text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">$4,950</div>
              <div className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px]">Distributed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl font-black text-blue-400 mb-2 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]">95%</div>
              <div className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px]">Efficiency</div>
            </motion.div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-glow-purple/10 to-glow-blue/10 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Cronos x402 Main Track</h3>
              <p className="text-white/60">AI Treasury OS: Policy → Agent → x402 Payouts</p>
            </div>
            <a
              href="https://explorer.cronos.org/testnet"
              target="_blank"
              className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl border border-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 font-bold"
            >
              <span>View on Cronos Explorer</span>
              <span>🔗</span>
            </a>
          </div>
        </div>

        {/* Live X402 Transactions Preview */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Live x402 Transactions</h3>
              <p className="text-white/60 text-sm">Real-time gasless payouts executed by autonomous agents</p>
            </div>
            <Link href="/transactions">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                View Full History
              </Button>
            </Link>
          </div>
          <X402TxHistory />
        </div>
      </div>

      {/* Feature Bento Grid */}
      <FeaturesSectionWithBentoGrid />

      {/* Active Programs Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Live Ecosystem <span className="text-glow-purple">Programs</span>
              </h2>
              <p className="text-gray-400 max-w-lg">
                Explore mission-critical initiatives currently being managed and secured by Croquity agents.
              </p>
            </div>

            <Link href="/programs">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all group">
                <span className="font-semibold">Explore All</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20 w-full">
              <Loader2 className="w-10 h-10 animate-spin text-glow-purple" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPrograms.length > 0 ? (
                displayPrograms.map((program) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProgramCard program={program} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-gray-400 font-medium">No live programs found in registry.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <StaggerTestimonials />

      <Footerdemo />
    </main>
  );
}
