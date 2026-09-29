"use client";

import { Cartoon } from "@/types/cartoon";
import { CartoonThumbnail } from "./CartoonThumbnail";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";

interface RoundCompleteModalProps {
  completedRoundName: string;
  nextRoundName: string;
  advancingCartoons: Cartoon[];
  onContinue: () => void;
}

export function RoundCompleteModal({
  completedRoundName,
  nextRoundName,
  advancingCartoons,
  onContinue,
}: RoundCompleteModalProps) {
  const previousCount = advancingCartoons.length * 2;
  const currentCount = advancingCartoons.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white border-4 border-slate-900 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-[10px_10px_0px_#121316] flex flex-col gap-6 max-h-[90vh]">
        {/* Banner Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 border-2 border-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_#121316]">
            <Trophy className="w-4 h-4" />
            <span>ROUND VICTORIES</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-900 tracking-tight">
            {completedRoundName.toUpperCase()} COMPLETE!
          </h2>

          <div className="flex items-center gap-3 text-lg md:text-2xl font-black font-mono bg-slate-900 text-amber-300 px-5 py-2 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#FFD166]">
            <span>{previousCount} CARTOONS</span>
            <ArrowRight className="w-6 h-6 text-white stroke-[3]" />
            <span className="text-emerald-400">{currentCount} SURVIVORS</span>
          </div>

          <p className="text-sm font-bold text-slate-600">
            {currentCount} contenders advanced to <span className="text-orange-600 font-extrabold">{nextRoundName}</span>
          </p>
        </div>

        {/* Survivors Grid Showcase */}
        <div className="flex-1 overflow-y-auto border-2 border-slate-900 rounded-xl p-3 bg-slate-50 min-h-[160px] max-h-[300px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {advancingCartoons.map((cartoon) => (
              <CartoonThumbnail
                key={cartoon.id}
                cartoon={cartoon}
                isWinner={true}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Continue Action */}
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-xl font-heading rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#121316] hover:shadow-[6px_6px_0px_#121316] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <span>CONTINUE TO {nextRoundName.toUpperCase()}</span>
          <Sparkles className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
