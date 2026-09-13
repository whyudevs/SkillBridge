"use client";

import { useState } from "react";
import { Medal, Sparkles, Terminal, CheckCircle2, Award } from "lucide-react";
import { calculateTier, StudentTier } from "@/components/DashboardLayout";

interface StudentHoverCardProps {
  name: string;
  tier: StudentTier;
  points: number;
  score: number;
  specialization: string;
  recentTest?: string;
  children: React.ReactNode;
}

export default function StudentHoverCard({
  name,
  tier,
  points,
  score,
  specialization,
  recentTest = "Distributed Consensus & Raft",
  children,
}: StudentHoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tierMeta = calculateTier(points, score);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Target Trigger Element */}
      {children}

      {/* Floating Hover Card */}
      {isVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 z-50 p-4 rounded-2xl bg-white/95 dark:bg-[#0c1220]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
            <div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">{name}</h5>
              <span className="text-[10px] text-slate-400 font-mono">{specialization}</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${tierMeta.badgeBg} ${tierMeta.borderClass}`}
            >
              <Medal size={11} className={`inline mr-1 ${tierMeta.colorClass}`} />
              {tierMeta.tier}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Avg Test Score</span>
              <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                {score}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Bounty Points</span>
              <span className="text-sm font-black font-mono text-amber-500">
                {points} Pts
              </span>
            </div>
          </div>

          {/* Diagnostic Note */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Terminal size={11} className="text-blue-500" /> Latest Verified Diagnostic:
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              {recentTest}
            </p>
          </div>

          {/* Tooltip Arrow Pointer */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white dark:border-t-[#0c1220]" />
        </div>
      )}
    </div>
  );
}