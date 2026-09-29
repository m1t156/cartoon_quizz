"use client";

import { Trophy, Swords } from "lucide-react";

interface ProgressBarProps {
  completedMatchesTotal: number;
  totalMatches: number; // 255
  percentage: number;
  currentRoundName: string;
}

export function ProgressBar({
  completedMatchesTotal,
  totalMatches = 255,
  percentage,
  currentRoundName,
}: ProgressBarProps) {
  return (
    <div className="w-full bg-white border-3 border-slate-900 p-3 md:p-4 rounded-xl shadow-[4px_4px_0px_#121316] select-none">
      <div className="flex items-center justify-between text-xs md:text-sm font-bold text-slate-800 mb-2">
        <div className="flex items-center gap-1.5 font-heading">
          <Swords className="w-4 h-4 text-orange-600" />
          <span>SUPER CUP PROGRESS</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-600 hidden xs:inline">{currentRoundName} • </span>
          <span className="bg-amber-300 text-slate-900 px-2 py-0.5 rounded border border-slate-900 font-extrabold">
            {completedMatchesTotal} / {totalMatches} BATTLES ({percentage}%)
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-4 bg-slate-100 border-2 border-slate-900 rounded-full overflow-hidden p-0.5 relative">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full transition-all duration-300 relative"
          style={{ width: `${Math.max(2, percentage)}%` }}
        >
          {/* Subtle diagonal stripe overlay */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] [background-size:1rem_1rem]" />
        </div>
      </div>
    </div>
  );
}
