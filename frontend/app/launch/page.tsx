"use client";

import { ProgramWizard } from "@/components/ProgramWizard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LaunchPage() {
    return (
        <div className="min-h-screen bg-white/50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900">
                        Launch a <span className="text-gradient">Program</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Create an autonomous treasury initiative on Cronos Testnet.</p>
                </div>

                <ProgramWizard />
            </div>
        </div>
    );
}
