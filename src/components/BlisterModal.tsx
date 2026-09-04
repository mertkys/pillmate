import React, { useState } from 'react';
import { X, Check, RefreshCw, HelpCircle, Package } from 'lucide-react';
import type { Medication } from '../types/medication';

interface BlisterModalProps {
  medication: Medication | null;
  onClose: () => void;
  onRefill: (medicationId: string, newTotal: number) => void;
}

export const BlisterModal: React.FC<BlisterModalProps> = ({
  medication,
  onClose,
  onRefill,
}) => {
  const [showRefillInput, setShowRefillInput] = useState(false);
  const [refillCount, setRefillCount] = useState(medication?.totalStock || 30);

  if (!medication) return null;

  const total = medication.totalStock;
  const remaining = medication.remainingStock;
  const takenCount = Math.max(0, total - remaining);

  const handleRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefill(medication.id, Number(refillCount));
    setShowRefillInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
              <Package className="w-3.5 h-3.5" />
              <span>Sanal Kutu & Blister Kontrolü</span>
            </div>
            <h2 className="text-lg font-bold text-stone-800 mt-0.5">
              {medication.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tip Box: Why this solves "Acaba içtim mi?" */}
        <div className="my-3 p-3 rounded-2xl bg-pink-50/70 border border-pink-100 text-xs text-stone-600 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-stone-800">
              "Acaba içtim mi?" diye şüpheye mi düştün?
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
              Masandaki gerçek tablet kutunu eline al. Kutuda kaç tane boşluk ve kaç tane dolu hap varsa, aşağıdaki görselle karşılaştır. Sayılar tutuyorsa %100 eminsin! 🌸
            </p>
          </div>
        </div>

        {/* Stats counter */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Kullanılan / Boş</span>
            <span className="text-xl font-extrabold text-emerald-800">{takenCount} Adet</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-100 text-center">
            <span className="text-[11px] font-bold text-rose-700 block">Kutuda Kalan</span>
            <span className="text-xl font-extrabold text-rose-800">{remaining} Adet</span>
          </div>
        </div>

        {/* Realistic Blister Pack Visualizer */}
        <div className="flex-1 overflow-y-auto px-1 py-2">
          <div className="p-4 rounded-3xl bg-gradient-to-b from-stone-200 via-stone-100 to-stone-200 border-2 border-stone-300 shadow-inner">
            <div className="text-[10px] font-bold tracking-widest text-stone-500 text-center uppercase mb-3">
              — Blister Tablet Şeridi —
            </div>

            {/* Grid of pills */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 justify-items-center">
              {Array.from({ length: total }).map((_, index) => {
                const isTakenPill = index < takenCount;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1"
                    title={`Hap #${index + 1}: ${isTakenPill ? 'İçildi (Boş)' : 'Kutuda Var'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isTakenPill
                          ? 'bg-stone-300/80 border-2 border-dashed border-stone-400 shadow-inner'
                          : 'bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500 border-2 border-white shadow-md ring-2 ring-pink-200 animate-pulse-soft'
                      }`}
                    >
                      {isTakenPill ? (
                        <Check className="w-4 h-4 text-stone-500 stroke-[2.5]" />
                      ) : (
                        <div className="w-2.5 h-5 rounded-full bg-white/40 shadow-xs" />
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-stone-400">
                      {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: Refill box button */}
        <div className="pt-3 mt-2 border-t border-stone-100">
          {showRefillInput ? (
            <form onSubmit={handleRefillSubmit} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="200"
                value={refillCount}
                onChange={(e) => setRefillCount(Number(e.target.value))}
                className="w-24 px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Kutu Adedi"
              />
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Yeni Kutuyu Başlat
              </button>
              <button
                type="button"
                onClick={() => setShowRefillInput(false)}
                className="py-2 px-3 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold"
              >
                İptal
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowRefillInput(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs active:scale-98 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yeni Kutu Açtım / Kutuyu Yenile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
