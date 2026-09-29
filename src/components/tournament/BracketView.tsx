"use client";

import { TournamentState } from "@/types/tournament";
import { useState } from "react";
import { CartoonThumbnail } from "./CartoonThumbnail";
import { Trophy, ArrowLeft, Swords } from "lucide-react";
import Link from "next/link";

interface BracketViewProps {
  tournament: TournamentState;
}

export function BracketView({ tournament }: BracketViewProps) {
  const [selectedRound, setSelectedRound] = useState<number>(
    tournament.currentRound || 1
  );

  const activeRound = tournament.rounds[selectedRound - 1];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-6 px-4 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white border-3 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_#121316]">
        <div className="flex items-center gap-3">
          <Link
            href="/play"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-300 hover:bg-amber-400 text-slate-900 font-extrabold border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#121316] transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Play</span>
          </Link>

          <div>
            <h1 className="text-2xl font-black font-heading text-slate-900">
              TOURNAMENT BRACKET
            </h1>
            <p className="text-xs text-slate-600 font-mono font-bold">
              ID: {tournament.tournamentId} • Mode: {tournament.mode.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 text-amber-300 font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-900 text-xs">
          <Swords className="w-4 h-4 text-orange-400" />
          <span>Round {tournament.currentRound} / 8</span>
        </div>
      </div>

      {/* Round Tab Selector */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {tournament.rounds.map((round) => {
          const isActive = round.roundNumber === selectedRound;
          const isCurrent = round.roundNumber === tournament.currentRound;

          return (
            <button
              key={round.roundNumber}
              type="button"
              onClick={() => setSelectedRound(round.roundNumber)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border-2 border-slate-900 font-heading font-black text-sm uppercase transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-400 text-slate-900 shadow-[3px_3px_0px_#121316] translate-y-[-2px]"
                  : isCurrent
                  ? "bg-orange-100 text-orange-950 border-orange-500"
                  : "bg-white hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span>{round.name}</span>
              <span className="ml-1.5 text-[11px] font-mono opacity-80 font-bold">
                ({round.matches.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Matches Grid for Selected Round */}
      {activeRound && (
        <div className="w-full bg-slate-50 border-3 border-slate-900 p-4 md:p-6 rounded-2xl shadow-[6px_6px_0px_#121316]">
          <div className="flex items-center justify-between mb-4 border-b-2 border-slate-900 pb-3">
            <h3 className="text-xl font-black font-heading text-slate-900 uppercase">
              {activeRound.name} Matches ({activeRound.matches.length} Battles)
            </h3>

            <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-900 px-2.5 py-1 rounded">
              Showing {activeRound.matches.length} Matches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {activeRound.matches.map((match) => {
              const isMatchDone = match.winnerId !== undefined;
              const isA = match.winnerId === match.cartoonA?.id;
              const isB = match.winnerId === match.cartoonB?.id;

              return (
                <div
                  key={match.id}
                  className={`flex flex-col gap-2 p-3 rounded-xl border-2 border-slate-900 ${
                    isMatchDone ? "bg-white shadow-sm" : "bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                    <span>Match #{match.index + 1}</span>
                    {isMatchDone ? (
                      <span className="text-emerald-600 font-extrabold">FINISHED</span>
                    ) : (
                      <span className="text-amber-600">PENDING</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <CartoonThumbnail
                      cartoon={match.cartoonA}
                      isWinner={isA}
                      size="sm"
                    />

                    <div className="text-[10px] text-center font-black font-mono text-slate-400 py-0.5">
                      VS
                    </div>

                    <CartoonThumbnail
                      cartoon={match.cartoonB}
                      isWinner={isB}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
