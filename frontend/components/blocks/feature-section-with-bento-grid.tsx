import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled, IconShieldCheck, IconRobot, IconBolt, IconReceiptTax } from "@tabler/icons-react";
import Link from "next/link";

export function FeaturesSectionWithBentoGrid() {
    const features = [
        {
            title: "Automated Treasury Policy",
            description:
                "Define immutable spending rules. Our agents enforce budget caps, recipient whitelists, and frequency limits on-chain.",
            skeleton: <SkeletonOne />,
            className:
                "col-span-1 md:col-span-4 lg:col-span-4 border-b md:border-r border-white/10",
        },
        {
            title: "AI-Verified Payouts",
            description:
                "No more manual checks. The agent analyzes every claim against your policy before signing.",
            skeleton: <SkeletonTwo />,
            className: "col-span-1 md:col-span-2 lg:col-span-2 border-b border-white/10",
        },
        {
            title: "Global Settlement Network",
            description:
                "Execute payments across any EVM chain. Optimised for Cronos, verified by the world.",
            skeleton: <SkeletonFour />,
            className:
                "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-r border-white/10",
        },
        {
            title: "Gasless EIP-3009",
            description:
                "Pay via signature. Keep your operational wallets safe and let the agent handle the gas.",
            skeleton: <SkeletonThree />,
            className: "col-span-1 md:col-span-3 lg:col-span-3 border-b border-white/10 md:border-none",
        },
    ];
    return (
        <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white mb-6">
                    The <span className="text-glow-purple">Operating System</span> for DAOs
                </h4>

                <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-400 text-center font-normal">
                    From grant programs to payroll, Croquity automates the entire lifecycle of treasury management with cryptographic guarantees.
                </p>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 mt-12 xl:border rounded-3xl bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className="h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug font-bold">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base max-w-4xl text-left mx-auto",
                "text-neutral-400 font-normal",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full p-5 mx-auto bg-black/60 border border-white/10 shadow-2xl group h-full rounded-2xl overflow-hidden backdrop-blur-md relative">
                {/* Scrolling Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-glow-purple/10 via-transparent to-glow-blue/5 opacity-30 animate-pulse-slow" />

                <div className="flex flex-1 w-full h-full flex-col space-y-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-2 p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                        <div className="flex items-center gap-2">
                            <IconShieldCheck className="text-emerald-400 w-5 h-5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            <span className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-widest">Policy.Verified</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                            <div className="w-1 h-1 rounded-full bg-emerald-400/50" />
                        </div>
                    </motion.div>

                    <div className="space-y-3 font-mono text-[10px] text-white/40 p-2">
                        {[
                            { label: "check_limit(1000 USDC)", status: "PASS", delay: 0.2 },
                            { label: "check_whitelist(0x86...9bEf)", status: "PASS", delay: 0.4 },
                            { label: "check_interval(7 days)", status: "PASS", delay: 0.6 },
                            { label: "verify_signature(ed25519)", status: "PASS", delay: 0.8 },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: item.delay }}
                                className="flex items-center justify-between border-b border-white/5 pb-2"
                            >
                                <span className="text-white/60 tracking-tighter italic"> {'>'} {item.label}</span>
                                <span className="text-emerald-400 font-black bg-emerald-400/10 px-1.5 py-0.5 rounded text-[9px]">{item.status}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-auto p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-glow-purple/20">
                            <IconRobot className="w-4 h-4 text-glow-purple animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="h-full bg-glow-purple shadow-[0_0_10px_rgba(168,85,247,1)]"
                                />
                            </div>
                            <p className="text-[9px] text-white/20 mt-1 font-mono uppercase tracking-tighter">Broadcasting Settlement Intent...</p>
                        </div>
                    </div>
                </div>

                {/* Vertical Scanner Line */}
                <motion.div
                    animate={{ top: ["-20%", "120%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[40px] bg-gradient-to-b from-transparent via-glow-purple/20 to-transparent z-20 pointer-events-none"
                />
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-black via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonTwo = () => {
    const images = [
        "/tech-abstract-1.png",
        "/tech-abstract-2.png",
        "/tech-abstract-1.png",
    ];

    const imageVariants = {
        whileHover: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
        whileTap: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
    };
    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
            <div className="flex flex-row -ml-10 relative">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-black/40 border border-white/10 flex-shrink-0 overflow-hidden relative group"
                    >
                        <Image
                            src={image}
                            alt="tech image"
                            width="500"
                            height="500"
                            className="rounded-lg h-24 w-24 md:h-40 md:w-40 object-cover flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        {/* AI Recognition Overlay */}
                        <div className="absolute inset-0 bg-glow-purple/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <div className="border border-glow-purple w-1/2 h-1/2 rounded animate-pulse" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="absolute bottom-10 left-10 p-4 glass-dark border border-white/10 rounded-2xl z-30"
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-glow-blue animate-ping" />
                    <span className="text-[10px] font-black font-mono text-white/60 tracking-widest uppercase">AI.Neural_Verify (0.98 Conf)</span>
                </div>
            </motion.div>

            <div className="absolute left-0 z-[10] inset-y-0 w-20 bg-gradient-to-r from-black/80 to-transparent h-full pointer-events-none" />
            <div className="absolute right-0 z-[10] inset-y-0 w-20 bg-gradient-to-l from-black/80 to-transparent h-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <div className="relative flex gap-10 h-full group/image overflow-hidden">
            <div className="w-full mx-auto bg-transparent group h-full p-6">
                <div className="flex flex-col gap-4 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <IconBolt className="text-blue-400 w-6 h-6 animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[11px] font-black text-white uppercase tracking-widest">EIP-712 Meta.Tx</div>
                            <div className="text-[10px] text-white/40 font-mono">Intent: 0x8a92...f21d</div>
                        </div>
                        {/* Cryptographic Signing Line */}
                        <motion.div
                            animate={{ left: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-0 h-[2px] w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-glow-purple/10 border border-glow-purple/20 ml-8 relative overflow-hidden shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]"
                    >
                        <div className="w-12 h-12 rounded-full bg-glow-purple/20 flex items-center justify-center border border-glow-purple/30">
                            <IconRobot className="text-glow-purple w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[11px] font-black text-white uppercase tracking-widest">Agent.Submit</div>
                            <div className="text-[10px] text-white/40 font-mono">Relayed to Cronos</div>
                        </div>
                        {/* Status Pulse */}
                        <div className="absolute right-4 top-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-glow-purple animate-ping" />
                        </div>
                    </motion.div>

                    {/* Connecting Animated Dotted Line */}
                    <svg className="absolute top-12 left-6 w-8 h-20 pointer-events-none opacity-20">
                        <motion.path
                            d="M 10 0 Q 10 40 40 40"
                            fill="transparent"
                            stroke="white"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            initial={{ strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -20 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};

export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.5, 0.2, 0.8], // Purple markers
            glowColor: [0.2, 0.2, 0.2],
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
                { location: [51.5074, -0.1278], size: 0.05 }, // London
                { location: [1.3521, 103.8198], size: 0.08 }, // Singapore
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};
