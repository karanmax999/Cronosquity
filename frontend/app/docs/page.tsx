"use client";

import { Book, Code, Terminal, Layers } from "lucide-react";

export default function DocsPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-[300px_1fr] gap-12">

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="glass-dark p-6 rounded-2xl border border-white/10">
                        <h3 className="font-bold text-white mb-4 px-2">Documentation</h3>
                        <nav className="space-y-1">
                            {["Introduction", "Architecture", "X402 Standard", "Integration Guide", "Agent Logic", "Security"].map((item, i) => (
                                <button key={i} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-glow-purple/20 text-glow-purple' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-6">Introduction to Croquity</h1>
                        <p className="text-lg text-white/70 leading-relaxed mb-8">
                            Croquity is an **Autonomous Treasury OS** built on Cronos. It enables DAOs, hackathons, and grant programs to automate fund distribution using AI agents that adhere to strict on-chain policies.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-dark p-6 rounded-2xl border border-white/10">
                            <Terminal className="w-8 h-8 text-emerald-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Agent Execution</h3>
                            <p className="text-sm text-white/60">
                                How the Node.js agent monitors policy and executes logic.
                            </p>
                        </div>
                        <div className="glass-dark p-6 rounded-2xl border border-white/10">
                            <Layers className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">X402 Standard</h3>
                            <p className="text-sm text-white/60">
                                Leveraging EIP-3009 for gasless stablecoin payouts.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Quick Start</h2>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-6 font-mono text-sm text-gray-300 overflow-x-auto">
                            <p className="text-emerald-400"># Install the SDK</p>
                            <p>npm install @croquity/sdk</p>
                            <br />
                            <p className="text-emerald-400"># Initialize Agent</p>
                            <p>const agent = new CroquityAgent(config);</p>
                            <p>await agent.start();</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
