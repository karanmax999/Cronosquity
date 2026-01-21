"use client";

import React, { useState, useEffect } from "react";
import { Book, Code, Terminal, Layers, Shield, Cpu, Zap, ChevronRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DocSection, CodeBlock, DocCallout, DocSteps } from "@/components/docs/DocComponents";

const sections = [
    { id: "intro", title: "Introduction", icon: Book },
    { id: "quickstart", title: "Quick Start", icon: Zap },
    { id: "architecture", title: "Architecture", icon: Layers },
    { id: "x402", title: "X402 Standard", icon: Shield },
    { id: "agent", title: "Agent Logic", icon: Cpu },
    { id: "contracts", title: "Smart Contracts", icon: Code },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("intro");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5, rootMargin: "-10% 0px -70% 0px" }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setActiveSection(id);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <main className="min-h-screen bg-universe-black pt-24 pb-24 px-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-glow-purple/5 blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-glow-blue/5 blur-[120px] -z-10 animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-glow-purple shadow-lg shadow-glow-purple/20 text-white"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed inset-0 z-40 lg:relative lg:z-0 lg:block lg:w-72
                    ${isMobileMenuOpen ? 'flex' : 'hidden'}
                    flex-col bg-universe-black/80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none
                `}>
                    <div className="sticky top-24 space-y-8 p-6 lg:p-0">
                        <div className="glass-dark p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                            <h3 className="font-bold text-white mb-6 px-2 flex items-center gap-2">
                                <Book className="w-4 h-4 text-glow-purple" />
                                Documentation
                            </h3>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollTo(section.id)}
                                        className={`
                                            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                                            ${activeSection === section.id
                                                ? 'bg-glow-purple/10 text-glow-purple border border-glow-purple/20'
                                                : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-glow-purple' : 'opacity-50'}`} />
                                            {section.title}
                                        </div>
                                        {activeSection === section.id && (
                                            <motion.div layoutId="indicator" className="w-1.5 h-1.5 rounded-full bg-glow-purple shadow-[0_0_8px_rgba(168,85,247,0.8)]"></motion.div>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="glass-dark p-6 rounded-2xl border border-white/10 opacity-60">
                            <h4 className="text-xs font-bold text-white/40 uppercase mb-4 px-2">Resources</h4>
                            <div className="space-y-3">
                                {["GitHub Repo", "API Reference", "Support"].map((item) => (
                                    <button key={item} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-2">
                                        <ChevronRight className="w-3 h-3" />
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 max-w-4xl space-y-24">

                    <DocSection id="intro" title="Introduction to Croquity">
                        <p className="text-xl text-white/80 leading-relaxed font-light">
                            Croquity is an <span className="text-white font-semibold">Autonomous Treasury OS</span> designed for the Cronos ecosystem. It bridge the gap between AI-driven decision-making and on-chain financial execution.
                        </p>
                        <p>
                            By leveraging the <span className="text-glow-purple font-medium">X402 (EIP-3009)</span> standard, Croquity enables organizations to distribute funds gaslessly, ensuring that recipients receive the full amount intended without needing to manage gas tokens.
                        </p>
                        <DocCallout type="tip">
                            Croquity is currently live on Cronos Testnet, having successfully executed multiple autonomous payouts across Hackathons, Grants, and Bounties.
                        </DocCallout>
                    </DocSection>

                    <DocSection id="quickstart" title="Quick Start">
                        <p>Get your autonomous treasury up and running in minutes.</p>
                        <DocSteps steps={[
                            {
                                title: "Clone and Install",
                                content: (
                                    <>
                                        <p>Download the Croquity repository and install dependencies for the frontend and agent.</p>
                                        <CodeBlock language="bash" code="git clone https://github.com/karanmax999/Croquity.git&#10;cd Croquity/frontend && npm install" />
                                    </>
                                )
                            },
                            {
                                title: "Configure Environment",
                                content: (
                                    <>
                                        <p>Set up your environment variables for RPC endpoints and private keys.</p>
                                        <CodeBlock language="bash" code="NEXT_PUBLIC_RPC_URL=https://evm-t3.cronos.org&#10;AGENT_PRIVATE_KEY=your_key_here" />
                                    </>
                                )
                            },
                            {
                                title: "Launch Dashboard",
                                content: (
                                    <>
                                        <p>Start the development server to see your treasury live.</p>
                                        <CodeBlock language="bash" code="npm run dev" />
                                    </>
                                )
                            }
                        ]} />
                    </DocSection>

                    <DocSection id="architecture" title="System Architecture">
                        <p>Croquity operates as a distributed system where the frontend, agent, and smart contracts synchronize via the blockchain.</p>
                        <div className="my-8 glass-dark p-8 rounded-3xl border border-white/10 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-glow-purple/5 to-glow-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative space-y-6">
                                <div className="flex justify-between items-center px-4 py-2 bg-white/5 rounded-full border border-white/10 w-fit mx-auto">
                                    <span className="text-xs font-mono text-white/60">Frontend Layer (Vercel)</span>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-1 h-12 bg-gradient-to-b from-glow-purple to-transparent"></div>
                                </div>
                                <div className="flex justify-between items-center px-4 py-2 bg-glow-purple/20 rounded-full border border-glow-purple/30 w-fit mx-auto">
                                    <span className="text-xs font-mono text-white">Cronos Blockchain Layer</span>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-1 h-12 bg-gradient-to-t from-glow-blue to-transparent"></div>
                                </div>
                                <div className="flex justify-between items-center px-4 py-2 bg-white/5 rounded-full border border-white/10 w-fit mx-auto">
                                    <span className="text-xs font-mono text-white/60">Agent Layer (Render)</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm italic text-white/40 text-center">
                            Shared source of truth: The ProgramRegistry and ProgramVault contracts.
                        </p>
                    </DocSection>

                    <DocSection id="x402" title="X402 & Gasless Rails">
                        <p>We use the EIP-3009 standard for "Transfer with Authorization". This is the core of our gasless experience.</p>
                        <DocCallout type="info">
                            Recipients do not need TCRO to receive payouts. The gas costs are handled by the Facilitator or the program treasury itself.
                        </DocCallout>
                        <CodeBlock language="typescript" code={`// Generating a gasless payout authorization
const auth = await facilitator.generatePaymentHeader({
    recipient: "0x...",
    amount: parseUnits("100", 6),
    validAfter: 0,
    validBefore: Math.floor(Date.now() / 1000) + 3600
});`} />
                    </DocSection>

                    <DocSection id="agent" title="Agentic Finance Logic">
                        <p>The Croquity Agent is not just a script; it's a policy-aware orchestrator. It follows a strict 4-step loop:</p>
                        <ul className="grid md:grid-cols-2 gap-4">
                            {[
                                { t: "Ingest", d: "Polls registry for new submission events." },
                                { t: "Plan", d: "Calculates optimized payout batches." },
                                { t: "Verify", d: "Checks against multi-sig or AI policies." },
                                { t: "Execute", d: "Triggers the x402 settlement." }
                            ].map((step, i) => (
                                <li key={i} className="glass-dark p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                                    <span className="text-glow-purple font-bold text-sm">0{i + 1}. {step.t}</span>
                                    <span className="text-xs text-white/50">{step.d}</span>
                                </li>
                            ))}
                        </ul>
                    </DocSection>

                    <DocSection id="contracts" title="Smart Contracts">
                        <p>Our infrastructure is secured by audited-style patterns on Cronos.</p>
                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-glow-purple transition-colors">
                                <h4 className="font-bold text-white mb-2 underline decoration-glow-purple/50">ProgramRegistry</h4>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    Registers program metadata, active durations, and policy IDs.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-glow-blue transition-colors">
                                <h4 className="font-bold text-white mb-2 underline decoration-glow-blue/50">ProgramVault</h4>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    Custodies funds and enforces x402 signature verification.
                                </p>
                            </div>
                        </div>
                    </DocSection>

                    {/* Footer for Docs */}
                    <div className="pt-24 border-t border-white/5 flex justify-between items-center text-white/30 text-xs">
                        <p>© 2026 Croquity Treasury OS</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">Discord</a>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
