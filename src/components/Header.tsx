import React from 'react';
import { Heart, Calendar, Plus, Sparkles, Bell } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onOpenAddModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenLoveNotesModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  onOpenAddModal,
  onOpenHistoryModal,
  onOpenLoveNotesModal,
  onOpenSettingsModal,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Günaydın';
    if (hour >= 12 && hour < 18) return 'Tünaydın';
    if (hour >= 18 && hour < 23) return 'İyi Akşamlar';
    return 'İyi Geceler';
  };

  const getFormattedDate = () => {
    const date = new Date();
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    }).format(date);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('PillMate 🌸 Bildirimler Aktif!', {
          body: 'İlaç saatlerin geldiğinde sana tatlı hatırlatmalar göndereceğim!',
          icon: '/assets/mascot.jpg',
        });
      }
    }
  };

  return (
    <header className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between">
        {/* User Greeting & Mascot */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenSettingsModal}
            className="relative group cursor-pointer active:scale-95 transition-transform"
            title="Ayarlar & Profil"
          >
            <div className="w-13 h-13 rounded-2xl overflow-hidden ring-3 ring-pink-200 shadow-md shadow-pink-100 bg-pink-50 flex items-center justify-center">
              <img
                src="/assets/mascot.jpg"
                alt="PillMate Maskotu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
            </span>
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}</span>
            </div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight flex items-center gap-1.5">
              <span>{userName}</span>
              <span className="text-rose-400 text-lg">🌸</span>
            </h1>
            <p className="text-xs text-stone-400 font-medium capitalize mt-0.5">
              {getFormattedDate()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Notification Button */}
          {'Notification' in window && Notification.permission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="p-2.5 rounded-xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shadow-sm shadow-rose-100/50"
              title="Bildirimleri Aç"
            >
              <Bell className="w-4 h-4 animate-bounce" />
            </button>
          )}

          {/* History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="p-2.5 rounded-xl bg-white border border-rose-100 text-stone-600 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shadow-sm shadow-rose-100/50"
            title="Geçmiş & Takvim"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Love Notes Button */}
          <button
            onClick={onOpenLoveNotesModal}
            className="p-2.5 rounded-xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shadow-sm shadow-rose-100/50"
            title="Sevgilimden Notlar"
          >
            <Heart className="w-4 h-4 fill-rose-500" />
          </button>

          {/* Add Medication Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-xs shadow-md shadow-pink-200 hover:from-rose-500 hover:to-pink-600 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">İlaç Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
