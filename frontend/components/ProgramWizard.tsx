import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Layout,
    ShieldAlert,
    Wallet,
    CheckCircle2,
    Rocket,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PROGRAM_REGISTRY_ABI, PROGRAM_REGISTRY_ADDRESS } from "@/lib/contracts";
import { parseUnits } from "viem";
import { useRouter } from "next/navigation";

const STEPS = [
    { id: 1, name: "Details", icon: Layout },
    { id: 2, name: "Policy", icon: ShieldAlert },
    { id: 3, name: "Budget", icon: Wallet },
    { id: 4, name: "Launch", icon: Rocket }
];

export function ProgramWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        type: "0",
        description: "",
        maxPerWinner: "500",
        maxWinners: "3",
        budget: "1000",
        token: "0xa9BFFF502E499b3c6188c5f88304880AbA2FA486" // Default MockUSDC
    });

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => router.push("/"), 2000);
        }
    }, [isSuccess, router]);

    const handleLaunch = () => {
        const policy = JSON.stringify({
            maxTotalBudget: Number(formData.budget),
            maxPerRecipient: Number(formData.maxPerWinner),
            maxRecipients: Number(formData.maxWinners),
            minRecipients: 1,
            requireUniqueWallets: true
        });

        writeContract({
            address: PROGRAM_REGISTRY_ADDRESS,
            abi: PROGRAM_REGISTRY_ABI,
            functionName: "createProgram",
            args: [
                Number(formData.type),
                formData.token as `0x${string}`,
                formData.name, // metadataURI (simple name for now)
                policy, // policyURI
                parseUnits(formData.budget, 18)
            ]
        });
    };

    const next = () => setStep(s => Math.min(s + 1, 4));
    const back = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 -z-10" />
                {STEPS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            step === s.id ? "bg-emerald-600 border-emerald-600 text-white scale-110 shadow-lg" :
                                step > s.id ? "bg-emerald-100 border-emerald-600 text-emerald-600" : "bg-white border-gray-200 text-gray-400"
                        )}>
                            {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className={cn(
                            "text-xs font-bold uppercase tracking-wider",
                            step === s.id ? "text-emerald-700" : "text-gray-400"
                        )}>{s.name}</span>
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div className="glass rounded-3xl p-8 lg:p-12 mb-8 min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Program Identity</h2>
                                    <p className="text-gray-500">Define the core mission and category of your treasury program.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Program Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Q1 Developer Hackathon"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Program Type</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none bg-white"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="0">Hackathon</option>
                                            <option value="1">Bounty</option>
                                            <option value="2">Grant</option>
                                            <option value="3">Payroll</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Description</label>
                                        <textarea
                                            rows={4}
                                            placeholder="What is the goal of this program?"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-8">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-emerald-900">AI Privacy & Guardrails</h4>
                                        <p className="text-sm text-emerald-700">The AI Steward will use these rules to filter submissions and calculate fair payouts.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase">Max per Recipient (USDC)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                            value={formData.maxPerWinner}
                                            onChange={e => setFormData({ ...formData, maxPerWinner: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase">Max Winners</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                            value={formData.maxWinners}
                                            onChange={e => setFormData({ ...formData, maxWinners: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Treasury Setup</h2>
                                    <p className="text-gray-500">Allocate funds and select the disbursement currency.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase">Total Program Budget</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 text-2xl font-bold bg-white"
                                                value={formData.budget}
                                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase">Token Address (Cronos Testnet)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm bg-gray-50 text-gray-500"
                                            readOnly
                                            value={formData.token}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="text-center py-8 space-y-6">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Rocket className="w-10 h-10 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 mb-2">Ready to Launch?</h2>
                                    <p className="text-gray-500 max-w-md mx-auto">Confirming this will create a live governance program on the Cronos chain managed by your AI Steward.</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3 border border-gray-100">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Program Name</span>
                                        <span className="text-gray-900 font-bold">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Budget allocation</span>
                                        <span className="text-emerald-600 font-bold">${formData.budget} USDC</span>
                                    </div>
                                </div>

                                {hash && (
                                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-sm text-emerald-800 break-all">
                                        <p className="font-bold mb-1 text-left">Transaction Hash:</p>
                                        <a
                                            href={`https://explorer.zkevm.cronos.org/testnet/tx/${hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline block text-left truncate"
                                        >
                                            {hash}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="flex justify-between pt-8 border-t border-gray-100">
                    <button
                        onClick={back}
                        disabled={step === 1}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                            step === 1 ? "opacity-0 invisible" : "text-gray-500 hover:text-gray-900"
                        )}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>

                    <button
                        onClick={step === 4 ? handleLaunch : next}
                        disabled={isPending || isConfirming || isSuccess}
                        className={cn(
                            "flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/10",
                            (isPending || isConfirming || isSuccess) && "bg-gray-400 cursor-not-allowed"
                        )}
                    >
                        {isPending ? "Broadcasting..." :
                            isConfirming ? "Confirming..." :
                                isSuccess ? "Success!" :
                                    step === 4 ? "Launch Program" : "Continue"}
                        {(isPending || isConfirming) ? <Loader2 className="w-5 h-5 animate-spin" /> :
                            step !== 4 && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div >
    );
}
