import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { AVATAR_OPTIONS } from '../services/storage';
import type { AvatarOption } from '../types/medication';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  selectedAvatar: AvatarOption;
  onClose: () => void;
  onSelectAvatar: (avatar: AvatarOption) => void;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  selectedAvatar,
  onClose,
  onSelectAvatar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-50 text-rose-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-800">
                Sevimli Avatarını Seç 🌸
              </h2>
              <p className="text-[11px] text-stone-400 font-medium">
                Seni temsil edecek tatlı dostunu belirle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatars Grid */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {AVATAR_OPTIONS.map((avatar) => {
            const isSelected = avatar.id === selectedAvatar.id;
            return (
              <div
                key={avatar.id}
                onClick={() => {
                  onSelectAvatar(avatar);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/70 shadow-sm ring-2 ring-pink-200'
                    : 'border-stone-100 bg-white hover:border-pink-200 hover:bg-stone-50/60'
                }`}
              >
                {/* Avatar Image */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-pink-100 bg-pink-50 shrink-0 shadow-xs">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                    <span>{avatar.name}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                        Aktif
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    {avatar.description}
                  </p>
                </div>

                {/* Check icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'border-2 border-stone-200 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
