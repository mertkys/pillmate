import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles } from 'lucide-react';
import { soundService } from '../services/sound';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundService.playCelebration();

      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#c084fc', '#38bdf8', '#34d399'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-pink-200 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot Image */}
        <div className="w-36 h-36 mx-auto rounded-3xl overflow-hidden ring-4 ring-pink-200 shadow-lg shadow-pink-200/50 mb-4 bg-pink-50">
          <img
            src="/assets/celebration.jpg"
            alt="Kutlama Maskotu"
            className="w-full h-full object-cover animate-float"
          />
        </div>

        {/* Text */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-rose-500 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Günün Görevi Tamamlandı</span>
        </div>

        <h2 className="text-xl font-extrabold text-stone-800 tracking-tight mb-2">
          Harikasın Prensesim! 🌸
        </h2>

        <p className="text-xs text-stone-600 font-medium leading-relaxed mb-5">
          Bugün alman gereken tüm ilaçlarını eksiksiz aldın. Kendine böyle güzel baktığın için seninle gurur duyuyorum! 💖
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-200 hover:from-rose-500 hover:to-pink-600 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Teşekkür Ederim</span>
        </button>
      </div>
    </div>
  );
};
