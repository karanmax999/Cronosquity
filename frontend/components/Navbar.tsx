"use client";

import React from "react";
import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const [menuState, setMenuState] = React.useState(false);

    const menuItems = [
        { name: 'Programs', href: '/programs' },
        { name: 'Agent Hub', href: '/agent-hub' },
        { name: 'Governance', href: '/governance' },
        { name: 'Docs', href: '/docs' },
    ];

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="group fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl border border-white/10 bg-black/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-white/20"
            >
                <div className="mx-auto max-w-7xl px-6">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-4">
                        {/* Logo Area */}
                        <div className="flex w-full items-center justify-between lg:w-auto">
                            <Link href="/" className="flex items-center gap-4 group transition-all hover:scale-[1.02] active:scale-95">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-glow-purple/40 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src="/logo.png"
                                        alt="Croquity Logo"
                                        className="h-14 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-2xl tracking-tighter text-white leading-none">
                                        Croquity<span className="text-glow-purple">.</span>
                                    </span>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-1">Autonomous Ops</span>
                                </div>
                            </Link>

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setMenuState(!menuState)}
                                className="block lg:hidden p-2 text-white/70 hover:text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-8">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group/link"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-glow-purple group-hover/link:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Right / Actions */}
                        <div className="hidden lg:flex items-center gap-6">
                            <ConnectWallet />
                            <Link href="/launch">
                                <Button className="h-12 px-8 bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-glow-purple hover:text-white rounded-xl transition-all duration-300 border border-white/10 hover:border-glow-purple shadow-xl hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] active:scale-95">
                                    Launch Program
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu */}
                        {menuState && (
                            <div className="w-full lg:hidden pt-4 pb-6 space-y-4">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="block text-base font-medium text-white/80 hover:text-white py-2 border-b border-white/5"
                                        onClick={() => setMenuState(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-4 flex flex-col gap-4">
                                    <ConnectWallet />
                                    <Link href="/launch" onClick={() => setMenuState(false)}>
                                        <Button className="w-full bg-glow-purple text-white">Launch Program</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
