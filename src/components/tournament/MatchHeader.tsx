"use client";

import { Keyboard } from "lucide-react";

interface MatchHeaderProps {
  roundName: string;
  matchInRound: number;
  totalMatchesInRound: number;
  isGrandFinal?: boolean;
}

export function MatchHeader({
  roundName,
  matchInRound,
  totalMatchesInRound,
  isGrandFinal = false,
}: MatchHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center gap-2 mb-4 text-center select-none">
      <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 border-2 border-slate-900 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#121316]">
        <span>{isGrandFinal ? "🏆 THE GRAND FINAL 🏆" : roundName}</span>
      </div>

      <h2 className="text-2xl md:text-4xl font-black font-heading text-slate-900 uppercase tracking-tight">
        {isGrandFinal ? (
          <span className="text-red-600 animate-pulse">CHAMPIONSHIP BATTLE</span>
        ) : (
          `MATCH ${matchInRound} OF ${totalMatchesInRound}`
        )}
      </h2>

      <p className="text-sm font-semibold text-slate-600">
        Choose your favorite to advance to the next round!
      </p>

      <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-white border border-slate-900 px-3 py-1 rounded-md text-slate-700 shadow-sm mt-1">
        <Keyboard className="w-4 h-4 text-orange-600" />
        <span>Keys: <kbd className="bg-slate-100 border px-1 py-0.5 rounded font-bold">A</kbd> / <kbd className="bg-slate-100 border px-1 py-0.5 rounded font-bold">←</kbd> Left | <kbd className="bg-slate-100 border px-1 py-0.5 rounded font-bold">D</kbd> / <kbd className="bg-slate-100 border px-1 py-0.5 rounded font-bold">→</kbd> Right | <kbd className="bg-slate-100 border px-1 py-0.5 rounded font-bold">Z</kbd> Undo</span>
      </div>
    </div>
  );
}
