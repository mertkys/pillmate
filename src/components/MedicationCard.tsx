import React from 'react';
import { 
  Check, 
  Clock, 
  Utensils, 
  Package, 
  RotateCcw, 
  AlertCircle, 
  Sparkles,
  Pill,
  Droplet,
  Grid
} from 'lucide-react';
import type { Medication, MedicationLog } from '../types/medication';

interface MedicationCardProps {
  medication: Medication;
  log?: MedicationLog;
  onMarkTaken: (id: string) => void;
  onUndo: (id: string) => void;
  onSnooze: (id: string, minutes: number) => void;
  onOpenBlister: (medication: Medication) => void;
  onEdit: (medication: Medication) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  log,
  onMarkTaken,
  onUndo,
  onSnooze,
  onOpenBlister,
  onEdit,
}) => {
  const isTaken = log?.status === 'taken';
  const isSnoozed = log?.status === 'snoozed' && log.snoozedUntil && new Date(log.snoozedUntil) > new Date();

  // Format taken time
  const getTakenTimeString = () => {
    if (!log?.takenAt) return '';
    const date = new Date(log.takenAt);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getSnoozeTimeString = () => {
    if (!log?.snoozedUntil) return '';
    const date = new Date(log.snoozedUntil);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getFoodStatusBadge = () => {
    switch (medication.foodStatus) {
      case 'before_food':
        return { text: 'Aç Karnına', color: 'bg-amber-50 text-amber-700 border-amber-200/70' };
      case 'after_food':
        return { text: 'Tok Karnına', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/70' };
      case 'with_food':
        return { text: 'Yemekle Beraber', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/70' };
      default:
        return { text: 'Fark Etmez', color: 'bg-stone-50 text-stone-600 border-stone-200/60' };
    }
  };

  const foodBadge = getFoodStatusBadge();

  // Icon mapping
  const renderIcon = () => {
    switch (medication.icon) {
      case 'droplet':
        return <Droplet className="w-5 h-5 text-amber-500" />;
      case 'capsule':
        return <Pill className="w-5 h-5 text-rose-500 rotate-45" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      default:
        return <Pill className="w-5 h-5 text-pink-500" />;
    }
  };

  const isLowStock = medication.remainingStock <= 4 && medication.remainingStock > 0;
  const isOutOfStock = medication.remainingStock === 0;

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden ${
        isTaken
          ? 'bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-emerald-50/30 border-emerald-200/80 shadow-xs'
          : isSnoozed
          ? 'bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-amber-50/20 border-amber-200/80 shadow-sm'
          : 'bg-white border-rose-100 shadow-sm shadow-rose-100/30 hover:border-pink-200'
      }`}
    >
      {/* Top Row: Time, Food relation, Edit */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Time Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100/80 text-stone-700 font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>{medication.time}</span>
          </div>

          {/* Food Status Badge */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold ${foodBadge.color}`}>
            <Utensils className="w-3 h-3" />
            <span>{foodBadge.text}</span>
          </div>
        </div>

        {/* Quick Edit */}
        <button
          onClick={() => onEdit(medication)}
          className="text-xs text-stone-400 hover:text-stone-700 font-medium px-2 py-0.5 rounded-lg hover:bg-stone-100 transition-colors"
        >
          Düzenle
        </button>
      </div>

      {/* Main Info: Icon, Name, Dosage */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className={`p-3 rounded-2xl shrink-0 ${
          isTaken ? 'bg-emerald-100/80' : 'bg-pink-50 border border-pink-100'
        }`}>
          {renderIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-bold truncate ${
              isTaken ? 'text-emerald-950 line-through decoration-emerald-400' : 'text-stone-800'
            }`}>
              {medication.name}
            </h3>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Doz: <span className="text-stone-700 font-semibold">{medication.dosage}</span>
          </p>
          {medication.notes && (
            <p className="text-[11px] text-stone-400 mt-1 italic flex items-center gap-1">
              <span>💡</span>
              <span className="truncate">{medication.notes}</span>
            </p>
          )}
        </div>
      </div>

      {/* Stock & Virtual Blister Section (The "Acaba İçtim mi?" savior) */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50/80 border border-stone-100 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Package className={`w-4 h-4 ${
            isOutOfStock ? 'text-rose-500' : isLowStock ? 'text-amber-500' : 'text-stone-400'
          }`} />
          <span className="font-semibold text-stone-600">
            Kutuda Kalan: <strong className={isOutOfStock ? 'text-rose-500' : isLowStock ? 'text-amber-600' : 'text-stone-800'}>
              {medication.remainingStock}
            </strong> / {medication.totalStock}
          </span>
        </div>

        {/* Button to open visual Blister Strip */}
        <button
          onClick={() => onOpenBlister(medication)}
          className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer active:scale-95 transition-all"
          title="Fiziksel kutuyla eşleştirmek için tıkla"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Kutu Görünümü</span>
        </button>
      </div>

      {/* Primary Action Button Area */}
      {isTaken ? (
        /* ALINDI STATE: Bold, clear, unmistakable */
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-100/70 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <p className="text-[13px] text-emerald-900 leading-tight">
                Bugün <span className="underline decoration-emerald-500">{getTakenTimeString()}</span> saatinde içildi 🌸
              </p>
              <p className="text-[10px] text-emerald-700 font-normal">
                İçtin, aklında şüphe kalmasın!
              </p>
            </div>
          </div>

          <button
            onClick={() => onUndo(medication.id)}
            className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-rose-500 px-2 py-1 rounded-lg hover:bg-white/60 transition-colors"
            title="Yanlışlıkla bastıysan geri al"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Geri Al</span>
          </button>
        </div>
      ) : (
        /* İÇİLMEDİ STATE: Big, inviting button with Snooze option */
        <div className="flex items-center gap-2">
          {/* Main "İçtim" Button */}
          <button
            onClick={() => onMarkTaken(medication.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-200 hover:from-rose-500 hover:to-pink-600 active:scale-98 transition-all cursor-pointer group"
          >
            <Check className="w-4 h-4 stroke-[3] group-hover:scale-110 transition-transform" />
            <span>İçtim 🌸</span>
          </button>

          {/* Snooze Button */}
          <button
            onClick={() => onSnooze(medication.id, 15)}
            className={`flex items-center gap-1.5 px-3 py-3 rounded-2xl border text-xs font-semibold active:scale-95 transition-all ${
              isSnoozed
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
            title="15 dakika sonra tekrar hatırlat"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isSnoozed ? `${getSnoozeTimeString()} Ertelendi` : '15dk Ertele'}</span>
          </button>
        </div>
      )}

      {/* Out of stock warning */}
      {isOutOfStock && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Bu ilacın kutusu bitmiş! Yeni kutu almayı unutmayın 🛒</span>
        </div>
      )}
    </div>
  );
};
