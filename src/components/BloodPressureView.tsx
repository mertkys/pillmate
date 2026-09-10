import React, { useState } from 'react';
import { Plus, Activity, Heart, Calendar, Clock, Trash2, TrendingUp, Sparkles } from 'lucide-react';
import type { BloodPressureLog } from '../types/medication';

interface BloodPressureViewProps {
  logs: BloodPressureLog[];
  onAddLog: (log: Omit<BloodPressureLog, 'id' | 'createdAt'>) => void;
  onDeleteLog: (id: string) => void;
}

export const BloodPressureView: React.FC<BloodPressureViewProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('75');
  const [feeling, setFeeling] = useState<BloodPressureLog['feeling']>('normal');
  const [notes, setNotes] = useState('');

  // Evaluate blood pressure category
  const evaluateBP = (sys: number, dia: number) => {
    if (sys < 90 || dia < 60) {
      return {
        label: 'Düşük Tansiyon',
        badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
        cardBorder: 'border-sky-200',
        iconColor: 'text-sky-500',
        description: 'Tansiyonun normalden biraz düşük. Bol su ve tuzlu ayran iyi gelebilir.',
      };
    }
    if (sys <= 120 && dia <= 80) {
      return {
        label: 'İdeal & Normal',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cardBorder: 'border-emerald-200',
        iconColor: 'text-emerald-500',
        description: 'Tansiyonun harika seviyede! Kendine çok iyi bakıyorsun 🌸',
      };
    }
    if (sys <= 129 && dia < 80) {
      return {
        label: 'Hafif Yüksek',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        cardBorder: 'border-amber-200',
        iconColor: 'text-amber-500',
        description: 'Hafif yüksek seyrediyor. Biraz dinlenip sakinleşmeyi dene.',
      };
    }
    return {
      label: 'Yüksek Tansiyon',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      cardBorder: 'border-rose-200',
      iconColor: 'text-rose-500',
      description: 'Tansiyonun yüksek çıktı. Dinlen ve doktorunun tavsiyelerine uy.',
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    onAddLog({
      date: dateStr,
      time: timeStr,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: pulse ? Number(pulse) : undefined,
      feeling,
      notes: notes.trim() || undefined,
    });

    setNotes('');
    setShowAddForm(false);
  };

  const latestLog = logs[0];
  const latestEvaluation = latestLog ? evaluateBP(latestLog.systolic, latestLog.diastolic) : null;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner / Latest Measurement */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50/50 to-purple-50/40 border border-rose-100 shadow-sm shadow-rose-100/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white text-rose-500 shadow-xs border border-rose-100">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
                Tansiyon Günlüğü
              </span>
              <h2 className="text-base font-bold text-stone-800">
                Günlük Ölçümlerin
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-pink-200 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ölçüm Ekle</span>
          </button>
        </div>

        {latestLog && latestEvaluation ? (
          <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-100/80 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-500">Son Ölçüm</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${latestEvaluation.badgeColor}`}>
                {latestEvaluation.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-800 tracking-tight">
                {latestLog.systolic} / {latestLog.diastolic}
              </span>
              <span className="text-xs font-semibold text-stone-400">mmHg</span>
              {latestLog.pulse && (
                <span className="ml-auto flex items-center gap-1 text-xs font-bold text-rose-500">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  {latestLog.pulse} bpm
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 mt-2 font-medium">
              {latestEvaluation.description}
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-stone-500">
            Henüz tansiyon ölçümü eklenmedi. "Ölçüm Ekle" butonuna basarak ilk kaydını oluşturabilirsin 🌸
          </div>
        )}
      </div>

      {/* Add Measurement Form Modal / Inline */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-3xl bg-white border border-rose-200 shadow-lg shadow-pink-100/50 space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Yeni Tansiyon Ölçümü
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
            >
              Kapat
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Büyük (Sistolik) *
              </label>
              <input
                type="number"
                required
                min="60"
                max="250"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full px-3 py-2.5 text-center text-lg font-extrabold rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Küçük (Diyastolik) *
              </label>
              <input
                type="number"
                required
                min="40"
                max="160"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full px-3 py-2.5 text-center text-lg font-extrabold rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="80"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Nabız (Opsiyonel)
              </label>
              <input
                type="number"
                min="40"
                max="220"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full px-3 py-2.5 text-center text-lg font-extrabold rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="75"
              />
            </div>
          </div>

          {/* Feeling / Mood */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
              Nasıl Hissediyordun?
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                { id: 'great', label: 'Harika', emoji: '🌸' },
                { id: 'normal', label: 'Normal', emoji: '🌿' },
                { id: 'headache', label: 'Baş Ağrısı', emoji: '🤕' },
                { id: 'dizzy', label: 'Baş Dönmesi', emoji: '💫' },
                { id: 'tired', label: 'Yorgun', emoji: '😴' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFeeling(f.id as BloodPressureLog['feeling'])}
                  className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    feeling === f.id
                      ? 'bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-pink-100 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-base">{f.emoji}</span>
                  <span className="truncate w-full">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Notes */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              Ölçüm Notu
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Yemekten 1 saat sonra, hafif yorgundum..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-pink-200 hover:from-rose-600 hover:to-pink-600 transition-all cursor-pointer"
            >
              Ölçümü Kaydet 💖
            </button>
          </div>
        </form>
      )}

      {/* History List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            Ölçüm Geçmişi ({logs.length})
          </span>
          <span className="text-[11px] text-stone-400">
            Doktoruna rahatça gösterebilirsin
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 rounded-2xl bg-white border border-rose-100">
            Kayıt bulunmuyor.
          </div>
        ) : (
          logs.map((log) => {
            const evalResult = evaluateBP(log.systolic, log.diastolic);
            return (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white border border-stone-100 shadow-2xs hover:border-pink-200 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-extrabold text-stone-800">
                      {log.systolic} / {log.diastolic}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-400">mmHg</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${evalResult.badgeColor}`}>
                      {evalResult.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {log.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.time}
                    </span>
                    {log.pulse && (
                      <span className="flex items-center gap-1 text-rose-500 font-semibold">
                        <Heart className="w-3 h-3 fill-rose-500" />
                        {log.pulse} bpm
                      </span>
                    )}
                  </div>

                  {log.notes && (
                    <p className="text-xs text-stone-600 mt-1.5 italic bg-stone-50 p-1.5 rounded-lg">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="text-stone-300 hover:text-rose-500 p-1 rounded transition-colors"
                  title="Ölçümü Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
