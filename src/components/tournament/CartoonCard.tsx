"use client";

import { Cartoon } from "@/types/cartoon";
import { useState } from "react";
import { FallbackPoster } from "./FallbackPoster";
import { Check, Sparkles } from "lucide-react";

interface CartoonCardProps {
  cartoon: Cartoon;
  shortcutKey: string; // "A" or "D"
  shortcutArrow: string; // "←" or "→"
  isSelected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function CartoonCard({
  cartoon,
  shortcutKey,
  shortcutArrow,
  isSelected = false,
  onSelect,
  disabled = false,
}: CartoonCardProps) {
  const [imageError, setImageError] = useState(false);

  const categoryBadgeStyle: Record<string, string> = {
    "cartoon-network": "bg-black text-white",
    disney: "bg-blue-600 text-white",
    nickelodeon: "bg-orange-500 text-white",
    classic: "bg-amber-500 text-black",
    anime: "bg-rose-600 text-white",
    bibi: "bg-yellow-400 text-black",
    superhero: "bg-indigo-600 text-white",
    "adult-animation": "bg-purple-600 text-white",
    international: "bg-emerald-600 text-white",
    "toy-battle": "bg-red-700 text-white",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={`Select ${cartoon.name}`}
      className={`group relative w-full flex flex-col items-center justify-between p-3 md:p-5 rounded-xl border-3 border-slate-900 text-left transition-all duration-150 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-400 select-none ${
        isSelected
          ? "winner-selected shadow-xl scale-[1.02]"
          : "bg-white hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_#121316] shadow-[4px_4px_0px_#121316]"
      }`}
    >
      {/* Keyboard Shortcut Indicator */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-amber-300 text-slate-900 border-2 border-slate-900 px-2 py-1 rounded-md text-xs font-bold shadow-[2px_2px_0px_#121316]">
        <span>[{shortcutKey}]</span>
        <span className="hidden md:inline">{shortcutArrow}</span>
      </div>

      {/* Selected Indicator Badge */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-20 bg-emerald-500 text-white border-2 border-slate-900 px-2.5 py-1 rounded-md text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#121316] animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>WINNER!</span>
        </div>
      )}

      {/* Cartoon Image / Fallback Container - Large Poster Container */}
      <div className="w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px] my-2.5 rounded-2xl overflow-hidden border-3 border-slate-900 relative bg-slate-950 flex items-center justify-center shadow-inner">
        {cartoon.image && !imageError ? (
          <>
            {/* Ambient Blurred Backdrop to smoothly fill entire frame */}
            <img
              src={cartoon.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
            />
            {/* Main Full Poster - 100% visible, fully uncropped without losing details */}
            <img
              src={cartoon.image}
              alt={cartoon.name}
              onError={() => setImageError(true)}
              className="relative z-10 w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300 drop-shadow-lg"
              loading="eager"
            />
          </>
        ) : (
          <FallbackPoster cartoon={cartoon} size="lg" />
        )}
      </div>

      {/* Title & Metadata Details */}
      <div className="w-full mt-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-[11px] font-black uppercase px-2 py-0.5 rounded border border-slate-900 tracking-wider ${
              categoryBadgeStyle[cartoon.category] || "bg-slate-800 text-white"
            }`}
          >
            {cartoon.category.replace("-", " ")}
          </span>
          {cartoon.year && (
            <span className="text-xs font-mono font-semibold text-slate-600">
              {cartoon.region ? `${cartoon.region} • ` : ""}{cartoon.year}
            </span>
          )}
        </div>

        <h3 className="text-xl md:text-2xl font-black font-heading text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
          {cartoon.name}
        </h3>

        {cartoon.originalName && cartoon.originalName !== cartoon.name && (
          <p className="text-xs text-slate-500 font-mono line-clamp-1 italic">
            ({cartoon.originalName})
          </p>
        )}

        {cartoon.tags && cartoon.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {cartoon.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono border border-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Big Action Button Visual */}
      <div className="w-full mt-3 py-2.5 bg-amber-400 group-hover:bg-amber-300 text-slate-900 font-black rounded-lg border-2 border-slate-900 text-center uppercase tracking-wide text-sm md:text-base shadow-[2px_2px_0px_#121316] flex items-center justify-center gap-1.5 transition-colors">
        <Sparkles className="w-4 h-4" />
        <span>PICK {cartoon.name.split(" ")[0]}</span>
      </div>
    </button>
  );
}
