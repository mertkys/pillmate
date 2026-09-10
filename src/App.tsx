import { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  Heart, 
  HelpCircle,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  Settings
} from 'lucide-react';
import type { 
  Medication, 
  MedicationLog, 
  DayPeriod, 
  DoctorAppointment, 
  BloodPressureLog, 
  AvatarOption 
} from './types/medication';
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
import { BloodPressureView } from './components/BloodPressureView';
import { DoctorAppointmentsView } from './components/DoctorAppointmentsView';
import { AvatarSelectorModal } from './components/AvatarSelectorModal';
import { Navigation, type NavTab } from './components/Navigation';

export function App() {
  // Navigation State
  const [navTab, setNavTab] = useState<NavTab>('medications');

  // Application Data State
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [allLogs, setAllLogs] = useState<MedicationLog[]>([]);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [bpLogs, setBpLogs] = useState<BloodPressureLog[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(storageService.getSelectedAvatar());
  const [loveNotes, setLoveNotes] = useState(storageService.getLoveNotes());
  const [userName, setUserName] = useState(storageService.getUserName());

  // Filter State for Medication view
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | DayPeriod>('all');

  // Modal States
  const [selectedMedForBlister, setSelectedMedForBlister] = useState<Medication | null>(null);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoveNotesModalOpen, setIsLoveNotesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Load All Data
  const refreshData = () => {
    setMedications(storageService.getMedications());
    setLogs(storageService.getTodayLogs());
    setAllLogs(storageService.getLogs());
    setAppointments(storageService.getAppointments());
    setBpLogs(storageService.getBloodPressureLogs());
    setSelectedAvatar(storageService.getSelectedAvatar());
    setLoveNotes(storageService.getLoveNotes());
    setUserName(storageService.getUserName());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Multi-Dose Taking Handler (Supports Smart Midnight Attribution!)
  const handleMarkDoseTaken = (medicationId: string, doseId: string) => {
    soundService.playPop();
    storageService.markDoseAsTaken(medicationId, doseId);

    const updatedTodayLogs = storageService.getTodayLogs();
    const updatedMeds = storageService.getMedications();
    setLogs(updatedTodayLogs);
    setMedications(updatedMeds);
    setAllLogs(storageService.getLogs());

    // Check if ALL active medication doses for today are now completed
    const activeMeds = updatedMeds.filter(m => m.active);
    const totalDosesCount = activeMeds.reduce((acc, m) => acc + (m.doses?.length || 1), 0);
    const takenDosesCount = updatedTodayLogs.filter(l => l.status === 'taken').length;

    if (totalDosesCount > 0 && takenDosesCount >= totalDosesCount) {
      setTimeout(() => {
        setIsCelebrationModalOpen(true);
      }, 300);
    }
  };

  const handleUndoDose = (medicationId: string, doseId: string) => {
    soundService.playUndo();
    storageService.undoDoseTaken(medicationId, doseId);
    refreshData();
  };

  const handleSnoozeDose = (medicationId: string, doseId: string, minutes: number) => {
    storageService.snoozeDose(medicationId, doseId, minutes);
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

  // Doctor Appointment Handlers
  const handleAddAppointment = (apt: Omit<DoctorAppointment, 'id' | 'createdAt'>) => {
    storageService.addAppointment(apt);
    setAppointments(storageService.getAppointments());
  };

  const handleToggleAppointmentComplete = (apt: DoctorAppointment) => {
    storageService.updateAppointment({ ...apt, completed: !apt.completed });
    setAppointments(storageService.getAppointments());
  };

  const handleDeleteAppointment = (id: string) => {
    storageService.deleteAppointment(id);
    setAppointments(storageService.getAppointments());
  };

  // Blood Pressure Handlers
  const handleAddBPLog = (log: Omit<BloodPressureLog, 'id' | 'createdAt'>) => {
    soundService.playPop();
    storageService.addBloodPressureLog(log);
    setBpLogs(storageService.getBloodPressureLogs());
  };

  const handleDeleteBPLog = (id: string) => {
    storageService.deleteBloodPressureLog(id);
    setBpLogs(storageService.getBloodPressureLogs());
  };

  // Avatar Selection
  const handleSelectAvatar = (avatar: AvatarOption) => {
    storageService.setSelectedAvatar(avatar.id);
    setSelectedAvatar(avatar);
    soundService.playPop();
  };

  // Love Notes
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
  const activeMeds = medications.filter(m => m.active);
  const filteredMeds = activeMeds.filter(med => {
    if (activeFilterTab === 'all') return true;
    return med.doses?.some(d => d.period === activeFilterTab) || med.period === activeFilterTab;
  });

  const totalDosesToday = activeMeds.reduce((acc, m) => acc + (m.doses?.length || 1), 0);
  const completedDosesToday = logs.filter(l => l.status === 'taken').length;
  const pendingAppointmentsCount = appointments.filter(a => !a.completed).length;

  return (
    <div className="min-h-screen bg-[#faf5f5] flex justify-center selection:bg-pink-200">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-white/70 backdrop-blur-md shadow-2xl flex flex-col border-x border-rose-100/60 relative pb-16">
        
        {/* Header */}
        <Header
          userName={userName}
          avatarImage={selectedAvatar.image}
          onOpenAddModal={() => {
            setEditingMedication(null);
            setIsAddModalOpen(true);
          }}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          onOpenLoveNotesModal={() => setIsLoveNotesModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenAvatarSelector={() => setIsAvatarModalOpen(true)}
        />

        {/* Content Views based on Navigation Tab */}
        <main className="flex-1 px-5 pt-1 overflow-y-auto">
          {navTab === 'medications' && (
            <div className="space-y-3.5 pb-20">
              {/* Love Note Banner */}
              <LoveNoteBanner
                notes={loveNotes}
                onOpenModal={() => setIsLoveNotesModalOpen(true)}
              />

              {/* Today's Progress */}
              <TodayProgress
                total={totalDosesToday}
                completed={completedDosesToday}
                streakDays={completedDosesToday > 0 ? 3 : 2}
              />

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-rose-50/70 border border-rose-100/60 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Tümü', icon: Sparkles },
                  { id: 'morning', label: 'Sabah', icon: Sun },
                  { id: 'noon', label: 'Öğle', icon: CloudSun },
                  { id: 'evening', label: 'Akşam', icon: Sunset },
                  { id: 'night', label: 'Gece', icon: Moon },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeFilterTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilterTab(tab.id as 'all' | DayPeriod)}
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

              {/* Medication Cards List */}
              {filteredMeds.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-3xl bg-white/60 border border-rose-100/60 shadow-xs">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden ring-2 ring-pink-100 bg-pink-50 p-1">
                    <img
                      src={selectedAvatar.image}
                      alt="Mascot"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-stone-800 mb-1">
                    Bu vakitte ilaç görünmüyor 🌸
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mb-3 leading-relaxed">
                    İlaçlarını ekleyerek takip etmeye hemen başlayabilirsin.
                  </p>
                  <button
                    onClick={() => {
                      setEditingMedication(null);
                      setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-pink-200 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>İlk İlacını Ekle</span>
                  </button>
                </div>
              ) : (
                filteredMeds.map(med => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    todayLogs={logs}
                    onMarkDoseTaken={handleMarkDoseTaken}
                    onUndoDose={handleUndoDose}
                    onSnoozeDose={handleSnoozeDose}
                    onOpenBlister={(m) => setSelectedMedForBlister(m)}
                    onEdit={(m) => {
                      setEditingMedication(m);
                      setIsAddModalOpen(true);
                    }}
                  />
                ))
              )}

              {/* Help & Reassurance Box */}
              <div className="p-3 rounded-2xl bg-white/70 border border-rose-100 text-center text-xs text-stone-500">
                <div className="flex items-center justify-center gap-1 font-semibold text-rose-500 mb-0.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>"Acaba içtim mi?" diye şüphede misin?</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Kart üzerindeki <strong>"Kutu Görünümü"</strong> butonuna basıp masandaki tabletle karşılaştırabilirsin.
                </p>
              </div>
            </div>
          )}

          {navTab === 'blood_pressure' && (
            <BloodPressureView
              logs={bpLogs}
              onAddLog={handleAddBPLog}
              onDeleteLog={handleDeleteBPLog}
            />
          )}

          {navTab === 'appointments' && (
            <DoctorAppointmentsView
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              onToggleComplete={handleToggleAppointmentComplete}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}

          {navTab === 'notes' && (
            <div className="space-y-4 pb-20">
              {/* Profile Card with Avatar */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50/60 to-purple-50/40 border border-pink-100 flex items-center gap-4">
                <div 
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="w-16 h-16 rounded-2xl overflow-hidden ring-3 ring-pink-300 shadow-md bg-white cursor-pointer active:scale-95 transition-transform shrink-0"
                  title="Avatarı Değiştir"
                >
                  <img src={selectedAvatar.image} alt={selectedAvatar.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-stone-800 flex items-center gap-1.5">
                    <span>{userName}</span>
                    <span className="text-rose-500 text-sm">🌸</span>
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold">
                    {selectedAvatar.name}
                  </p>
                  <button
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="mt-1 text-[11px] text-stone-500 hover:text-rose-600 font-bold underline cursor-pointer"
                  >
                    Avatarı Değiştir
                  </button>
                </div>
              </div>

              {/* Quick Settings Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs hover:border-pink-200 text-left flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-pink-50 text-rose-500">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Ayarlar</span>
                    <span className="text-[10px] text-stone-400">Yedek & Profil</span>
                  </div>
                </button>

                <button
                  onClick={() => setIsLoveNotesModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs hover:border-pink-200 text-left flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-pink-50 text-rose-500">
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Sevgi Notları</span>
                    <span className="text-[10px] text-stone-400">{loveNotes.length} Not Kayıtlı</span>
                  </div>
                </button>
              </div>

              {/* Love Notes List Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    Sevgilimden Bütün Notlar
                  </span>
                  <button
                    onClick={() => setIsLoveNotesModalOpen(true)}
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    Yeni Yaz
                  </button>
                </div>

                {loveNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-2xl bg-white border border-rose-100/80 shadow-2xs space-y-1"
                  >
                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      "{note.text}"
                    </p>
                    <span className="text-[10px] font-bold text-rose-500 block text-right">
                      — {note.sender}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Persistent Bottom Navigation Bar */}
        <Navigation
          activeTab={navTab}
          onTabChange={setNavTab}
          pendingAppointmentsCount={pendingAppointmentsCount}
        />

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

        <AvatarSelectorModal
          isOpen={isAvatarModalOpen}
          selectedAvatar={selectedAvatar}
          onClose={() => setIsAvatarModalOpen(false)}
          onSelectAvatar={handleSelectAvatar}
        />

      </div>
    </div>
  );
}

export default App;
