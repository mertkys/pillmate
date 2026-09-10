import React from 'react';
import { Calendar, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  userName: string;
  avatarImage: string;
  onOpenAddModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenAvatarSelector: () => void;
  onOpenLoveNotesModal?: () => void;
  onOpenSettingsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  avatarImage,
  onOpenAddModal,
  onOpenHistoryModal,
  onOpenAvatarSelector,
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

  return (
    <header className="px-5 pt-6 pb-3">
      <div className="flex items-center justify-between">
        {/* User Greeting & Mascot Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAvatarSelector}
            className="relative group cursor-pointer active:scale-95 transition-transform"
            title="Sevimli Avatarını Değiştir 🌸"
          >
            <div className="w-13 h-13 rounded-2xl overflow-hidden ring-3 ring-pink-200 shadow-md shadow-pink-100 bg-pink-50 flex items-center justify-center">
              <img
                src={avatarImage}
                alt="PillMate Maskotu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white items-center justify-center">
                <span className="text-[7px] text-white">✨</span>
              </span>
            </span>
          </button>

          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}</span>
            </div>
            <h1 className="text-lg font-extrabold text-stone-800 tracking-tight flex items-center gap-1">
              <span>{userName}</span>
              <span className="text-rose-400 text-base">🌸</span>
            </h1>
            <p className="text-[11px] text-stone-400 font-medium capitalize mt-0.5">
              {getFormattedDate()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Change Avatar Button */}
          <button
            onClick={onOpenAvatarSelector}
            className="p-2 rounded-xl bg-white border border-rose-100 text-stone-500 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shadow-xs cursor-pointer"
            title="Avatar Değiştir"
          >
            <ImageIcon className="w-4 h-4 text-pink-400" />
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="p-2 rounded-xl bg-white border border-rose-100 text-stone-500 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shadow-xs cursor-pointer"
            title="Geçmiş & İlaç Takvimi"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Add Medication Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold text-xs shadow-md shadow-pink-200 hover:from-rose-500 hover:to-pink-600 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>İlaç Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
