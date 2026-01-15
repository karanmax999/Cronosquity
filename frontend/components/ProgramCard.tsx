import { formatUnits } from "viem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

interface Program {
    id: string;
    type: string;
    budget: string;
    status: string;
    name?: string;
}

import { useRouter } from "next/navigation";

export function ProgramCard({ program }: { program: Program }) {
    const router = useRouter();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onClick={() => router.push(`/programs/${program.id}`)}
            className="group relative h-full glass-dark border border-white/10 rounded-[2.5rem] p-10 hover:shadow-[0_0_80px_-20px_rgba(168,85,247,0.4)] transition-all duration-500 overflow-hidden cursor-pointer"
        >
            {/* Holographic Glow Layer */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(168, 85, 247, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-glow-purple via-glow-purple/80 to-glow-blue rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(168,85,247,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <span className="text-white font-black text-2xl drop-shadow-lg">{program.type[0]}</span>
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-white leading-tight truncate max-w-[200px] tracking-tight">
                                {program.name || `#${program.id}`}
                            </h3>
                            <p className="text-[10px] font-black text-glow-purple uppercase tracking-[0.2em] mt-1.5">{program.type} Initiative</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-400/5 text-emerald-400 border-emerald-400/20 rounded-full px-5 py-1.5 text-[10px] font-black tracking-widest uppercase">
                        {program.status}
                    </Badge>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="flex flex-col gap-1 border-b border-white/5 pb-6">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Authorized Budget</span>
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono font-black text-4xl text-white tracking-tighter">
                                ${Number(formatUnits(BigInt(program.budget), 18)).toLocaleString()}
                            </span>
                            <span className="text-white/20 font-black text-xs uppercase tracking-widest font-mono">USDC.e</span>
                        </div>
                    </div>
                </div>

                <Button className="w-full h-14 bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-glow-purple hover:text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-glow-purple shadow-xl group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] active:scale-95">
                    Manage Treasury
                </Button>
            </div>
        </div>
    );
}
