import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";

const STEPS = [
    { name: "Ingest", status: "complete", icon: Clock },
    { name: "Plan", status: "complete", icon: CheckCircle2 },
    { name: "Verify", status: "complete", icon: CheckCircle2 },
    { name: "Execute", status: "pending", icon: AlertTriangle }
];

export function AgentTimeline({ steps = STEPS }: { steps?: any[] }) {
    return (
        <div className="space-y-4">
            {steps.map((step, i) => (
                <div key={step.name} className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                            step.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                'bg-gray-100 text-gray-600'
                        }`}>
                        <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{step.name}</h4>
                        <p className="text-sm text-gray-600">Completed at {new Date().toLocaleTimeString()}</p>
                    </div>
                    <div className="ml-auto">
                        <Badge>{step.status.toUpperCase()}</Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}
