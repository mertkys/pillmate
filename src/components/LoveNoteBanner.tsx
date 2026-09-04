import React, { useState } from 'react';
import { Heart, Sparkles, ChevronRight } from 'lucide-react';
import type { LoveNote } from '../types/medication';

interface LoveNoteBannerProps {
  notes: LoveNote[];
  onOpenModal: () => void;
}

export const LoveNoteBanner: React.FC<LoveNoteBannerProps> = ({ notes, onOpenModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!notes || notes.length === 0) return null;

  const currentNote = notes[currentIndex % notes.length];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % notes.length);
  };

  return (
    <div className="px-5 mb-4">
      <div
        onClick={onOpenModal}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50/60 to-purple-50/40 p-3.5 border border-pink-100/80 shadow-sm shadow-pink-100/30 cursor-pointer transition-all hover:border-pink-200 active:scale-[0.99]"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white/90 text-rose-500 shadow-xs border border-pink-100 shrink-0">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-500 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[11px] font-bold tracking-wide text-rose-500 uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {currentNote.sender}
              </span>
              {notes.length > 1 && (
                <button
                  onClick={handleNext}
                  className="text-[10px] text-stone-400 hover:text-rose-500 font-medium px-1.5 py-0.5 rounded bg-white/60 hover:bg-white transition-colors"
                >
                  Sonraki ({((currentIndex % notes.length) + 1)}/{notes.length})
                </button>
              )}
            </div>

            <p className="text-xs text-stone-700 font-medium leading-relaxed italic line-clamp-2">
              "{currentNote.text}"
            </p>
          </div>

          <ChevronRight className="w-4 h-4 text-pink-300 self-center group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
