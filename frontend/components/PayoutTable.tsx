import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Loader2, Square, CheckSquare, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Payout {
    id: string; // Unique ID for selection
    recipient: string;
    amount: string;
    reason: string;
    score: number;
    status: "pending" | "signed" | "verifying" | "verified" | "settling" | "executed" | "failed";
    txHash?: string;
    requirements?: any; // The raw requirements
    header?: string; // The signed header
}

interface PayoutTableProps {
    payouts: Payout[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleAll: () => void;
    onVerify: (id: string) => void;
    onSettle: (id: string) => void;
}

export function PayoutTable({ payouts, selectedIds, onToggleSelect, onToggleAll, onVerify, onSettle }: PayoutTableProps) {
    const allSelected = payouts.length > 0 && selectedIds.length === payouts.length;

    return (
        <div className="overflow-hidden">
            <Table>
                <TableHeader className="bg-black/40">
                    <TableRow className="border-b border-white/10 hover:bg-transparent">
                        <TableHead className="w-[50px] pl-6">
                            <button onClick={onToggleAll} className="flex items-center transition-transform active:scale-90">
                                {allSelected ? <CheckSquare className="w-5 h-5 text-glow-purple" /> : <Square className="w-5 h-5 text-gray-500" />}
                            </button>
                        </TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recipient</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Score</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right pr-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payouts.map((payout) => {
                        const isSelected = selectedIds.includes(payout.id);
                        return (
                            <TableRow key={payout.id} className={cn(
                                "border-b border-white/5 transition-colors group",
                                isSelected ? "bg-glow-purple/10" : "hover:bg-white/5"
                            )}>
                                <TableCell className="pl-6">
                                    <button onClick={() => onToggleSelect(payout.id)} className="transition-transform active:scale-90">
                                        {isSelected ? <CheckSquare className="w-5 h-5 text-glow-purple" /> : <Square className="w-5 h-5 text-gray-500 group-hover:text-gray-400" />}
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-mono text-xs font-bold text-white">{payout.recipient.slice(0, 6)}...{payout.recipient.slice(-4)}</span>
                                        <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{payout.reason}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono text-base font-black text-white">
                                        ${(parseFloat(payout.amount) / 1e6).toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    payout.score > 80 ? "bg-emerald-500" : payout.score > 50 ? "bg-amber-500" : "bg-rose-500"
                                                )}
                                                style={{ width: `${payout.score}% ` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400">{payout.score}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {payout.status === 'executed' ? (
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-glow-purple/20 text-glow-purple border border-glow-purple/30 text-[10px] font-black uppercase tracking-tighter">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Settled
                                        </div>
                                    ) : payout.status === 'verified' ? (
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-glow-blue/20 text-glow-blue border border-glow-blue/30 text-[10px] font-black uppercase tracking-tighter">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                        </div>
                                    ) : payout.status === 'verifying' || payout.status === 'settling' ? (
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-tighter">
                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-gray-400 border border-white/20 text-[10px] font-black uppercase tracking-tighter">
                                            Pending
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-2">
                                        {payout.status === 'signed' && (
                                            <Button size="sm" variant="outline" onClick={() => onVerify(payout.id)} className="h-8 rounded-lg border-glow-blue/30 hover:bg-glow-blue/10 text-glow-blue font-bold text-[10px] uppercase">
                                                Verify
                                            </Button>
                                        )}
                                        {payout.status === 'verified' && (
                                            <Button size="sm" onClick={() => onSettle(payout.id)} className="h-8 rounded-lg bg-white text-black hover:bg-glow-purple hover:text-white font-bold text-[10px] uppercase transition-all shadow-lg shadow-glow-purple/20">
                                                Settle
                                            </Button>
                                        )}
                                        {payout.txHash && (
                                            <a
                                                href={`https://explorer.zkevm.cronos.org/testnet/tx/${payout.txHash}`}
                                                target="_blank"
                                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-glow-purple hover:border-glow-purple/30 transition-all"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div >
                                </TableCell >
                            </TableRow >
                        )
                    })}
                </TableBody >
            </Table >
        </div >
    );
}
