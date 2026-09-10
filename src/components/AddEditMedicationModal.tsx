import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Check, Clock } from 'lucide-react';
import type { Medication, FoodStatus, DayPeriod, MedicationDose } from '../types/medication';

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
  const [foodStatus, setFoodStatus] = useState<FoodStatus>('after_food');
  const [totalStock, setTotalStock] = useState(30);
  const [remainingStock, setRemainingStock] = useState(30);
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState<'rose' | 'violet' | 'amber' | 'emerald' | 'sky'>('rose');
  const [icon, setIcon] = useState<'pill' | 'capsule' | 'droplet' | 'sparkles'>('pill');

  // Multiple Doses State (Sabah & Akşam vb.)
  const [doses, setDoses] = useState<MedicationDose[]>([
    { id: 'd-1', time: '09:00', period: 'morning', label: 'Sabah Dozu' },
  ]);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      setFoodStatus(medication.foodStatus);
      setTotalStock(medication.totalStock);
      setRemainingStock(medication.remainingStock);
      setNotes(medication.notes || '');
      setColor(medication.color);
      setIcon(medication.icon);
      if (medication.doses && medication.doses.length > 0) {
        setDoses(medication.doses);
      } else {
        setDoses([{ id: 'd-1', time: medication.time || '09:00', period: medication.period || 'morning', label: 'Doz 1' }]);
      }
    } else {
      setName('');
      setDosage('1 Tablet');
      setFoodStatus('after_food');
      setTotalStock(30);
      setRemainingStock(30);
      setNotes('');
      setColor('rose');
      setIcon('pill');
      setDoses([{ id: 'd-1', time: '09:00', period: 'morning', label: 'Sabah' }]);
    }
  }, [medication, isOpen]);

  if (!isOpen) return null;

  // Add another dose slot
  const handleAddDose = (periodPreset: DayPeriod = 'evening', timePreset: string = '21:00', labelPreset: string = 'Akşam') => {
    setDoses((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}-${prev.length + 1}`,
        time: timePreset,
        period: periodPreset,
        label: labelPreset,
      },
    ]);
  };

  const handleRemoveDose = (index: number) => {
    if (doses.length <= 1) return;
    setDoses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDoseChange = (index: number, field: keyof MedicationDose, value: string) => {
    setDoses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || doses.length === 0) return;

    onSave(
      {
        name: name.trim(),
        dosage: dosage.trim(),
        time: doses[0].time,
        period: doses[0].period,
        doses,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800">
            {medication ? 'İlacı Düzenle 📝' : 'Yeni İlaç Ekle 🌸'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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
              placeholder="Örn: Demir İlacı, Tansiyon İlacı, Vitamin D"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
            />
          </div>

          {/* Dosage & Food Status */}
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
                className="w-full px-3 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Yemek İlişkisi
              </label>
              <select
                value={foodStatus}
                onChange={(e) => setFoodStatus(e.target.value as FoodStatus)}
                className="w-full px-3 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs bg-white"
              >
                <option value="after_food">Tok Karnına 🥣</option>
                <option value="before_food">Aç Karnına ⏳</option>
                <option value="with_food">Yemekle Birlikte 🥗</option>
                <option value="independent">Fark Etmez 💧</option>
              </select>
            </div>
          </div>

          {/* MULTI-DOSE TIME PICKER (Sabah + Akşam) */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                  İçilme Vakitleri & Doz Saatleri
                </span>
                <span className="text-[10px] text-stone-500">
                  Günde 1, 2 veya daha fazla saat ekleyebilirsin
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1">
                {doses.length === 1 && (
                  <button
                    type="button"
                    onClick={() => handleAddDose('night', '21:00', 'Akşam')}
                    className="text-[10px] font-bold bg-white text-rose-600 border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    + Akşam Ekle
                  </button>
                )}
              </div>
            </div>

            {/* List of Doses */}
            <div className="space-y-2">
              {doses.map((dose, idx) => (
                <div
                  key={dose.id || idx}
                  className="p-2.5 rounded-xl bg-white border border-rose-100 flex items-center gap-2 shadow-2xs"
                >
                  <Clock className="w-4 h-4 text-rose-500 shrink-0" />

                  {/* Dose Label (Sabah / Akşam) */}
                  <input
                    type="text"
                    value={dose.label || ''}
                    onChange={(e) => handleDoseChange(idx, 'label', e.target.value)}
                    placeholder="Örn: Sabah"
                    className="w-20 px-2 py-1 text-xs rounded-lg border border-stone-200 font-semibold"
                  />

                  {/* Time picker */}
                  <input
                    type="time"
                    required
                    value={dose.time}
                    onChange={(e) => handleDoseChange(idx, 'time', e.target.value)}
                    className="w-24 px-2 py-1 text-xs rounded-lg border border-stone-200 font-bold"
                  />

                  {/* Period selector */}
                  <select
                    value={dose.period}
                    onChange={(e) => handleDoseChange(idx, 'period', e.target.value as DayPeriod)}
                    className="flex-1 px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                  >
                    <option value="morning">Sabah ☀️</option>
                    <option value="noon">Öğle 🌤️</option>
                    <option value="evening">Akşam 🌅</option>
                    <option value="night">Gece 🌙</option>
                  </select>

                  {/* Remove button (if more than 1 dose) */}
                  {doses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDose(idx)}
                      className="p-1 rounded-lg text-stone-300 hover:text-rose-500 transition-colors"
                      title="Bu dozu kaldır"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Button to add custom extra dose */}
            <button
              type="button"
              onClick={() => handleAddDose('evening', '19:00', `Doz ${doses.length + 1}`)}
              className="w-full py-2 rounded-xl bg-white/80 hover:bg-white border border-dashed border-rose-300 text-rose-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Saat / Doz Ekle</span>
            </button>
          </div>

          {/* Stock / Blister Tracking */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
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
                  Kutuda Kalan Tablet
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
                className="p-3 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
                title="İlacı Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-colors cursor-pointer"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-pink-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{medication ? 'Güncelle' : 'Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
