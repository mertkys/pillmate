import React, { useState } from 'react';
import { X, User, Download, Upload, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { storageService } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onUpdateUserName: (name: string) => void;
  onDataImported: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  userName,
  onClose,
  onUpdateUserName,
  onDataImported,
}) => {
  const [nameInput, setNameInput] = useState(userName);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUserName(nameInput.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PillMate_Yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && storageService.importData(content)) {
        alert('Veriler başarıyla içe aktarıldı! 🌸');
        onDataImported();
        onClose();
      } else {
        alert('Yedek dosyası geçersiz veya bozuk.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-50 text-rose-500">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800">
                Ayarlar & Profil
              </h2>
              <p className="text-[11px] text-stone-400 font-medium">
                Kişiselleştirme ve veri yedekleme
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

        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 text-xs">
          {/* User Name Setting */}
          <form onSubmit={handleNameSave} className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200 space-y-2">
            <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px]">
              Hitap / İsminiz
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Örn: Prensesim, Aşkım, Zeynep"
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{copied ? 'Kaydedildi' : 'Kaydet'}</span>
              </button>
            </div>
          </form>

          {/* Android Mobile Info Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>Android APK Desteği</span>
            </div>
            <p className="text-[11px] text-indigo-800 leading-relaxed">
              Bu uygulama, doğrudan web tarayıcısından ana ekrana eklenebileceği gibi (PWA), 
              <strong> Capacitor</strong> altyapısı sayesinde tek komutla Android Studio APK'sına dönüştürülmeye hazırdır.
            </p>
          </div>

          {/* Privacy & Local-first explanation */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">
                Tamamen Yerel ve Gizli (Local-First)
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                İlaç verileriniz hiçbir harici sunucuya gitmez. Tamamen telefonunuzun kendi hafızasında güvenle saklanır.
              </p>
            </div>
          </div>

          {/* Backup / Restore Section */}
          <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200 space-y-2.5">
            <span className="block font-bold text-stone-700 uppercase tracking-wider text-[11px]">
              Veri Yedekleme & Geri Yükleme
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-rose-500" />
                <span>Yedeği İndir</span>
              </button>

              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold transition-colors cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                <span>Yedek Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
