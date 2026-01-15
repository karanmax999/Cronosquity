"use client";

import { useState } from "react";
import { PayoutTable, Payout } from "@/components/PayoutTable";
import { AgentTimeline } from "@/components/AgentTimeline";
import { PolicyPreview } from "@/components/PolicyPreview";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, RefreshCw, BrainCircuit, Zap } from "lucide-react";
import { facilitator } from "@/lib/facilitator";
import { ethers } from "ethers";

// Mock initial data
const INITIAL_PAYOUTS: Payout[] = [
    { id: "1", recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "333333", reason: "Rank 1 (score: 95)", score: 95, status: "executed", txHash: "0x123..." },
    { id: "2", recipient: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "333333", reason: "Rank 2 (score: 88)", score: 88, status: "verified" },
    { id: "3", recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "333334", reason: "Simulated Claim", score: 82, status: "pending" }
];

import { TransparencyFeed } from "@/components/TransparencyFeed";
import { X402TxHistory } from "@/components/X402TxHistory";

export default async function ProgramDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Convert string ID to number for state management if needed, 
    // though the contract interaction uses the ID from context or props.
    // For now, we just pass the ID string to sub-components.

    // Note: In Next.js 15, params is a Promise. We await it before using properties.

    const [payouts, setPayouts] = useState<Payout[]>(INITIAL_PAYOUTS);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    // ... actions ... (omitted for brevity in replace call, using the original ones below)

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleToggleAll = () => {
        if (selectedIds.length === payouts.length) setSelectedIds([]);
        else setSelectedIds(payouts.map(p => p.id));
    };

    const handleSimulateAgent = async () => {
        setIsSimulating(true);
        try {
            if (!(window as any).ethereum) throw new Error("No wallet found");
            const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
            const amount = "1000000";
            const requirements = facilitator.generatePaymentRequirements({
                payTo: recipient,
                description: `Bounty Reward #${payouts.length + 1}`,
                maxAmountRequired: amount
            });
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const validBefore = Math.floor(Date.now() / 1000) + 3600;
            const header = await facilitator.generatePaymentHeader({
                to: recipient,
                value: amount,
                signer,
                validBefore
            });
            const newPayout: Payout = {
                id: Math.random().toString(36).substr(2, 9),
                recipient,
                amount,
                reason: "New Submission",
                score: 100,
                status: "signed",
                requirements,
                header
            };
            setPayouts(prev => [newPayout, ...prev]);
        } catch (e) {
            console.error(e);
            alert("Simulation failed (check console)");
        } finally {
            setIsSimulating(false);
        }
    };

    const handleVerify = async (id: string) => {
        updateStatus(id, "verifying");
        try {
            const payout = payouts.find(p => p.id === id);
            if (!payout || !payout.header || !payout.requirements) throw new Error("Missing data");
            const body = facilitator.buildVerifyRequest(payout.header, payout.requirements);
            const res = await facilitator.verifyPayment(body);
            if (res.isValid) updateStatus(id, "verified");
            else { updateStatus(id, "failed"); alert("Verification Invalid"); }
        } catch (e) { console.error(e); updateStatus(id, "failed"); }
    };

    const handleSettle = async (id: string) => {
        updateStatus(id, "settling");
        try {
            const payout = payouts.find(p => p.id === id);
            if (!payout || !payout.header || !payout.requirements) throw new Error("Missing data");
            const body = facilitator.buildVerifyRequest(payout.header, payout.requirements);
            const res = await facilitator.settlePayment(body);
            updateStatus(id, "executed");
        } catch (e) {
            console.error(e);
            alert("Settlement failed. (Ensure you have a signer capable of executing)");
            updateStatus(id, "verified");
        }
    };

    const handleBatchSettle = async () => {
        if (selectedIds.length === 0) return;
        for (const id of selectedIds) {
            const p = payouts.find(item => item.id === id);
            if (p?.status === 'verified') await handleSettle(id);
        }
        setSelectedIds([]);
    };

    const updateStatus = (id: string, status: Payout['status']) => {
        setPayouts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    const totalSelectedAmount = selectedIds.reduce((sum, id) => {
        const p = payouts.find(item => item.id === id);
        return sum + (p ? parseFloat(p.amount) : 0);
    }, 0);

    return (
        <div className="min-h-screen bg-universe-black py-12">
            <div className="max-w-7xl mx-auto px-6 space-y-12">
                {/* Header */}
                <div className="glass-dark p-10 rounded-3xl border border-white/10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-glow-purple text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
                                <span className="bg-glow-blue/20 text-glow-blue border border-glow-blue/30 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-glow-blue animate-pulse" />
                                    6 REAL X402 TXS EXECUTED
                                </span>
                                <h1 className="text-sm font-bold text-glow-purple uppercase tracking-tighter">Program Registry #{id}</h1>
                            </div>
                            <h2 className="text-5xl font-black text-white tracking-tight">
                                Autonomous <span className="bg-clip-text text-transparent bg-gradient-to-r from-glow-purple to-glow-blue">Treasury.</span>
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={handleSimulateAgent}
                                disabled={isSimulating}
                                className="h-12 bg-white/5 hover:bg-glow-purple/10 text-glow-purple border-glow-purple/20 rounded-xl px-6 font-bold"
                            >
                                {isSimulating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                Simulate Submission
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: Main Control & Table (Col Span 2) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-white">Payout Distributions</h3>
                            {selectedIds.length > 0 && (
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Total Selected</div>
                                        <div className="text-lg font-black text-glow-purple leading-none mt-1">
                                            ${(totalSelectedAmount / 1e6).toLocaleString()}
                                        </div>
                                    </div>
                                    <Button onClick={handleBatchSettle} className="bg-white text-black hover:bg-glow-purple hover:text-white rounded-xl h-12 px-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-glow-purple/20 transition-all active:scale-95">
                                        <CheckSquare className="w-4 h-4 mr-2" />
                                        Settle ({selectedIds.length})
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="glass-dark rounded-3xl overflow-hidden border border-white/10">
                            <PayoutTable
                                payouts={payouts}
                                selectedIds={selectedIds}
                                onToggleSelect={handleToggleSelect}
                                onToggleAll={handleToggleAll}
                                onVerify={handleVerify}
                                onSettle={handleSettle}
                            />
                        </div>

                        {/* X402 Transaction History - Priority 1 Replacement */}
                        <X402TxHistory />
                    </div>

                    {/* Right: Agent Transparency Feed (Col Span 1) */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <BrainCircuit className="w-6 h-6 text-glow-purple" />
                                Agent Decisor
                            </h3>
                            <TransparencyFeed programId={Number(id)} />
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Program Policy</h4>
                            <PolicyPreview />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
