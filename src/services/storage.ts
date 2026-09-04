import type { Medication, MedicationLog, LoveNote } from '../types/medication';

const MEDS_KEY = 'pillmate_medications_v1';
const LOGS_KEY = 'pillmate_logs_v1';
const LOVE_NOTES_KEY = 'pillmate_love_notes_v1';
const USERNAME_KEY = 'pillmate_user_name_v1';

const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Demir İlacı (Ferrum)',
    dosage: '1 Kapsül',
    time: '09:00',
    period: 'morning',
    foodStatus: 'before_food',
    color: 'rose',
    icon: 'capsule',
    totalStock: 30,
    remainingStock: 22,
    notes: 'Aç karnına, bol su ile içilmeli 💧',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    name: 'D3 Vitamini Damla',
    dosage: '5 Damla',
    time: '13:30',
    period: 'noon',
    foodStatus: 'after_food',
    color: 'amber',
    icon: 'droplet',
    totalStock: 50,
    remainingStock: 41,
    notes: 'Öğle yemeğinden hemen sonra ekmeğe veya suya damlat',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-3',
    name: 'Omega 3 / Magnezyum',
    dosage: '1 Tablet',
    time: '21:30',
    period: 'night',
    foodStatus: 'after_food',
    color: 'violet',
    icon: 'pill',
    totalStock: 30,
    remainingStock: 19,
    notes: 'Akşam rahat uyumak için tok karnına al',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_LOVE_NOTES: LoveNote[] = [
  {
    id: 'note-1',
    text: 'Bugün de kendine çok iyi bakmayı unutma birtanem, sağlığın her şeyden önemli! 🌸',
    sender: 'Sevgilin ❤️',
    emoji: '💖',
  },
  {
    id: 'note-2',
    text: 'İlaçlarını aksatmadığın için seninle gurur duyuyorum, suyunu da içmeyi unutma prensesim! 💧',
    sender: 'Sevgilin ❤️',
    emoji: '🥰',
  },
  {
    id: 'note-3',
    text: 'Günün çok güzel geçsin, seni çok seviyorum! İlaç saatin geldiğinde hemen al lütfen 🕊️',
    sender: 'Sevgilin ❤️',
    emoji: '✨',
  }
];

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const storageService = {
  // Medications
  getMedications(): Medication[] {
    const data = localStorage.getItem(MEDS_KEY);
    if (!data) {
      this.saveMedications(DEFAULT_MEDICATIONS);
      return DEFAULT_MEDICATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_MEDICATIONS;
    }
  },

  saveMedications(meds: Medication[]): void {
    localStorage.setItem(MEDS_KEY, JSON.stringify(meds));
  },

  addMedication(med: Omit<Medication, 'id' | 'createdAt'>): Medication {
    const meds = this.getMedications();
    const newMed: Medication = {
      ...med,
      id: 'med-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    meds.push(newMed);
    this.saveMedications(meds);
    return newMed;
  },

  updateMedication(updatedMed: Medication): void {
    const meds = this.getMedications();
    const idx = meds.findIndex(m => m.id === updatedMed.id);
    if (idx !== -1) {
      meds[idx] = updatedMed;
      this.saveMedications(meds);
    }
  },

  deleteMedication(id: string): void {
    const meds = this.getMedications().filter(m => m.id !== id);
    this.saveMedications(meds);
  },

  refillStock(id: string, newTotal: number): void {
    const meds = this.getMedications();
    const med = meds.find(m => m.id === id);
    if (med) {
      med.remainingStock = newTotal;
      med.totalStock = newTotal;
      this.saveMedications(meds);
    }
  },

  // Daily Logs
  getLogs(): MedicationLog[] {
    const data = localStorage.getItem(LOGS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveLogs(logs: MedicationLog[]): void {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  getTodayLogs(): MedicationLog[] {
    const today = getTodayDateString();
    return this.getLogs().filter(log => log.date === today);
  },

  // Mark medication as taken (and decrement stock)
  markAsTaken(medicationId: string): MedicationLog {
    const today = getTodayDateString();
    const logs = this.getLogs();
    const meds = this.getMedications();

    // Check if already logged for today
    const existingIndex = logs.findIndex(l => l.date === today && l.medicationId === medicationId);
    const nowIso = new Date().toISOString();

    let updatedLog: MedicationLog;
    if (existingIndex !== -1) {
      logs[existingIndex].status = 'taken';
      logs[existingIndex].takenAt = nowIso;
      logs[existingIndex].snoozedUntil = null;
      updatedLog = logs[existingIndex];
    } else {
      updatedLog = {
        id: 'log-' + Date.now(),
        medicationId,
        date: today,
        status: 'taken',
        takenAt: nowIso,
        snoozedUntil: null,
      };
      logs.push(updatedLog);
    }

    // Decrement stock by 1
    const med = meds.find(m => m.id === medicationId);
    if (med && med.remainingStock > 0) {
      med.remainingStock = Math.max(0, med.remainingStock - 1);
      this.saveMedications(meds);
    }

    this.saveLogs(logs);
    return updatedLog;
  },

  // Undo taken status (and restore stock)
  undoTaken(medicationId: string): void {
    const today = getTodayDateString();
    const logs = this.getLogs();
    const meds = this.getMedications();

    const existingIndex = logs.findIndex(l => l.date === today && l.medicationId === medicationId);
    if (existingIndex !== -1) {
      logs.splice(existingIndex, 1);
      this.saveLogs(logs);

      // Restore 1 to remainingStock
      const med = meds.find(m => m.id === medicationId);
      if (med) {
        med.remainingStock = Math.min(med.totalStock, med.remainingStock + 1);
        this.saveMedications(meds);
      }
    }
  },

  // Snooze medication
  snoozeMedication(medicationId: string, minutes: number = 15): MedicationLog {
    const today = getTodayDateString();
    const logs = this.getLogs();

    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    const existingIndex = logs.findIndex(l => l.date === today && l.medicationId === medicationId);

    let updatedLog: MedicationLog;
    if (existingIndex !== -1) {
      logs[existingIndex].status = 'snoozed';
      logs[existingIndex].snoozedUntil = snoozeUntil;
      updatedLog = logs[existingIndex];
    } else {
      updatedLog = {
        id: 'log-' + Date.now(),
        medicationId,
        date: today,
        status: 'snoozed',
        takenAt: null,
        snoozedUntil: snoozeUntil,
      };
      logs.push(updatedLog);
    }

    this.saveLogs(logs);
    return updatedLog;
  },

  // Love Notes
  getLoveNotes(): LoveNote[] {
    const data = localStorage.getItem(LOVE_NOTES_KEY);
    if (!data) {
      this.saveLoveNotes(DEFAULT_LOVE_NOTES);
      return DEFAULT_LOVE_NOTES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_LOVE_NOTES;
    }
  },

  saveLoveNotes(notes: LoveNote[]): void {
    localStorage.setItem(LOVE_NOTES_KEY, JSON.stringify(notes));
  },

  addLoveNote(text: string, sender: string = 'Sevgilin ❤️', emoji: string = '🌸'): LoveNote {
    const notes = this.getLoveNotes();
    const newNote: LoveNote = {
      id: 'note-' + Date.now(),
      text,
      sender,
      emoji,
    };
    notes.unshift(newNote);
    this.saveLoveNotes(notes);
    return newNote;
  },

  deleteLoveNote(id: string): void {
    const notes = this.getLoveNotes().filter(n => n.id !== id);
    this.saveLoveNotes(notes);
  },

  // User Settings
  getUserName(): string {
    return localStorage.getItem(USERNAME_KEY) || 'Prensesim';
  },

  setUserName(name: string): void {
    localStorage.setItem(USERNAME_KEY, name);
  },

  // Export / Import Data
  exportAllData(): string {
    const data = {
      medications: this.getMedications(),
      logs: this.getLogs(),
      loveNotes: this.getLoveNotes(),
      userName: this.getUserName(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.medications)) {
        this.saveMedications(data.medications);
      }
      if (Array.isArray(data.logs)) {
        this.saveLogs(data.logs);
      }
      if (Array.isArray(data.loveNotes)) {
        this.saveLoveNotes(data.loveNotes);
      }
      if (data.userName) {
        this.setUserName(data.userName);
      }
      return true;
    } catch {
      return false;
    }
  }
};
