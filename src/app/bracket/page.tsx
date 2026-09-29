"use client";

import { BracketView } from "@/components/tournament/BracketView";
import { useTournament } from "@/hooks/useTournament";
import Link from "next/link";
import { Trophy, Play } from "lucide-react";

export default function BracketPage() {
  const { tournament, isLoaded, startTournament } = useTournament();

  if (!isLoaded) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#FBF8F1]">
        <div className="text-center font-black font-heading text-xl text-slate-800 animate-pulse">
          LOADING BRACKET DATA...
        </div>
      </main>
    );
  }

  if (!tournament) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#FBF8F1]">
        <div className="bg-white border-4 border-slate-900 rounded-3xl p-8 max-w-md w-full text-center shadow-[8px_8px_0px_#121316] flex flex-col items-center gap-4">
          <Trophy className="w-12 h-12 text-amber-500" />
          <h2 className="text-2xl font-black font-heading text-slate-900">
            No Active Tournament
          </h2>
          <p className="text-sm text-slate-600">
            Start a new Cartoon Super Cup tournament to view the live bracket!
          </p>
          <Link
            href="/play"
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#121316] flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>START SUPER CUP</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FBF8F1] py-4">
      <BracketView tournament={tournament} />
    </main>
  );
}
