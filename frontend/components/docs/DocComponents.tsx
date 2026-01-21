"use client";

import React, { useState } from 'react';
import { Copy, Check, ChevronRight, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DocSection = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-24 mb-16">
        <h2 className="text-3xl font-black text-white mb-6 flex items-center group">
            <span className="text-glow-purple mr-3 opacity-0 group-hover:opacity-100 transition-opacity">#</span>
            {title}
        </h2>
        <div className="text-white/70 leading-relaxed space-y-4">
            {children}
        </div>
    </section>
);

export const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-glow-purple/20 to-glow-blue/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-white/40 uppercase">{language}</span>
                    <button
                        onClick={copyToClipboard}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                <pre className="p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export const DocCallout = ({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }) => {
    const icons = {
        info: <Info className="w-5 h-5 text-blue-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        tip: <Lightbulb className="w-5 h-5 text-emerald-400" />
    };

    const styles = {
        info: 'bg-blue-500/5 border-blue-500/20 text-blue-200/80',
        warning: 'bg-amber-500/5 border-amber-500/20 text-amber-200/80',
        tip: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200/80'
    };

    return (
        <div className={`flex gap-4 p-4 rounded-xl border ${styles[type]} my-6`}>
            <div className="mt-1">{icons[type]}</div>
            <div className="text-sm leading-relaxed">{children}</div>
        </div>
    );
};

export const DocSteps = ({ steps }: { steps: { title: string; content: React.ReactNode }[] }) => (
    <div className="space-y-8 my-8">
        {steps.map((step, i) => (
            <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glow-purple/20 border border-glow-purple/30 flex items-center justify-center text-glow-purple font-bold text-sm">
                    {i + 1}
                </div>
                <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">{step.title}</h4>
                    <div className="text-white/60 text-sm leading-relaxed">{step.content}</div>
                </div>
            </div>
        ))}
    </div>
);
