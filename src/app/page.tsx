"use client";

import { useTournament } from "@/hooks/useTournament";
import { TournamentMode } from "@/types/tournament";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trophy, Play, RotateCcw, Sparkles, Swords, Tv, Dices, Shuffle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { tournament, isLoaded, startTournament, reset } = useTournament();
  const [selectedMode, setSelectedMode] = useState<TournamentMode>("balanced");

  const hasActiveTournament =
    tournament && !tournament.completed && tournament.currentRound > 0;

  const handleStartNew = (mode: TournamentMode) => {
    startTournament(mode);
    router.push("/play");
  };

  const handleContinue = () => {
    router.push("/play");
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 select-none">
      {/* Top Bar / Brand Tag */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 border-b-2 border-slate-900/20">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-400 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#121316]">
            <Tv className="w-5 h-5 text-slate-900" />
          </div>
          <span className="font-extrabold font-heading text-lg text-slate-900 tracking-tight">
            TV CHILDHOOD ARENA
          </span>
        </div>

        <Link
          href="/bracket"
          className="text-xs font-mono font-bold bg-white border-2 border-slate-900 px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#121316] hover:bg-slate-100 transition-all text-slate-800"
        >
          BRACKET VIEWER
        </Link>
      </header>

      {/* Main Hero Card */}
      <section className="w-full max-w-3xl my-auto flex flex-col items-center text-center gap-6 bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-12 shadow-[12px_12px_0px_#121316] relative overflow-hidden">
        {/* Subtle retro Grid background */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-amber-300 text-slate-900 border-2 border-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_#121316]">
          <Swords className="w-4 h-4 text-orange-600" />
          <span>THE ULTIMATE NOSTALGIA TOURNAMENT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-slate-900 tracking-tight leading-none uppercase">
          CARTOON <br />
          <span className="text-amber-500 drop-shadow-[2px_2px_0px_#121316]">SUPER CUP</span> <br />
          <span className="bg-slate-900 text-amber-300 px-4 py-1 rounded-2xl inline-block mt-1">256</span>
        </h1>

        <p className="text-base sm:text-xl font-bold font-mono text-slate-700 max-w-md">
          256 cartoons. 255 battles. 1 champion.
        </p>

        {/* Mode Selector */}
        <div className="w-full max-w-md bg-slate-100 p-2 rounded-2xl border-2 border-slate-900 flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedMode("balanced")}
            className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-black text-xs md:text-sm uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedMode === "balanced"
                ? "bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#121316]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>Balanced Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode("full-random")}
            className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-black text-xs md:text-sm uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedMode === "full-random"
                ? "bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#121316]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Full Random</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        {isLoaded && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mt-2">
            {hasActiveTournament ? (
              <>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full sm:flex-1 py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-lg md:text-xl font-heading rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#121316] hover:shadow-[6px_6px_0px_#121316] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>CONTINUE TOURNAMENT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartNew(selectedMode)}
                  className="w-full sm:w-auto py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl border-3 border-slate-900 shadow-[2px_2px_0px_#121316] transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>New Cup</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleStartNew(selectedMode)}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xl md:text-2xl font-heading rounded-2xl border-3 border-slate-900 shadow-[6px_6px_0px_#121316] hover:shadow-[8px_8px_0px_#121316] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <Sparkles className="w-6 h-6" />
                <span>START SUPER CUP</span>
              </button>
            )}
          </div>
        )}

        {/* Quick Features List */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 w-full mt-4 border-t-2 border-slate-900/15 pt-6 text-slate-800">
          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-900/10">
            <span className="text-2xl md:text-3xl font-black font-heading text-slate-900">
              256
            </span>
            <span className="text-[10px] md:text-xs font-mono font-bold text-slate-600 uppercase">
              Contestants
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-900/10">
            <span className="text-2xl md:text-3xl font-black font-heading text-slate-900">
              8
            </span>
            <span className="text-[10px] md:text-xs font-mono font-bold text-slate-600 uppercase">
              Knockout Rounds
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-900/10">
            <span className="text-2xl md:text-3xl font-black font-heading text-slate-900">
              1
            </span>
            <span className="text-[10px] md:text-xs font-mono font-bold text-slate-600 uppercase">
              Champion
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center py-4 text-xs font-mono text-slate-500 font-semibold">
        CARTOON SUPER CUP 256 • 100% Client-Side Persistence • Keyboard A/D/Z Supported
      </footer>
    </main>
  );
}
