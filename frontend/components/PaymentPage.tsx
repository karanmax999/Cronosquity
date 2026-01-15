"use client";

import { useState } from "react";
import { Copy, Check, ArrowRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { facilitator } from "@/lib/facilitator";
import { ethers } from "ethers";

// Types from SDK (approximated for now, or imported if exported)
// The SDK exports types, we should use them.
// But for now I'll use 'any' or deduce, better to import.
// import { PaymentRequirements } from '@crypto.com/facilitator-client';

export default function PaymentPage() {
    // State
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("Payment for services");

    const [requirements, setRequirements] = useState<any>(null);
    const [paymentHeader, setPaymentHeader] = useState<string | null>(null);
    const [verification, setVerification] = useState<any>(null);
    const [settlement, setSettlement] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, generating_req, signing, verifying, settling, done

    // 1. Generate Requirements
    const handleGenerateRequirements = () => {
        if (!recipient || !amount) return;
        setLoading(true);
        setStatus("generating_req");

        try {
            const req = facilitator.generatePaymentRequirements({
                payTo: recipient,
                description: desc,
                maxAmountRequired: amount, // Assuming base units? SDK says base units.
                // If amount is "1000000" it's 1 USDC usually.
            });
            setRequirements(req);
            setStatus("req_generated");
        } catch (e) {
            console.error(e);
            alert("Error generating requirements");
        } finally {
            setLoading(false);
        }
    };

    // 2. Sign & Generate Header
    const handleSign = async () => {
        if (!(window as any).ethereum) {
            alert("Please install Metamask");
            return;
        }
        setLoading(true);
        setStatus("signing");

        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();

            // Ensure requirements are valid
            // The SDK generatePaymentHeader needs: to, value, signer, validBefore
            // "to" must match requirements.payTo
            // "value" must be <= requirements.maxAmountRequired (usually equal)

            // Calculate expiry (10 mins)
            const validBefore = Math.floor(Date.now() / 1000) + 600;

            const header = await facilitator.generatePaymentHeader({
                to: recipient,
                value: amount,
                signer: signer,
                validBefore,
            });

            setPaymentHeader(header);
            setStatus("header_generated");
        } catch (e) {
            console.error(e);
            alert("Error signing payment");
        } finally {
            setLoading(false);
        }
    };

    // 3. Verify
    const handleVerify = async () => {
        if (!paymentHeader || !requirements) return;
        setLoading(true);
        setStatus("verifying");

        try {
            const body = facilitator.buildVerifyRequest(paymentHeader, requirements);
            const res = await facilitator.verifyPayment(body);
            setVerification(res);

            if (res.isValid) { // Assuming isValid property based on standard SDKs
                setStatus("verified");
            } else {
                setStatus("verification_failed");
                alert("Verification failed: " + JSON.stringify(res));
            }
        } catch (e) {
            console.error(e);
            alert("Error during verification");
        } finally {
            setLoading(false);
        }
    };

    // 4. Settle
    const handleSettle = async () => {
        if (!verification || !paymentHeader || !requirements) return;
        setLoading(true);
        setStatus("settling");

        try {
            const body = facilitator.buildVerifyRequest(paymentHeader, requirements);
            const res = await facilitator.settlePayment(body);
            setSettlement(res);
            setStatus("complete");
        } catch (e) {
            console.error(e);
            alert("Settlement failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <Wallet className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Processor</h2>
                <p className="text-gray-500">Secure EIP-3009 Payments via Facilitator</p>
            </div>

            {/* Step 1: Definition */}
            <div className={cn("space-y-4 p-6 rounded-xl border transition-all",
                requirements ? "border-gray-200 bg-gray-50 opacity-60 pointer-events-none" : "border-blue-100 bg-white ring-4 ring-blue-50/50")}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">1. Payment Details</h3>
                    {requirements && <Check className="w-5 h-5 text-green-500" />}
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address (0x...)</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Wei/Units)</label>
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="1000000"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>
                    {!requirements && (
                        <button
                            onClick={handleGenerateRequirements}
                            disabled={loading || !recipient || !amount}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Generate Requirements <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Step 2: Signing */}
            {requirements && (
                <div className={cn("mt-6 space-y-4 p-6 rounded-xl border transition-all",
                    paymentHeader ? "border-gray-200 bg-gray-50 opacity-60" : "border-blue-100 bg-white ring-4 ring-blue-50/50")}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">2. Authorization</h3>
                        {paymentHeader && <Check className="w-5 h-5 text-green-500" />}
                    </div>

                    <div className="bg-slate-900 rounded-lg p-3 overflow-hidden group relative">
                        <pre className="text-xs text-slate-300 font-mono overflow-x-auto">
                            {JSON.stringify(requirements, null, 2)}
                        </pre>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-slate-700 rounded text-white" onClick={() => navigator.clipboard.writeText(JSON.stringify(requirements))}>
                                <Copy className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {!paymentHeader && (
                        <button
                            onClick={handleSign}
                            disabled={loading}
                            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Signing..." : "Sign Payment Header (EIP-3009)"}
                        </button>
                    )}
                </div>
            )}

            {/* Step 3: Verify & Settle */}
            {paymentHeader && (
                <div className="mt-6 space-y-4 p-6 rounded-xl border border-blue-100 bg-white ring-4 ring-blue-50/50">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">3. Settlement</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100 break-all font-mono">
                            <span className="font-bold block mb-1 text-xs uppercase tracking-wider text-green-600">Generated Header</span>
                            {paymentHeader.substring(0, 50)}...
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleVerify}
                                disabled={loading || status === "verified" || status === "complete"}
                                className={cn("py-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-2",
                                    status === "verified" || status === "complete" ? "bg-green-100 text-green-700 border border-green-200" : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700")}
                            >
                                {status === "verifying" ? "Verifying..." :
                                    (status === "verified" || status === "complete") ? <>Verified <Check className="w-4 h-4" /></> : "Verify Payment"}
                            </button>

                            <button
                                onClick={handleSettle}
                                disabled={loading || status !== "verified"}
                                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && status === "settling" ? "Settling..." : "Settle on Chain"}
                            </button>
                        </div>

                        {settlement && (
                            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                                <h4 className="font-bold text-sm mb-1">Payment Settled!</h4>
                                <p className="text-xs break-all truncate font-mono">Tx: {settlement.txHash || JSON.stringify(settlement)}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
