"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Send, Twitter, Shield, Github } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function Footerdemo() {
    return (
        <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-3xl text-white transition-colors duration-300">
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-glow-purple to-transparent opacity-50" />

            <div className="container mx-auto px-4 py-20 md:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-8">
                            <img src="/logo.png" alt="Croquity Logo" className="h-16 w-auto object-contain brightness-200" />
                        </div>
                        <p className="mb-8 text-white/40 text-[13px] leading-relaxed font-medium uppercase tracking-[0.05em]">
                            Autonomous, policy-driven treasury management for modern protocols. Secure, scale, and automate your governance.
                        </p>
                        <form className="relative group">
                            <Input
                                type="email"
                                placeholder="Core Update Stream"
                                className="h-12 pr-12 glass-dark border-white/10 shadow-none focus-visible:ring-glow-purple/30 text-xs font-mono"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-glow-purple text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Subscribe</span>
                            </Button>
                        </form>
                    </div>
                    <div>
                        <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Infrastructure</h3>
                        <nav className="space-y-5 text-sm">
                            <Link href="/programs" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                Active Programs
                            </Link>
                            <Link href="/agents" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                Treasury Agents
                            </Link>
                            <Link href="/governance" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                Protocol Governance
                            </Link>
                            <Link href="/launch" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                Launch Program
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Developer Hub</h3>
                        <nav className="space-y-5 text-sm">
                            <Link href="/docs" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                Documentation
                            </Link>
                            <Link href="#" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                Security Audits
                            </Link>
                            <Link href="#" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                x402 Specification
                            </Link>
                            <Link href="#" className="block text-white/60 transition-all hover:text-white hover:translate-x-1">
                                SDK Library
                            </Link>
                        </nav>
                    </div>
                    <div className="relative">
                        <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Sync Connection</h3>
                        <div className="mb-8 flex space-x-4">
                            {[
                                { icon: Twitter, label: "X" },
                                { icon: Github, label: "GitHub" },
                                { icon: Linkedin, label: "LinkedIn" }
                            ].map((social, i) => (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl glass-dark border-white/10 hover:border-glow-purple/50 transition-all hover:-translate-y-1">
                                                <social.icon className="h-4 w-4 text-white/60" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-glow-purple border-none text-white font-black text-[10px] uppercase tracking-widest px-3 py-2">
                                            {social.label}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>

                        <Button className="w-full h-14 glass-dark border-glow-purple/30 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-glow-purple hover:border-glow-purple transition-all shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] active:scale-95 group">
                            Join Discord Node
                            <div className="ml-2 w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
                        </Button>
                    </div>
                </div>

                <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-10">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 glass-dark border-white/5 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Status: All Systems Nominal</span>
                        </div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">
                            © 2025 Croquity. Built for Cronos.
                        </p>
                    </div>
                    <nav className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Link href="#" className="text-white/20 transition-colors hover:text-white">
                            Privacy.Protocol
                        </Link>
                        <Link href="#" className="text-white/20 transition-colors hover:text-white">
                            Terms.Logic
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

export { Footerdemo }
