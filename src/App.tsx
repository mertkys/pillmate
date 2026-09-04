import { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  Heart, 
  Smartphone, 
  HelpCircle,
  Sun,
  Sunset,
  Moon,
  CloudSun
} from 'lucide-react';
import type { Medication, MedicationLog, DayPeriod } from './types/medication';
import { storageService } from './services/storage';
import { soundService } from './services/sound';

import { Header } from './components/Header';
import { TodayProgress } from './components/TodayProgress';
import { LoveNoteBanner } from './components/LoveNoteBanner';
import { MedicationCard } from './components/MedicationCard';
import { BlisterModal } from './components/BlisterModal';
import { AddEditMedicationModal } from './components/AddEditMedicationModal';
import { LoveNotesModal } from './components/LoveNotesModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { CelebrationModal } from './components/CelebrationModal';

export function App() {
  // Application Data State
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [allLogs, setAllLogs] = useState<MedicationLog[]>([]);
  const [loveNotes, setLoveNotes] = useState(storageService.getLoveNotes());
  const [userName, setUserName] = useState(storageService.getUserName());

  // Filter State
  const [activeTab, setActiveTab] = useState<'all' | DayPeriod>('all');

  // Modal States
  const [selectedMedForBlister, setSelectedMedForBlister] = useState<Medication | null>(null);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoveNotesModalOpen, setIsLoveNotesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);

  // Load Initial Data
  const refreshData = () => {
    const meds = storageService.getMedications();
    const todayLogs = storageService.getTodayLogs();
    const totalLogs = storageService.getLogs();
    const notes = storageService.getLoveNotes();
    const name = storageService.getUserName();

    setMedications(meds);
    setLogs(todayLogs);
    setAllLogs(totalLogs);
    setLoveNotes(notes);
    setUserName(name);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Medication Handlers
  const handleMarkTaken = (id: string) => {
    soundService.playPop();
    storageService.markAsTaken(id);
    
    // Update local state
    const updatedTodayLogs = storageService.getTodayLogs();
    const updatedMeds = storageService.getMedications();
    setLogs(updatedTodayLogs);
    setMedications(updatedMeds);
    setAllLogs(storageService.getLogs());

    // Check if ALL active medications are now taken
    const activeMeds = updatedMeds.filter(m => m.active);
    const takenCount = activeMeds.filter(m => 
      updatedTodayLogs.some(l => l.medicationId === m.id && l.status === 'taken')
    ).length;

    if (activeMeds.length > 0 && takenCount === activeMeds.length) {
      setTimeout(() => {
        setIsCelebrationModalOpen(true);
      }, 300);
    }
  };

  const handleUndo = (id: string) => {
    soundService.playUndo();
    storageService.undoTaken(id);
    refreshData();
  };

  const handleSnooze = (id: string, minutes: number) => {
    storageService.snoozeMedication(id, minutes);
    setLogs(storageService.getTodayLogs());
  };

  const handleSaveMedication = (medData: Omit<Medication, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      const existing = medications.find(m => m.id === id);
      if (existing) {
        storageService.updateMedication({ ...existing, ...medData });
      }
    } else {
      storageService.addMedication(medData);
    }
    refreshData();
    setEditingMedication(null);
  };

  const handleDeleteMedication = (id: string) => {
    storageService.deleteMedication(id);
    refreshData();
    setEditingMedication(null);
  };

  const handleRefillStock = (id: string, newTotal: number) => {
    storageService.refillStock(id, newTotal);
    refreshData();
    if (selectedMedForBlister && selectedMedForBlister.id === id) {
      setSelectedMedForBlister(prev => prev ? { ...prev, totalStock: newTotal, remainingStock: newTotal } : null);
    }
  };

  const handleAddLoveNote = (text: string, sender: string) => {
    storageService.addLoveNote(text, sender);
    setLoveNotes(storageService.getLoveNotes());
  };

  const handleDeleteLoveNote = (id: string) => {
    storageService.deleteLoveNote(id);
    setLoveNotes(storageService.getLoveNotes());
  };

  const handleUpdateUserName = (name: string) => {
    storageService.setUserName(name);
    setUserName(name);
  };

  // Filtered medications
  const filteredMeds = medications.filter(med => {
    if (!med.active) return false;
    if (activeTab === 'all') return true;
    return med.period === activeTab;
  });

  const activeMeds = medications.filter(m => m.active);
  const completedTodayCount = activeMeds.filter(m =>
    logs.some(l => l.medicationId === m.id && l.status === 'taken')
  ).length;

  return (
    <div className="min-h-screen bg-[#faf5f5] flex justify-center selection:bg-pink-200">
      {/* Container - Sleek Mobile App Viewport */}
      <div className="w-full max-w-md min-h-screen bg-white/70 backdrop-blur-md shadow-2xl flex flex-col border-x border-rose-100/60 relative">
        
        {/* Header */}
        <Header
          userName={userName}
          onOpenAddModal={() => {
            setEditingMedication(null);
            setIsAddModalOpen(true);
          }}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          onOpenLoveNotesModal={() => setIsLoveNotesModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        {/* Love Note Banner */}
        <LoveNoteBanner
          notes={loveNotes}
          onOpenModal={() => setIsLoveNotesModalOpen(true)}
        />

        {/* Today's Progress */}
        <TodayProgress
          total={activeMeds.length}
          completed={completedTodayCount}
          streakDays={completedTodayCount > 0 ? 3 : 2}
        />

        {/* Filter Tabs */}
        <div className="px-5 mb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-rose-50/70 border border-rose-100/60 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Tümü', icon: Sparkles },
              { id: 'morning', label: 'Sabah', icon: Sun },
              { id: 'noon', label: 'Öğle', icon: CloudSun },
              { id: 'evening', label: 'Akşam', icon: Sunset },
              { id: 'night', label: 'Gece', icon: Moon },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'all' | DayPeriod)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-rose-500 shadow-xs border border-rose-100'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-500' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Medication Cards List */}
        <main className="flex-1 px-5 pb-24 space-y-3.5 overflow-y-auto">
          {filteredMeds.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white/60 border border-rose-100/60 shadow-xs">
              <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden ring-2 ring-pink-100 bg-pink-50 p-2">
                <img
                  src="/assets/mascot.jpg"
                  alt="Mascot"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-1">
                Bu vakitte ilaç görünmüyor 🌸
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4 leading-relaxed">
                İlaçlarını ekleyerek takip etmeye hemen başlayabilirsin.
              </p>
              <button
                onClick={() => {
                  setEditingMedication(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-pink-200 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>İlk İlacını Ekle</span>
              </button>
            </div>
          ) : (
            filteredMeds.map(med => {
              const medLog = logs.find(l => l.medicationId === med.id);
              return (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  log={medLog}
                  onMarkTaken={handleMarkTaken}
                  onUndo={handleUndo}
                  onSnooze={handleSnooze}
                  onOpenBlister={(m) => setSelectedMedForBlister(m)}
                  onEdit={(m) => {
                    setEditingMedication(m);
                    setIsAddModalOpen(true);
                  }}
                />
              );
            })
          )}

          {/* Reassurance Banner at the bottom */}
          <div className="p-3 rounded-2xl bg-white/70 border border-rose-100 text-center text-xs text-stone-500">
            <div className="flex items-center justify-center gap-1 font-semibold text-rose-500 mb-0.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>"Acaba içtim mi?" diye şüphede misin?</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Kart üzerindeki <strong>"Kutu Görünümü"</strong> butonuna basıp masandaki tabletle eşleştirebilirsin.
            </p>
          </div>
        </main>

        {/* Bottom Floating Bar */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/90 backdrop-blur-md border-t border-rose-100 flex items-center justify-between text-xs text-stone-500 z-10">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="font-semibold text-stone-700">PillMate</span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-rose-500 font-medium">Aşkla Hazırlandı</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-medium text-[11px]"
            >
              <Smartphone className="w-3 h-3" />
              <span>APK & Yedek</span>
            </button>
            <button
              onClick={() => {
                setEditingMedication(null);
                setIsAddModalOpen(true);
              }}
              className="p-2 rounded-xl bg-rose-500 text-white shadow-xs hover:bg-rose-600 transition-colors"
              title="Yeni İlaç Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </footer>

        {/* Modals */}
        <BlisterModal
          medication={selectedMedForBlister}
          onClose={() => setSelectedMedForBlister(null)}
          onRefill={handleRefillStock}
        />

        <AddEditMedicationModal
          isOpen={isAddModalOpen}
          medication={editingMedication}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingMedication(null);
          }}
          onSave={handleSaveMedication}
          onDelete={handleDeleteMedication}
        />

        <LoveNotesModal
          isOpen={isLoveNotesModalOpen}
          notes={loveNotes}
          onClose={() => setIsLoveNotesModalOpen(false)}
          onAddNote={handleAddLoveNote}
          onDeleteNote={handleDeleteLoveNote}
        />

        <HistoryModal
          isOpen={isHistoryModalOpen}
          medications={medications}
          logs={allLogs}
          onClose={() => setIsHistoryModalOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          userName={userName}
          onClose={() => setIsSettingsModalOpen(false)}
          onUpdateUserName={handleUpdateUserName}
          onDataImported={refreshData}
        />

        <CelebrationModal
          isOpen={isCelebrationModalOpen}
          onClose={() => setIsCelebrationModalOpen(false)}
        />

      </div>
    </div>
  );
}

export default App;
