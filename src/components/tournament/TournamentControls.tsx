"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, LayoutGrid, Home } from "lucide-react";
import { useState } from "react";

interface TournamentControlsProps {
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
}

export function TournamentControls({
  onUndo,
  onReset,
  canUndo,
}: TournamentControlsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between gap-2 flex-wrap text-sm font-bold select-none pt-2">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-slate-900 rounded-lg hover:bg-slate-100 shadow-[2px_2px_0px_#121316] transition-all text-slate-800"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 border-slate-900 transition-all ${
              canUndo
                ? "bg-amber-300 hover:bg-amber-400 text-slate-900 shadow-[2px_2px_0px_#121316] cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-400"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Undo (Z)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/bracket"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-300 hover:bg-sky-400 text-slate-900 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#121316] transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Bracket View</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#121316] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 max-w-md w-full shadow-[8px_8px_0px_#121316] flex flex-col gap-4 text-center">
            <div className="p-3 bg-rose-100 rounded-full w-fit mx-auto border-2 border-slate-900 text-rose-600">
              <RotateCcw className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black font-heading text-slate-900">
              Reset Tournament?
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to restart? Your current progress will be lost and a fresh tournament bracket will be generated.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold border-2 border-slate-900 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onReset();
                }}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#121316]"
              >
                Yes, Reset!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
