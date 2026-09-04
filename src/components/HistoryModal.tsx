import React from 'react';
import { X, Calendar, CheckCircle2, Clock, Award } from 'lucide-react';
import type { Medication, MedicationLog } from '../types/medication';

interface HistoryModalProps {
  isOpen: boolean;
  medications: Medication[];
  logs: MedicationLog[];
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  medications,
  logs,
  onClose,
}) => {
  if (!isOpen) return null;

  // Generate last 7 days list
  const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
      
      // Calculate how many meds were taken this day
      const dayLogs = logs.filter(l => l.date === dateStr && l.status === 'taken');
      const isToday = i === 0;

      days.push({
        dateStr,
        dayName,
        isToday,
        takenCount: dayLogs.length,
        totalCount: medications.length,
        isComplete: medications.length > 0 && dayLogs.length >= medications.length,
        logs: dayLogs,
      });
    }
    return days;
  };

  const pastDays = getLast7Days();
  const completedDaysCount = pastDays.filter(d => d.isComplete).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-50 text-rose-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800">
                Haftalık Takip & Geçmiş
              </h2>
              <p className="text-[11px] text-stone-400 font-medium">
                Son 7 gündeki düzenlilik durumun
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weekly Adherence Badge */}
        <div className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-rose-500" />
            <div>
              <p className="text-xs font-bold text-stone-800">
                Haftalık Başarı: {completedDaysCount} / 7 Gün
              </p>
              <p className="text-[11px] text-stone-500">
                {completedDaysCount >= 5 ? 'İnanılmaz bir disiplin! Harikasın 💖' : 'Düzenini adım adım oturtuyorsun 🌸'}
              </p>
            </div>
          </div>
        </div>

        {/* Days List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {pastDays.map((day) => (
            <div
              key={day.dateStr}
              className={`p-3.5 rounded-2xl border transition-all ${
                day.isComplete
                  ? 'bg-emerald-50/50 border-emerald-100'
                  : 'bg-stone-50/60 border-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    day.isComplete ? 'bg-emerald-500' : 'bg-amber-400'
                  }`} />
                  <span className="text-xs font-bold text-stone-800">
                    {day.dayName} {day.isToday && <span className="text-rose-500 font-bold">(Bugün)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={day.isComplete ? 'text-emerald-700' : 'text-stone-600'}>
                    {day.takenCount} / {day.totalCount} Alındı
                  </span>
                  {day.isComplete && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </div>

              {/* Medication detail breakdown */}
              {day.logs.length > 0 && (
                <div className="mt-2 pt-2 border-t border-stone-200/50 space-y-1">
                  {day.logs.map((log) => {
                    const med = medications.find(m => m.id === log.medicationId);
                    const takenTime = log.takenAt ? new Date(log.takenAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '';
                    return (
                      <div key={log.id} className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-medium truncate">{med?.name || 'İlaç'}</span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
                          <Clock className="w-3 h-3" />
                          {takenTime}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
