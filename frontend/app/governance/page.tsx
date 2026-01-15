"use client";

import { Vote, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GovernancePage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                    <Vote className="w-10 h-10 text-glow-purple" />
                </div>

                <h1 className="text-5xl font-black text-white tracking-tight">
                    Protocol <span className="text-glow-purple">Governance</span>
                </h1>

                <p className="text-white/60 text-lg leading-relaxed">
                    Croquity is governed by a decentralized collective of stakeholders.
                    Proposals update agent policies, adjust fee structures, and manage the treasury.
                </p>

                <div className="grid grid-cols-3 gap-4 text-left p-8 glass-dark rounded-3xl border border-white/10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                            <Users className="w-4 h-4" /> Holders
                        </div>
                        <div className="text-2xl font-black text-white">2,401</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                            <FileText className="w-4 h-4" /> Proposals
                        </div>
                        <div className="text-2xl font-black text-white">12</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                            <Vote className="w-4 h-4" /> Active
                        </div>
                        <div className="text-2xl font-black text-white">0</div>
                    </div>
                </div>

                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-6 rounded-xl font-bold" disabled>
                    Governance Launching Soon
                </Button>
            </div>
        </main>
    );
}
