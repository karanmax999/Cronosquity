'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/lib/utils'
import { Menu, X, Rocket, Shield, Cpu, Activity, LayoutGrid, ScrollText } from 'lucide-react'
import { ConnectWallet } from '@/components/ConnectWallet'

export function HeroSection() {
    return (
        <>
            <main className="overflow-x-hidden pt-16">
                <section>
                    <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                    Secure your Treasury with <span className="text-glow-purple">AI Agents</span>
                                </h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-400">
                                    Autonomous, policy-driven treasury management for modern protocols. Ship 10x faster with AI-verified payouts and EIP-3009 gasless transactions.
                                </p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="px-5 text-base bg-glow-purple hover:bg-glow-purple/90 text-white border-none shadow-[0_0_20px_rgba(155,153,254,0.3)]">
                                        <Link href="/launch">
                                            <span className="text-nowrap flex items-center gap-2">
                                                <Rocket className="w-4 h-4" />
                                                Start Building
                                            </span>
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="px-5 text-base text-gray-400 hover:text-white hover:bg-white/5">
                                        <Link href="/docs">
                                            <span className="text-nowrap">Read Documentation</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative pointer-events-none order-first ml-auto h-56 w-full sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-max lg:w-2/3">
                                {/* Abstract glow effect and high-tech image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-glow-purple/20 to-glow-blue/20 blur-[100px] rounded-full animate-pulse-slow" />
                                <img
                                    className="relative z-10 w-full h-full object-contain mix-blend-lighten"
                                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop"
                                    alt="Abstract Web3 Network"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-background/20 pb-16 md:pb-32 border-y border-white/5">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:border-white/10 md:pr-6 mb-4 md:mb-0">
                                <p className="text-center md:text-end text-sm text-gray-500 font-medium">Powering the next-gen protocols</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    durationOnHover={20}
                                    duration={40}
                                    gap={112}>
                                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                        <Shield className="w-6 h-6 text-glow-purple" />
                                        <span className="font-bold text-white tracking-widest uppercase text-lg">SecureOS</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                        <Cpu className="w-6 h-6 text-glow-blue" />
                                        <span className="font-bold text-white tracking-widest uppercase text-lg">ProtocolX</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                        <Activity className="w-6 h-6 text-green-400" />
                                        <span className="font-bold text-white tracking-widest uppercase text-lg">FlowState</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                        <LayoutGrid className="w-6 h-6 text-orange-400" />
                                        <span className="font-bold text-white tracking-widest uppercase text-lg">BentoDAO</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                        <ScrollText className="w-6 h-6 text-pink-400" />
                                        <span className="font-bold text-white tracking-widest uppercase text-lg">PolicyMint</span>
                                    </div>
                                </InfiniteSlider>

                                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-universe-black to-transparent pointer-events-none z-10"></div>
                                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-universe-black to-transparent pointer-events-none z-10"></div>

                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
