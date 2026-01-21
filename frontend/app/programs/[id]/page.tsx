"use client";

import { useState, use } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { PROGRAM_VAULT_ABI, PROGRAM_VAULT_ADDRESS } from "@/lib/contracts";
import { PayoutTable, Payout } from "@/components/PayoutTable";
import { PolicyPreview } from "@/components/PolicyPreview";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, RefreshCw, BrainCircuit, Zap, Shield } from "lucide-react";
import { TransparencyFeed } from "@/components/TransparencyFeed";
import { X402TxHistory } from "@/components/X402TxHistory";
import { facilitator } from "@/lib/facilitator";
import { ethers } from "ethers";

// Mock initial data
const INITIAL_PAYOUTS: Payout[] = [
    { id: "1", recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "333333", reason: "Rank 1 (score: 95)", score: 95, status: "executed", txHash: "0x123..." },
    { id: "2", recipient: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "333333", reason: "Rank 2 (score: 88)", score: 88, status: "verified" },
    { id: "3", recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "333334", reason: "Simulated Claim", score: 82, status: "pending" }
];

export default function ProgramDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [payouts, setPayouts] = useState<Payout[]>(INITIAL_PAYOUTS);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    // Watch for live payouts on-chain
    useWatchContractEvent({
        address: PROGRAM_VAULT_ADDRESS,
        abi: PROGRAM_VAULT_ABI,
        eventName: "PayoutExecuted",
        onLogs(logs: any) {
            logs.forEach((log: any) => {
                const { programId, recipient, amount, reason } = log.args;
                if (programId.toString() === id) {
                    const newPayout: Payout = {
                        id: log.transactionHash,
                        recipient,
                        amount: amount.toString(),
                        reason,
                        score: 100, // Agent verified
                        status: "executed",
                        txHash: log.transactionHash
                    };
                    setPayouts(prev => {
                        // Avoid duplicates from existing history
                        if (prev.some(p => p.txHash === log.transactionHash)) return prev;
                        return [newPayout, ...prev];
                    });
                }
            });
        },
    });

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

            // Mock settlement for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockTxHash = `0x${Math.random().toString(16).slice(2, 66).padStart(64, '0')}`;
            updateStatus(id, "executed");
            setPayouts(prev => prev.map(p => p.id === id ? { ...p, txHash: mockTxHash } : p));
        } catch (e) {
            console.error(e);
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
        <div className="min-h-screen bg-universe-black py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-glow-purple/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
                <div className="glass-dark p-10 rounded-3xl border border-white/10 space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-glow-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-glow-purple text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.5)]">Live Monitoring</span>
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    SYNCED WITH VAULT
                                </span>
                                <h1 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-4">Program #{id}</h1>
                            </div>
                            <h2 className="text-6xl font-black text-white tracking-tighter leading-none mb-4">
                                Treasury <span className="text-glow-purple">Steward.</span>
                            </h2>
                            <p className="text-white/40 max-w-lg text-sm font-medium">
                                Real-time orchestration dashboard for program #{id}. The Croquity agent autonomously monitors policies and executes gasless x402 payouts.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={handleSimulateAgent}
                                disabled={isSimulating}
                                className="h-14 bg-white/5 hover:bg-glow-purple/20 text-white border-white/10 hover:border-glow-purple/50 rounded-2xl px-8 font-black text-xs uppercase tracking-widest transition-all"
                            >
                                {isSimulating ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin text-glow-purple" />
                                ) : (
                                    <Plus className="w-4 h-4 mr-2 text-glow-purple" />
                                )}
                                Simulate Agent Submission
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Event Streams</h3>
                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{payouts.length} Transactions Found</span>
                            </div>
                            {selectedIds.length > 0 && (
                                <div className="flex items-center gap-6 animate-in slide-in-from-right-4">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Selected Volume</div>
                                        <div className="text-xl font-black text-glow-purple leading-none mt-1">
                                            ${(totalSelectedAmount / 1e6).toLocaleString()}
                                        </div>
                                    </div>
                                    <Button onClick={handleBatchSettle} className="bg-glow-purple text-white hover:bg-glow-purple/80 rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">
                                        <CheckSquare className="w-4 h-4 mr-2" />
                                        Approve & Settle ({selectedIds.length})
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="glass-dark rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                            <PayoutTable
                                payouts={payouts}
                                selectedIds={selectedIds}
                                onToggleSelect={handleToggleSelect}
                                onToggleAll={handleToggleAll}
                                onVerify={handleVerify}
                                onSettle={handleSettle}
                            />
                        </div>

                        <div className="pt-4">
                            <div className="flex items-center gap-2 mb-6">
                                <Zap className="w-4 h-4 text-glow-blue" />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Historical Settlements</h4>
                            </div>
                            <X402TxHistory />
                        </div>
                    </div>

                    <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
                        <div className="glass-dark p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                            <div className="absolute -right-12 -top-12 w-32 h-32 bg-glow-blue/10 blur-3xl rounded-full" />

                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
                                <BrainCircuit className="w-6 h-6 text-glow-purple animate-pulse" />
                                Orchestration Loop
                            </h3>
                            <TransparencyFeed programId={Number(id)} />

                            <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Enforced Policy</h4>
                                    <Shield className="w-3 h-3 text-glow-blue" />
                                </div>
                                <PolicyPreview />
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <RefreshCw className="w-4 h-4 text-white/20 animate-spin-slow" />
                            </div>
                            <p className="text-[10px] text-white/20 font-medium uppercase tracking-widest">
                                Continuous Payout Polling Enabled
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
