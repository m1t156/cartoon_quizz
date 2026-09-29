"use client";

import { CartoonThumbnail } from "@/components/tournament/CartoonThumbnail";
import { WinnerScreen } from "@/components/tournament/WinnerScreen";
import { useTournament } from "@/hooks/useTournament";
import { tournamentStorage } from "@/lib/tournament/tournamentStorage";
import { TournamentHistoryItem } from "@/types/tournament";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trophy, History, Play, Home } from "lucide-react";

export default function ResultsPage() {
  const {
    tournament,
    isLoaded,
    champion,
    runnerUp,
    finalFour,
    championPath,
    reset,
  } = useTournament();
  const [history, setHistory] = useState<TournamentHistoryItem[]>([]);

  useEffect(() => {
    setHistory(tournamentStorage.loadHistory());
  }, []);

  if (!isLoaded) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#FBF8F1]">
        <div className="text-center font-black font-heading text-xl text-slate-800 animate-pulse">
          LOADING RESULTS...
        </div>
      </main>
    );
  }

  // If active tournament is completed, display active Champion screen
  if (tournament && tournament.completed && champion) {
    return (
      <main className="min-h-screen w-full bg-[#FBF8F1] py-8">
        <WinnerScreen
          champion={champion}
          runnerUp={runnerUp}
          finalFour={finalFour}
          championPath={championPath}
          onPlayAgain={() => reset("balanced")}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FBF8F1] py-8 px-4 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 bg-white border-3 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_#121316]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#121316]">
              <History className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-heading text-slate-900">
                HALL OF CHAMPIONS
              </h1>
              <p className="text-xs font-mono font-semibold text-slate-600">
                Past Completed Tournaments & Champions History
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#121316] text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              href="/play"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#121316] text-sm uppercase"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Now</span>
            </Link>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white border-3 border-slate-900 p-6 rounded-2xl shadow-[6px_6px_0px_#121316] flex flex-col gap-4">
          <h2 className="text-xl font-black font-heading text-slate-900 uppercase border-b-2 border-slate-900 pb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>RECENT SUPER CUP WINNERS (LAST 5)</span>
          </h2>

          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono font-semibold flex flex-col items-center gap-3">
              <Trophy className="w-12 h-12 text-slate-300" />
              <p>No completed tournaments yet. Play a full 255-battle tournament to claim your first champion!</p>
              <Link
                href="/play"
                className="mt-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#121316] uppercase text-sm"
              >
                START YOUR FIRST CUP
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border-2 border-slate-900 bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-heading text-amber-500 w-8 text-center">
                      #{idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {new Date(item.date).toLocaleDateString()} • {item.mode.toUpperCase()} MODE
                      </span>
                      <h3 className="text-lg font-black font-heading text-slate-900">
                        Winner: <span className="text-orange-600">{item.champion.name}</span>
                      </h3>
                    </div>
                  </div>

                  {item.runnerUp && (
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-900">
                      <span>Defeated:</span>
                      <CartoonThumbnail cartoon={item.runnerUp} size="sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
