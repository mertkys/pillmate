import React, { useState } from 'react';
import { X, Heart, Plus, Trash2, Sparkles } from 'lucide-react';
import type { LoveNote } from '../types/medication';

interface LoveNotesModalProps {
  isOpen: boolean;
  notes: LoveNote[];
  onClose: () => void;
  onAddNote: (text: string, sender: string) => void;
  onDeleteNote: (id: string) => void;
}

export const LoveNotesModal: React.FC<LoveNotesModalProps> = ({
  isOpen,
  notes,
  onClose,
  onAddNote,
  onDeleteNote,
}) => {
  const [newText, setNewText] = useState('');
  const [senderName, setSenderName] = useState('Sevgilin ❤️');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddNote(newText.trim(), senderName.trim() || 'Sevgilin ❤️');
    setNewText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-50 text-rose-500">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800">
                Sevgilimden Notlar
              </h2>
              <p className="text-[11px] text-stone-400 font-medium">
                Sana özel motivasyon ve sevgi sözleri
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

        {/* Add New Note Section */}
        <form onSubmit={handleAddSubmit} className="my-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Yeni Sevgi Notu Bırak</span>
          </div>
          <textarea
            required
            rows={2}
            placeholder="Ona gününü güzelleştirecek tatlı bir mesaj yaz..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
          />
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="İmza (Örn: Sevgilin ❤️)"
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 focus:outline-none w-36"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Notu Ekle</span>
            </button>
          </div>
        </form>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              Henüz not bulunmuyor. Yukarıdan ilk notu yazabilirsiniz!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-start justify-between gap-2 group hover:border-pink-200 hover:bg-pink-50/30 transition-all"
              >
                <div className="flex-1">
                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{note.text}"
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold text-rose-500">
                    — {note.sender}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="text-stone-300 hover:text-rose-500 p-1 rounded transition-colors"
                  title="Notu Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
