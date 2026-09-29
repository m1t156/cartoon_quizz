"use client";

import { Cartoon } from "@/types/cartoon";
import { Tv, Sparkles, Gamepad2, Flame, ShieldAlert, Zap, Trophy, Star } from "lucide-react";

interface FallbackPosterProps {
  cartoon: Cartoon;
  size?: "sm" | "md" | "lg";
}

const CATEGORY_THEMES: Record<
  string,
  { bgGradient: string; badgeBg: string; textColor: string; accentColor: string; icon: any }
> = {
  "cartoon-network": {
    bgGradient: "bg-gradient-to-br from-slate-900 via-slate-800 to-black",
    badgeBg: "bg-cyan-400 text-slate-900",
    textColor: "text-white",
    accentColor: "border-cyan-400",
    icon: Tv,
  },
  disney: {
    bgGradient: "bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900",
    badgeBg: "bg-amber-300 text-slate-900",
    textColor: "text-white",
    accentColor: "border-amber-300",
    icon: Sparkles,
  },
  nickelodeon: {
    bgGradient: "bg-gradient-to-br from-orange-500 via-amber-500 to-orange-700",
    badgeBg: "bg-white text-orange-950",
    textColor: "text-white",
    accentColor: "border-white",
    icon: Flame,
  },
  classic: {
    bgGradient: "bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500",
    badgeBg: "bg-slate-900 text-amber-300",
    textColor: "text-slate-900",
    accentColor: "border-slate-900",
    icon: Star,
  },
  anime: {
    bgGradient: "bg-gradient-to-br from-rose-600 via-red-500 to-purple-900",
    badgeBg: "bg-amber-300 text-slate-900",
    textColor: "text-white",
    accentColor: "border-amber-300",
    icon: Zap,
  },
  bibi: {
    bgGradient: "bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800",
    badgeBg: "bg-amber-300 text-slate-900",
    textColor: "text-white",
    accentColor: "border-amber-300",
    icon: Trophy,
  },
  superhero: {
    bgGradient: "bg-gradient-to-br from-indigo-800 via-blue-800 to-slate-950",
    badgeBg: "bg-rose-500 text-white",
    textColor: "text-white",
    accentColor: "border-rose-500",
    icon: ShieldAlert,
  },
  "adult-animation": {
    bgGradient: "bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900",
    badgeBg: "bg-emerald-400 text-slate-900",
    textColor: "text-white",
    accentColor: "border-emerald-400",
    icon: Sparkles,
  },
  international: {
    bgGradient: "bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-800",
    badgeBg: "bg-yellow-300 text-slate-900",
    textColor: "text-white",
    accentColor: "border-yellow-300",
    icon: Tv,
  },
  "toy-battle": {
    bgGradient: "bg-gradient-to-br from-amber-700 via-red-800 to-slate-900",
    badgeBg: "bg-cyan-300 text-slate-900",
    textColor: "text-white",
    accentColor: "border-cyan-300",
    icon: Gamepad2,
  },
};

export function FallbackPoster({ cartoon, size = "md" }: FallbackPosterProps) {
  const theme = CATEGORY_THEMES[cartoon.category] || CATEGORY_THEMES.classic;
  const IconComponent = theme.icon;

  const sizeClasses = {
    sm: "h-full w-full text-[10px] p-1.5",
    md: "h-full w-full text-xs p-3",
    lg: "h-full w-full text-sm p-4",
  };

  return (
    <div
      className={`w-full ${sizeClasses[size]} ${theme.bgGradient} ${theme.textColor} flex flex-col justify-between items-center rounded-lg border-2 border-slate-900 relative overflow-hidden text-center shadow-inner select-none`}
    >
      {/* Background Retro Grid Lines Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none" />

      {/* Top Header Tag */}
      <div className="z-10 flex justify-between items-center w-full px-1">
        <span className="text-[10px] font-mono font-extrabold uppercase opacity-80 bg-black/40 px-1.5 py-0.5 rounded border border-white/20">
          #{cartoon.id}
        </span>
        <span
          className={`text-[10px] font-extrabold font-mono uppercase px-2 py-0.5 rounded border border-slate-900 ${theme.badgeBg}`}
        >
          {cartoon.category.replace("-", " ")}
        </span>
      </div>

      {/* Center Icon & Main Name */}
      <div className="z-10 my-auto flex flex-col items-center justify-center gap-1.5 px-2">
        <div
          className={`p-2.5 rounded-2xl border-2 border-slate-900 ${theme.badgeBg} shadow-[2px_2px_0px_#121316]`}
        >
          <IconComponent className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
        </div>

        <h4 className="font-extrabold font-heading text-lg md:text-xl line-clamp-2 leading-tight drop-shadow-md mt-1">
          {cartoon.name}
        </h4>

        {cartoon.originalName && cartoon.originalName !== cartoon.name && (
          <p className="text-[11px] opacity-80 font-mono line-clamp-1 italic bg-black/30 px-2 py-0.5 rounded border border-white/10">
            ({cartoon.originalName})
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="z-10 text-[10px] font-mono opacity-90 flex items-center justify-center gap-2 font-semibold">
        {cartoon.region && <span>{cartoon.region}</span>}
        {cartoon.year && <span>• {cartoon.year}</span>}
      </div>
    </div>
  );
}
