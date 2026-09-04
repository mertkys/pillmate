import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Check } from 'lucide-react';
import type { Medication, FoodStatus, DayPeriod } from '../types/medication';

interface AddEditMedicationModalProps {
  isOpen: boolean;
  medication?: Medication | null;
  onClose: () => void;
  onSave: (medData: Omit<Medication, 'id' | 'createdAt'>, id?: string) => void;
  onDelete?: (id: string) => void;
}

export const AddEditMedicationModal: React.FC<AddEditMedicationModalProps> = ({
  isOpen,
  medication,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [time, setTime] = useState('09:00');
  const [period, setPeriod] = useState<DayPeriod>('morning');
  const [foodStatus, setFoodStatus] = useState<FoodStatus>('after_food');
  const [totalStock, setTotalStock] = useState(30);
  const [remainingStock, setRemainingStock] = useState(30);
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState<'rose' | 'violet' | 'amber' | 'emerald' | 'sky'>('rose');
  const [icon, setIcon] = useState<'pill' | 'capsule' | 'droplet' | 'sparkles'>('pill');

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      setTime(medication.time);
      setPeriod(medication.period);
      setFoodStatus(medication.foodStatus);
      setTotalStock(medication.totalStock);
      setRemainingStock(medication.remainingStock);
      setNotes(medication.notes || '');
      setColor(medication.color);
      setIcon(medication.icon);
    } else {
      setName('');
      setDosage('1 Tablet');
      setTime('09:00');
      setPeriod('morning');
      setFoodStatus('after_food');
      setTotalStock(30);
      setRemainingStock(30);
      setNotes('');
      setColor('rose');
      setIcon('pill');
    }
  }, [medication, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        dosage: dosage.trim(),
        time,
        period,
        foodStatus,
        totalStock: Number(totalStock),
        remainingStock: Number(remainingStock),
        notes: notes.trim(),
        color,
        icon,
        active: true,
      },
      medication?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800">
            {medication ? 'İlacı Düzenle 📝' : 'Yeni İlaç Ekle 🌸'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* Medication Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              İlaç Adı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Demir İlacı, D Vitamini, Alerji Hapı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
            />
          </div>

          {/* Dosage & Time (Row) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Dozaj
              </label>
              <input
                type="text"
                placeholder="Örn: 1 Tablet, 5 Damla"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                İçilme Saati *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>
          </div>

          {/* Day Period */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Günün Hangi Vakti?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'morning', label: 'Sabah ☀️' },
                { id: 'noon', label: 'Öğle 🌤️' },
                { id: 'evening', label: 'Akşam 🌅' },
                { id: 'night', label: 'Gece 🌙' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPeriod(p.id as DayPeriod)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                    period === p.id
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Status */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Yemek Durumu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'after_food', label: 'Tok Karnına 🥣' },
                { id: 'before_food', label: 'Aç Karnına ⏳' },
                { id: 'with_food', label: 'Yemekle Beraber 🥗' },
                { id: 'independent', label: 'Fark Etmez 💧' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFoodStatus(f.id as FoodStatus)}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all text-left flex items-center justify-between ${
                    foodStatus === f.id
                      ? 'bg-pink-50 border-rose-300 text-rose-700'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{f.label}</span>
                  {foodStatus === f.id && <Check className="w-3.5 h-3.5 text-rose-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Stock / Blister Info */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
              Kutu / Blister Takibi (Acaba İçtim mi Koruması)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Kutudaki Toplam Tablet
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={totalStock}
                  onChange={(e) => setTotalStock(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Şu Anda Kalan Tablet
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalStock}
                  value={remainingStock}
                  onChange={(e) => setRemainingStock(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Özel Not (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: Bol suyla içilmeli, buzdolabında saklanmalı"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
            {medication && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bu ilacı silmek istediğinden emin misin?')) {
                    onDelete(medication.id);
                    onClose();
                  }
                }}
                className="p-3 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                title="İlacı Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-colors"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-pink-200 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{medication ? 'Güncelle' : 'Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
