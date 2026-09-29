"use client";

import { MatchView } from "@/components/tournament/MatchView";
import { WinnerScreen } from "@/components/tournament/WinnerScreen";
import { useTournament } from "@/hooks/useTournament";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PlayPage() {
  const router = useRouter();
  const {
    tournament,
    isLoaded,
    currentMatch,
    progress,
    champion,
    runnerUp,
    finalFour,
    championPath,
    startTournament,
    selectWinner,
    undo,
    reset,
  } = useTournament();

  useEffect(() => {
    if (isLoaded && !tournament) {
      startTournament("balanced");
    }
  }, [isLoaded, tournament, startTournament]);

  if (!isLoaded || !tournament) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#FBF8F1]">
        <div className="text-center font-black font-heading text-xl text-slate-800 animate-pulse">
          PREPARING CARTOON SUPER CUP ARENA...
        </div>
      </main>
    );
  }

  // If tournament is complete, render Winner Screen!
  if (tournament.completed && champion) {
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
    <main className="min-h-screen w-full bg-[#FBF8F1] py-4">
      <MatchView
        tournament={tournament}
        currentMatch={currentMatch}
        progress={progress}
        onSelectWinner={selectWinner}
        onUndo={undo}
        onReset={() => reset("balanced")}
      />
    </main>
  );
}
