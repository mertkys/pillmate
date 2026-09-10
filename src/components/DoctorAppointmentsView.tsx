import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Stethoscope, CheckCircle2, Circle, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import type { DoctorAppointment } from '../types/medication';

interface DoctorAppointmentsViewProps {
  appointments: DoctorAppointment[];
  onAddAppointment: (apt: Omit<DoctorAppointment, 'id' | 'createdAt'>) => void;
  onToggleComplete: (apt: DoctorAppointment) => void;
  onDeleteAppointment: (id: string) => void;
}

export const DoctorAppointmentsView: React.FC<DoctorAppointmentsViewProps> = ({
  appointments,
  onAddAppointment,
  onToggleComplete,
  onDeleteAppointment,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('Dahiliye');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  // Calculate days remaining
  const getCountdownBadge = (aptDate: string, completed: boolean) => {
    if (completed) {
      return {
        text: 'Tamamlandı ✅',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(aptDate);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: 'Geçti',
        className: 'bg-stone-100 text-stone-500 border-stone-200',
      };
    }
    if (diffDays === 0) {
      return {
        text: 'Bugün! ⏰',
        className: 'bg-rose-500 text-white border-rose-500 animate-pulse',
      };
    }
    if (diffDays === 1) {
      return {
        text: 'Yarın!',
        className: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }
    return {
      text: `${diffDays} Gün Kaldı`,
      className: 'bg-pink-50 text-rose-600 border-pink-200',
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !date) return;

    onAddAppointment({
      doctorName: doctorName.trim(),
      specialty: specialty.trim(),
      hospital: hospital.trim() || 'Klinik / Hastane',
      date,
      time,
      notes: notes.trim() || undefined,
      completed: false,
    });

    setDoctorName('');
    setHospital('');
    setDate('');
    setNotes('');
    setShowAddModal(false);
  };

  const commonSpecialties = [
    'Dahiliye',
    'Kardiyoloji',
    'Endokrinoloji',
    'Göz Hastalıkları',
    'Kadın Doğum',
    'Nöroloji',
    'Kulak Burun Boğaz',
    'Genel Kontrol',
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50/60 to-rose-50/50 border border-purple-100 shadow-sm shadow-purple-100/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-white text-purple-600 shadow-xs border border-purple-100">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
                Sağlık Takvimi
              </span>
              <h2 className="text-base font-bold text-stone-800">
                Doktor Randevuların
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-purple-200 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Randevu Ekle</span>
          </button>
        </div>

        <p className="text-xs text-stone-500 mt-2.5 leading-relaxed">
          Tüm doktor randevularını, hastane detaylarını ve doktora soracağın soruları buradan kolayca takip edebilirsin 🌸
        </p>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-sm font-bold text-purple-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Yeni Doktor Randevusu Ekle
              </span>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Kapat
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Doktorun Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Dr. Selin Yılmaz"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Uzmanlık Alanı
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {commonSpecialties.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSpecialty(s)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        specialty === s
                          ? 'bg-purple-100 border-purple-300 text-purple-800'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Veya kendin yaz..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Hastane / Klinik
                </label>
                <input
                  type="text"
                  placeholder="Örn: Memorial Şişli, Etfal Hastanesi"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Randevu Tarihi *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Randevu Saati
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Doktora Sorulacaklar / Randevu Notları
                </label>
                <textarea
                  rows={2}
                  placeholder="Örn: Aç karnına kan verilecek, tansiyon tablosu gösterilecek..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-200 hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer"
                >
                  Randevuyu Kaydet 📅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            Kayıtlı Randevular ({appointments.length})
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 rounded-3xl bg-white border border-rose-100">
            Henüz doktor randevusu eklenmedi.
          </div>
        ) : (
          appointments.map((apt) => {
            const badge = getCountdownBadge(apt.date, apt.completed);
            return (
              <div
                key={apt.id}
                className={`p-4 rounded-3xl border transition-all duration-200 shadow-2xs ${
                  apt.completed
                    ? 'bg-stone-50/60 border-stone-200/70 opacity-75'
                    : 'bg-white border-purple-100 hover:border-purple-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(apt)}
                      className="cursor-pointer text-purple-600 hover:text-purple-700 transition-transform active:scale-90"
                      title={apt.completed ? 'Tamamlandı işaretini kaldır' : 'Randevuya gidildi olarak işaretle'}
                    >
                      {apt.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 hover:text-purple-500" />
                      )}
                    </button>
                    <div>
                      <h3 className={`text-sm font-bold ${apt.completed ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                        {apt.doctorName}
                      </h3>
                      <span className="text-[11px] font-semibold text-purple-600">
                        {apt.specialty}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}>
                    {badge.text}
                  </span>
                </div>

                {/* Details */}
                <div className="pl-7 space-y-1.5 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{apt.hospital}</span>
                  </div>

                  <div className="flex items-center gap-3 font-medium text-stone-700">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      {new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' }).format(new Date(apt.date))}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      {apt.time}
                    </span>
                  </div>

                  {apt.notes && (
                    <div className="mt-2 p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-900 leading-relaxed flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[10px] uppercase text-purple-700 font-bold">
                          Doktora Notlar:
                        </strong>
                        {apt.notes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-2 mt-2 border-t border-stone-100/80">
                  <button
                    onClick={() => onDeleteAppointment(apt.id)}
                    className="text-stone-300 hover:text-rose-500 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
