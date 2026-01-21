'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ConnectWallet } from '@/components/ConnectWallet';
import { EtheralShadow } from '@/components/ui/etheral-shadow';
import { AgentLiveFeed } from '@/components/AgentLiveFeed';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

export function HeroSection() {
    return (
        <main className="overflow-hidden bg-background text-foreground relative">
            {/* Multi-Layer Background System */}
            <div className="absolute inset-0 -z-30 h-screen w-full overflow-hidden">
                {/* Layer 1: Static Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{
                        backgroundImage: 'url(/hero-bg.png)',
                        backgroundBlendMode: 'overlay'
                    }}
                />

                {/* Layer 2: Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

                {/* Layer 3: Animated Ethereal Shadow */}
                <EtheralShadow
                    color="rgba(168, 85, 247, 0.25)"
                    animation={{ scale: 80, speed: 40 }}
                    noise={{ opacity: 0.6, scale: 1.0 }}
                    sizing="fill"
                    className="opacity-70"
                />

                {/* Layer 4: Bottom Fade to Content */}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
            </div>

            <div
                aria-hidden
                className="z-[2] absolute inset-0 pointer-events-none isolate opacity-40 contain-strict hidden lg:block">
                <div className="w-[45rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(270,100%,70%,.08)_0,hsla(210,100%,50%,.03)_50%,transparent_80%)]" />
                <div className="h-[80rem] absolute right-0 top-0 w-[40rem] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(270,100%,70%,.05)_0,hsla(210,100%,50%,.02)_80%,transparent_100%)] [translate:20%_-30%]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-glow-purple/5 blur-[120px] rounded-full opacity-20 animate-pulse-slow" />
            </div>
            <section>
                <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                        <AnimatedGroup variants={transitionVariants}>
                            <Link
                                href="/governance"
                                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                <span className="text-foreground text-sm">Autonomous Treasury Governance is here</span>
                                <span className="dark:border-background block h-4 w-0.5 border-l bg-gray-200 dark:bg-zinc-700"></span>

                                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                        <span className="flex size-6">
                                            <ArrowRight className="m-auto size-3" />
                                        </span>
                                        <span className="flex size-6">
                                            <ArrowRight className="m-auto size-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <h1
                                className="mt-8 max-w-5xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.5rem] font-black tracking-tighter leading-[0.9] text-white">
                                Secure & <span className="text-glow-purple drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">Scale</span> Your Protocol Treasury
                            </h1>
                            <p
                                className="mx-auto mt-10 max-w-2xl text-balance text-xl text-white/50 font-medium tracking-tight">
                                The first autonomous treasury management OS for the Cronos ecosystem. <span className="text-white/80">AI agents enforcing immutable policies</span> with cryptographic certainty.
                            </p>
                        </AnimatedGroup>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                        >
                            <div className="mt-12 flex flex-col items-center justify-center gap-8 lg:flex-row">
                                <div className="flex flex-col gap-4">
                                    <div className="bg-white/10 p-[1px] rounded-2xl backdrop-blur-md">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-2xl h-14 px-10 text-lg font-black bg-glow-purple text-white hover:bg-glow-purple/90 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all active:scale-95">
                                            <Link href="/launch">
                                                <span className="text-nowrap">Launch Treasury</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-12 rounded-xl px-8 text-base font-medium hover:bg-accent/50 text-muted-foreground">
                                        <Link href="/docs">
                                            <span className="text-nowrap">Read Documentation</span>
                                        </Link>
                                    </Button>
                                </div>

                                <div className="w-full lg:w-auto mt-8 lg:mt-0">
                                    <AgentLiveFeed />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </div>

                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.75,
                                },
                            },
                        },
                        ...transitionVariants,
                    }}>
                    <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                        <div
                            aria-hidden
                            className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                        />
                        <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-2xl shadow-zinc-950/10 ring-1">
                            <img
                                className="bg-background aspect-[16/9] relative hidden rounded-2xl dark:block object-cover"
                                src="/dashboard-preview.png"
                                alt="Croquity Dashboard Preview"
                                width="2700"
                                height="1440"
                            />
                            <img
                                className="z-2 border-border/25 aspect-[16/9] relative rounded-2xl border dark:hidden object-cover"
                                src="/dashboard-preview.png"
                                alt="Croquity Dashboard Preview"
                                width="2700"
                                height="1440"
                            />
                        </div>
                    </div>
                </AnimatedGroup>
            </section>
            <section className="bg-background pb-16 pt-16 md:pb-32 border-t border-border/50">
                <div className="group relative m-auto max-w-5xl px-6">
                    <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                        <Link
                            href="/programs"
                            className="block text-sm font-semibold duration-150 hover:opacity-75 flex items-center gap-1">
                            <span>Meet Our Active Programs</span>
                            <ChevronRight className="size-4" />
                        </Link>
                    </div>
                    <div className="group-hover:blur-[2px] mx-auto mt-12 grid max-w-2xl grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14 grayscale opacity-70">
                        <div className="flex justify-center items-center">
                            <img
                                className="h-8 w-auto dark:invert"
                                src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
                                alt="Bitcoin"
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <img
                                className="h-8 w-auto dark:invert"
                                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg"
                                alt="Ethereum"
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <img
                                className="h-8 w-auto dark:invert"
                                src="https://upload.wikimedia.org/wikipedia/commons/0/01/Solana_logo.svg"
                                alt="Solana"
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <img
                                className="h-8 w-auto dark:invert"
                                src="https://upload.wikimedia.org/wikipedia/en/b/b9/Cronos_Logo.svg"
                                alt="Cronos"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("relative flex items-center justify-center p-1 cursor-pointer", className)}>
            <img
                src="/logo.png"
                alt="Croquity Logo"
                className="w-full h-full object-contain"
            />
        </div>
    );
};
