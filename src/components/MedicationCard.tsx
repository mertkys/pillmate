import React from 'react';
import { 
  Check, 
  Clock, 
  Package, 
  RotateCcw, 
  AlertCircle, 
  Pill,
  Grid,
  Moon,
  Sun,
  Sunset
} from 'lucide-react';
import type { Medication, MedicationLog } from '../types/medication';

interface MedicationCardProps {
  medication: Medication;
  todayLogs: MedicationLog[];
  onMarkDoseTaken: (medicationId: string, doseId: string) => void;
  onUndoDose: (medicationId: string, doseId: string) => void;
  onSnoozeDose: (medicationId: string, doseId: string, minutes: number) => void;
  onOpenBlister: (medication: Medication) => void;
  onEdit: (medication: Medication) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  todayLogs,
  onMarkDoseTaken,
  onUndoDose,
  onSnoozeDose,
  onOpenBlister,
  onEdit,
}) => {
  const doses = medication.doses && medication.doses.length > 0
    ? medication.doses
    : [{ id: 'd-1', time: medication.time, period: medication.period, label: 'Doz' }];

  // Helper to find log for a specific dose
  const getLogForDose = (doseId: string) => {
    return todayLogs.find(l => l.medicationId === medication.id && (l.doseId === doseId || (!l.doseId && doses.length === 1)));
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

  const renderPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'noon':
        return <Sun className="w-3.5 h-3.5 text-orange-500" />;
      case 'evening':
        return <Sunset className="w-3.5 h-3.5 text-rose-500" />;
      case 'night':
        return <Moon className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-stone-400" />;
    }
  };

  const isLowStock = medication.remainingStock <= 4 && medication.remainingStock > 0;
  const isOutOfStock = medication.remainingStock === 0;

  // Check if all doses for this medication are taken
  const allDosesTaken = doses.every(d => {
    const log = getLogForDose(d.id);
    return log && log.status === 'taken';
  });

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden ${
        allDosesTaken
          ? 'bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-emerald-50/20 border-emerald-200/80 shadow-xs'
          : 'bg-white border-rose-100 shadow-sm shadow-rose-100/30 hover:border-pink-200'
      }`}
    >
      {/* Top Header: Name, Food relation, Edit */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-pink-50 border border-pink-100 text-rose-500">
            <Pill className="w-5 h-5 rotate-45" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-bold truncate ${
                allDosesTaken ? 'text-emerald-950 line-through decoration-emerald-400' : 'text-stone-800'
              }`}>
                {medication.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-xl border text-[10px] font-bold ${foodBadge.color}`}>
                {foodBadge.text}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Doz: <strong className="text-stone-700">{medication.dosage}</strong>
              {doses.length > 1 && (
                <span className="ml-2 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  Günde {doses.length} Kez
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => onEdit(medication)}
          className="text-xs text-stone-400 hover:text-stone-700 font-medium px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
        >
          Düzenle
        </button>
      </div>

      {medication.notes && (
        <p className="text-[11px] text-stone-400 mb-3 italic flex items-center gap-1">
          <span>💡</span>
          <span className="truncate">{medication.notes}</span>
        </p>
      )}

      {/* Stock & Virtual Blister Section */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50/80 border border-stone-100 mb-3 text-xs">
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

        <button
          onClick={() => onOpenBlister(medication)}
          className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer active:scale-95 transition-all"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Kutu Görünümü</span>
        </button>
      </div>

      {/* Doses Section (Multi-Dose Support: Sabah / Akşam) */}
      <div className="space-y-2.5 pt-1">
        {doses.map((dose) => {
          const log = getLogForDose(dose.id);
          const isTaken = log?.status === 'taken';
          const isSnoozed = log?.status === 'snoozed';
          const takenTime = log?.takenAt ? new Date(log.takenAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '';

          return (
            <div
              key={dose.id}
              className={`p-3 rounded-2xl border transition-all ${
                isTaken
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-white border-stone-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {/* Dose time and label */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100/90 text-stone-700 font-bold text-xs">
                    {renderPeriodIcon(dose.period)}
                    <span>{dose.time}</span>
                  </div>
                  <span className="text-xs font-bold text-stone-700">
                    {dose.label || 'Doz'}
                  </span>
                </div>

                {/* Status action */}
                {isTaken ? (
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                        {takenTime} İçildi 🌸
                      </span>
                      {log?.isMidnightShifted && (
                        <span className="text-[10px] text-indigo-700 font-bold block">
                          🌙 Gece (Dünün Dozu)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onUndoDose(medication.id, dose.id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-white/60 transition-colors"
                      title="Geri Al"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSnoozeDose(medication.id, dose.id, 15)}
                      className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors cursor-pointer ${
                        isSnoozed ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                      }`}
                      title="15 dk ertele"
                    >
                      {isSnoozed ? 'Ertelendi ⏰' : 'Ertele'}
                    </button>

                    <button
                      onClick={() => onMarkDoseTaken(medication.id, dose.id)}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-xs shadow-sm shadow-pink-200 active:scale-95 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>İçtim 🌸</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isOutOfStock && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Bu ilacın kutusu bitmiş! Yeni kutu almayı unutmayın 🛒</span>
        </div>
      )}
    </div>
  );
};
