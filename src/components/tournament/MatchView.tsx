"use client";

import { Cartoon } from "@/types/cartoon";
import { Match, TournamentProgress, TournamentState } from "@/types/tournament";
import { useCallback, useEffect, useState } from "react";
import { CartoonCard } from "./CartoonCard";
import { MatchHeader } from "./MatchHeader";
import { ProgressBar } from "./ProgressBar";
import { RoundCompleteModal } from "./RoundCompleteModal";
import { TournamentControls } from "./TournamentControls";

interface MatchViewProps {
  tournament: TournamentState;
  currentMatch: Match | null;
  progress: TournamentProgress | null;
  onSelectWinner: (winnerId: number) => void;
  onUndo: () => void;
  onReset: () => void;
}

export function MatchView({
  tournament,
  currentMatch,
  progress,
  onSelectWinner,
  onUndo,
  onReset,
}: MatchViewProps) {
  const [selectedWinnerId, setSelectedWinnerId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] = useState(false);
  const [lastCompletedRoundNum, setLastCompletedRoundNum] = useState<number | null>(null);

  // Monitor round transitions to pop Round Complete Modal
  useEffect(() => {
    if (tournament && tournament.currentRound > 1 && !tournament.completed) {
      if (
        tournament.currentMatch === 0 &&
        lastCompletedRoundNum !== tournament.currentRound
      ) {
        setShowRoundCompleteModal(true);
        setLastCompletedRoundNum(tournament.currentRound);
      }
    }
  }, [tournament, lastCompletedRoundNum]);

  const handlePick = useCallback(
    (cartoon: Cartoon | null) => {
      if (!cartoon || isProcessing) return;

      setIsProcessing(true);
      setSelectedWinnerId(cartoon.id);

      // Snappy delay (250ms) for high-speed choices
      setTimeout(() => {
        onSelectWinner(cartoon.id);
        setSelectedWinnerId(null);
        setIsProcessing(false);
      }, 250);
    },
    [isProcessing, onSelectWinner]
  );

  // Keyboard shortcut listener: A/Left -> Cartoon A, D/Right -> Cartoon B, Z -> Undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRoundCompleteModal || isProcessing) return;

      const key = e.key.toLowerCase();
      if (key === "a" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentMatch?.cartoonA) {
          handlePick(currentMatch.cartoonA);
        }
      } else if (key === "d" || e.key === "ArrowRight") {
        e.preventDefault();
        if (currentMatch?.cartoonB) {
          handlePick(currentMatch.cartoonB);
        }
      } else if (key === "z") {
        e.preventDefault();
        onUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentMatch, handlePick, isProcessing, onUndo, showRoundCompleteModal]);

  if (!currentMatch || !currentMatch.cartoonA || !currentMatch.cartoonB) {
    return (
      <div className="w-full flex items-center justify-center min-h-[50vh]">
        <div className="text-center font-bold font-mono text-slate-600 animate-pulse">
          Loading match details...
        </div>
      </div>
    );
  }

  const isGrandFinal = tournament.currentRound === 8;
  const canUndo = (tournament.historyStack?.length || 0) > 0;

  // Gather advancing cartoons for Round Complete Modal
  const prevRoundObj = tournament.rounds[tournament.currentRound - 2];
  const advancingCartoons: Cartoon[] = [];
  if (prevRoundObj) {
    prevRoundObj.matches.forEach((m) => {
      const winner =
        m.cartoonA?.id === m.winnerId
          ? m.cartoonA
          : m.cartoonB?.id === m.winnerId
          ? m.cartoonB
          : null;
      if (winner) advancingCartoons.push(winner);
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-4 px-3 md:px-6 select-none">
      {/* Top Toolbar */}
      <TournamentControls
        onUndo={onUndo}
        onReset={onReset}
        canUndo={canUndo}
      />

      {/* Round & Match Header */}
      <MatchHeader
        roundName={progress?.currentRoundName || "Match"}
        matchInRound={progress?.matchInRound || 1}
        totalMatchesInRound={progress?.totalMatchesInRound || 1}
        isGrandFinal={isGrandFinal}
      />

      {/* Main A vs B Battle Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch relative my-2">
        {/* Cartoon A (Left) */}
        <CartoonCard
          cartoon={currentMatch.cartoonA}
          shortcutKey="A"
          shortcutArrow="←"
          isSelected={selectedWinnerId === currentMatch.cartoonA.id}
          onSelect={() => handlePick(currentMatch.cartoonA)}
          disabled={isProcessing}
        />

        {/* VS Badge Divider */}
        <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-30 flex items-center justify-center my-[-8px] md:my-0">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 text-amber-300 font-black font-heading text-xl md:text-2xl border-4 border-amber-400 flex items-center justify-center shadow-[4px_4px_0px_#121316] rotate-[-6deg]">
            VS
          </div>
        </div>

        {/* Cartoon B (Right) */}
        <CartoonCard
          cartoon={currentMatch.cartoonB}
          shortcutKey="D"
          shortcutArrow="→"
          isSelected={selectedWinnerId === currentMatch.cartoonB.id}
          onSelect={() => handlePick(currentMatch.cartoonB)}
          disabled={isProcessing}
        />
      </div>

      {/* Bottom Progress Bar */}
      {progress && (
        <ProgressBar
          completedMatchesTotal={progress.completedMatchesTotal}
          totalMatches={255}
          percentage={progress.percentage}
          currentRoundName={progress.currentRoundName}
        />
      )}

      {/* Round Complete Transition Modal */}
      {showRoundCompleteModal && (
        <RoundCompleteModal
          completedRoundName={
            tournament.rounds[tournament.currentRound - 2]?.name || "Round"
          }
          nextRoundName={progress?.currentRoundName || "Next Round"}
          advancingCartoons={advancingCartoons}
          onContinue={() => setShowRoundCompleteModal(false)}
        />
      )}
    </div>
  );
}
