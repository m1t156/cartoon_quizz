"use client";

import { Cartoon } from "@/types/cartoon";
import Link from "next/link";
import { useState } from "react";
import { FallbackPoster } from "./FallbackPoster";
import { CartoonThumbnail } from "./CartoonThumbnail";
import { Trophy, Copy, Check, RotateCcw, LayoutGrid, Award, Swords, Sparkles } from "lucide-react";

interface WinnerScreenProps {
  champion: Cartoon;
  runnerUp: Cartoon | null;
  finalFour: Cartoon[];
  championPath: { defeated: Cartoon; roundName: string }[];
  onPlayAgain: () => void;
}

export function WinnerScreen({
  champion,
  runnerUp,
  finalFour,
  championPath,
  onPlayAgain,
}: WinnerScreenProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const generateShareText = () => {
    const runnerUpName = runnerUp ? runnerUp.name : "Runner-up";
    const top4Names = finalFour.map((c) => c.name).join(", ");

    return `🏆 MY CARTOON SUPER CUP CHAMPION! 🏆

🥇 Champion: ${champion.name} (${champion.category})
🥈 Final: ${champion.name} vs ${runnerUpName}

🌟 Top 4:
${finalFour.map((c) => `• ${c.name}`).join("\n")}

Played on CARTOON SUPER CUP 256 (255 Battles!)
Who is your childhood champion?`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-6 px-4 select-none">
      {/* Crown Banner */}
      <div className="w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-4 border-slate-900 rounded-3xl p-6 md:p-8 text-center shadow-[10px_10px_0px_#121316] relative overflow-hidden flex flex-col items-center gap-4">
        {/* Decorative sparkles */}
        <div className="absolute top-2 left-4 text-amber-600 opacity-60">
          <Sparkles className="w-10 h-10 animate-spin" />
        </div>
        <div className="absolute bottom-2 right-4 text-amber-600 opacity-60">
          <Sparkles className="w-10 h-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-2 bg-slate-900 text-amber-300 border-2 border-slate-900 px-4 py-1.5 rounded-full text-xs md:text-sm font-black uppercase tracking-widest shadow-[2px_2px_0px_#121316]">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span>CARTOON SUPER CUP CHAMPION</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black font-heading text-slate-900 tracking-tight leading-none uppercase drop-shadow-sm">
          {champion.name}
        </h1>

        {champion.originalName && champion.originalName !== champion.name && (
          <p className="text-sm md:text-base font-mono text-slate-800 font-bold bg-white/60 px-3 py-1 rounded-md border border-slate-900">
            ({champion.originalName})
          </p>
        )}

        {/* Large Champion Poster - 3:4 Poster Ratio */}
        <div className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-4 border-slate-900 shadow-[8px_8px_0px_#121316] my-3 bg-slate-950 relative flex items-center justify-center">
          {champion.image && !imgError ? (
            <>
              {/* Ambient Blurred Backdrop */}
              <img
                src={champion.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 scale-105 pointer-events-none"
              />
              {/* Main Full Poster - fills 100% of the frame without crop/empty bars */}
              <img
                src={champion.image}
                alt={champion.name}
                onError={() => setImgError(true)}
                className="relative z-10 w-full h-full object-cover"
              />
            </>
          ) : (
            <FallbackPoster cartoon={champion} size="lg" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full mt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#121316] hover:shadow-[6px_6px_0px_#121316] transition-all cursor-pointer text-base uppercase"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-slate-900 stroke-[3]" />
                <span>COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>COPY RESULT TEXT</span>
              </>
            )}
          </button>

          <Link
            href="/bracket"
            className="flex items-center gap-2 px-6 py-3.5 bg-sky-300 hover:bg-sky-400 text-slate-900 font-black rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#121316] hover:shadow-[6px_6px_0px_#121316] transition-all text-base uppercase"
          >
            <LayoutGrid className="w-5 h-5" />
            <span>VIEW BRACKET</span>
          </Link>

          <button
            type="button"
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-6 py-3.5 bg-orange-400 hover:bg-orange-300 text-slate-900 font-black rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#121316] hover:shadow-[6px_6px_0px_#121316] transition-all cursor-pointer text-base uppercase"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>

      {/* Podiums & Top Finishers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Final Four Showcase */}
        <div className="bg-white border-3 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0px_#121316] flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-black font-heading text-slate-900 uppercase">
              FINAL FOUR CONTENDERS
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {finalFour.map((c) => {
              const isChamp = c.id === champion.id;
              const isRunner = runnerUp && c.id === runnerUp.id;

              return (
                <div
                  key={c.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border-2 border-slate-900 ${
                    isChamp
                      ? "bg-amber-100 font-bold"
                      : isRunner
                      ? "bg-slate-100"
                      : "bg-white"
                  }`}
                >
                  <CartoonThumbnail cartoon={c} size="md" />
                  <span
                    className={`ml-2 text-xs font-black px-2.5 py-1 rounded border border-slate-900 uppercase flex-shrink-0 ${
                      isChamp
                        ? "bg-amber-400 text-slate-900"
                        : isRunner
                        ? "bg-slate-300 text-slate-900"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isChamp ? "🥇 CHAMPION" : isRunner ? "🥈 RUNNER-UP" : "TOP 4"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Champion Path (Defeated opponents) */}
        <div className="bg-white border-3 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0px_#121316] flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <Swords className="w-6 h-6 text-rose-500" />
            <h3 className="text-xl font-black font-heading text-slate-900 uppercase">
              CHAMPION ROAD TO VICTORY
            </h3>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1">
            {championPath.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-800 text-xs font-semibold"
              >
                <span className="text-slate-500 font-mono text-[11px] font-bold">
                  {item.roundName}
                </span>
                <span className="text-slate-900 font-bold flex-1 text-right truncate">
                  Defeated <span className="text-rose-600 font-black">{item.defeated.name}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
