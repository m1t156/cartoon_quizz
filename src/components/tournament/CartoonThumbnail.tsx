"use client";

import { Cartoon } from "@/types/cartoon";
import { useState } from "react";
import { FallbackPoster } from "./FallbackPoster";

interface CartoonThumbnailProps {
  cartoon: Cartoon | null;
  isWinner?: boolean;
  size?: "sm" | "md";
  showCategory?: boolean;
}

export function CartoonThumbnail({
  cartoon,
  isWinner = false,
  size = "md",
  showCategory = true,
}: CartoonThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  if (!cartoon) {
    return (
      <div className="w-full py-2 px-3 bg-slate-100 border border-dashed border-slate-300 rounded text-slate-400 text-xs italic text-center">
        TBD
      </div>
    );
  }

  const containerSizes = {
    sm: "p-1.5 text-xs gap-1.5",
    md: "p-2 text-sm gap-2",
  };

  const imageSizes = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
  };

  return (
    <div
      className={`w-full flex items-center ${containerSizes[size]} rounded-lg border-2 ${
        isWinner
          ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold"
          : "border-slate-800 bg-white text-slate-900"
      }`}
    >
      <div
        className={`${imageSizes[size]} rounded overflow-hidden border border-slate-900 flex-shrink-0 relative bg-slate-200`}
      >
        {cartoon.image && !imageError ? (
          <img
            src={cartoon.image}
            alt={cartoon.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <FallbackPoster cartoon={cartoon} size="sm" />
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate font-semibold leading-snug">{cartoon.name}</span>
        {showCategory && (
          <span className="text-[10px] text-slate-500 uppercase font-mono truncate">
            {cartoon.category}
          </span>
        )}
      </div>

      {isWinner && (
        <span className="text-[10px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded flex-shrink-0">
          WIN
        </span>
      )}
    </div>
  );
}
