"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        tempId: 0,
        testimonial: "Croquity's AI agents automated our entire hackathon payout workflow. Zero manual errors.",
        by: "Sarah, Ops Lead at Cronos Labs",
        imgSrc: "https://i.pravatar.cc/150?u=cronos"
    },
    {
        tempId: 1,
        testimonial: "The X402 standard integration was seamless. Our DAO treasury is finally autonomous.",
        by: "Mike, Core Dev at VVS Finance",
        imgSrc: "https://i.pravatar.cc/150?u=vvs"
    },
    {
        tempId: 2,
        testimonial: "We use Croquity to manage $5M in ecosystem grants. The transparency is unmatched.",
        by: "Elena, Grant Manager at Crypto.com Capital",
        imgSrc: "https://i.pravatar.cc/150?u=cdc"
    },
    {
        tempId: 3,
        testimonial: "Gasless payouts via EIP-3009 saved our users thousands in fees. Game changer.",
        by: "David, Founder at Tectonic",
        imgSrc: "https://i.pravatar.cc/150?u=tectonic"
    },
    {
        tempId: 4,
        testimonial: "The most reliable treasury OS on Cronos. Security verified and production ready.",
        by: "James, Security Engineer at PeckShield",
        imgSrc: "https://i.pravatar.cc/150?u=security"
    }
];

export const StaggerTestimonials: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <div className="relative w-full overflow-hidden py-32 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative z-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-6xl font-black tracking-tighter mb-6 text-white"
                >
                    TRUSTED BY <span className="text-glow-purple drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">PROTOCOL</span> LEADERS
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/40 max-w-2xl mx-auto font-medium uppercase tracking-[0.2em] text-xs"
                >
                    Securing the future of autonomous treasury management on Cronos.
                </motion.p>
            </div>

            <div className="relative h-[450px] flex items-center justify-center perspective-1000">
                <AnimatePresence mode="popLayout">
                    {testimonials.map((t, i) => {
                        const position = (i - activeIndex + testimonials.length) % testimonials.length;
                        const isCenter = position === 0;
                        const isLeft = position === testimonials.length - 1;
                        const isRight = position === 1;

                        if (!isCenter && !isLeft && !isRight) return null;

                        return (
                            <motion.div
                                key={t.by}
                                initial={{ opacity: 0, scale: 0.8, x: isLeft ? -200 : isRight ? 200 : 0 }}
                                animate={{
                                    opacity: isCenter ? 1 : 0.4,
                                    scale: isCenter ? 1 : 0.85,
                                    x: isCenter ? 0 : isLeft ? -400 : 400,
                                    zIndex: isCenter ? 30 : 10,
                                    rotateY: isCenter ? 0 : isLeft ? 25 : -25,
                                    y: isCenter ? 0 : 20
                                }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={cn(
                                    "absolute w-[350px] sm:w-[500px] p-8 sm:p-12 rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-500",
                                    isCenter
                                        ? "glass-dark border-glow-purple/50 shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)] bg-gradient-to-b from-glow-purple/10 to-transparent"
                                        : "bg-white/5 border-white/10 grayscale opacity-50"
                                )}
                            >
                                <div className="relative">
                                    {isCenter && (
                                        <div className="absolute -top-6 -left-6 p-3 bg-glow-purple rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                                            <span className="text-white text-3xl font-serif">"</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="relative">
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl overflow-hidden border-2",
                                                isCenter ? "border-glow-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "border-white/10"
                                            )}>
                                                <img src={t.imgSrc} alt={t.by} className="w-full h-full object-cover" />
                                            </div>
                                            {isCenter && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-black rounded-full" />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-sm uppercase tracking-widest">{t.by.split(',')[0]}</h4>
                                            <p className="text-glow-purple/60 text-[10px] font-black uppercase tracking-[0.2em]">{t.by.split(',')[1]}</p>
                                        </div>
                                    </div>
                                    <h3 className={cn(
                                        "text-xl sm:text-2xl font-bold leading-tight mb-4 tracking-tight",
                                        isCenter ? "text-white" : "text-white/40"
                                    )}>
                                        {t.testimonial}
                                    </h3>

                                    {isCenter && (
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="mt-8 flex gap-2"
                                        >
                                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/30 uppercase tracking-widest">Verified Program</div>
                                            <div className="px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">Cronos Native</div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-6 mt-16 relative z-30">
                <button
                    onClick={handlePrev}
                    className="w-16 h-16 rounded-2xl glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-glow-purple hover:bg-glow-purple/20 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={handleNext}
                    className="w-16 h-16 rounded-2xl glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-glow-purple hover:bg-glow-purple/20 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};
