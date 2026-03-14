"use client";

import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";

export type StepStatus = "idle" | "running" | "done" | "error";

export interface AgentStep {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
  detail?: string;
}

interface AgentProgressProps {
  steps: AgentStep[];
}

const iconMap: Record<StepStatus, React.ReactNode> = {
  idle: <Circle size={18} className="text-white/20" />,
  running: <Loader2 size={18} className="text-indigo-400 animate-spin" />,
  done: <CheckCircle size={18} className="text-emerald-400" />,
  error: <XCircle size={18} className="text-red-400" />,
};

const labelColorMap: Record<StepStatus, string> = {
  idle: "text-white/30",
  running: "text-indigo-300",
  done: "text-white/80",
  error: "text-red-300",
};

export default function AgentProgress({ steps }: AgentProgressProps) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-5">
        Agent Pipeline
      </h3>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.id} className="relative flex gap-4">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`absolute left-[8.5px] top-7 w-px h-6 transition-colors duration-500 ${
                  step.status === "done" ? "bg-emerald-500/40" : "bg-white/10"
                }`}
              />
            )}

            <div className="mt-0.5 shrink-0">{iconMap[step.status]}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${labelColorMap[step.status]}`}
                >
                  {step.label}
                </span>
                {step.status === "running" && (
                  <span className="text-xs text-indigo-400/70 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5">
                    running
                  </span>
                )}
              </div>
              <p className="text-xs text-white/25 mt-0.5">{step.description}</p>
              {step.detail && step.status !== "idle" && (
                <p
                  className={`text-xs mt-1 font-mono truncate ${
                    step.status === "error" ? "text-red-400/60" : "text-white/40"
                  }`}
                >
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
