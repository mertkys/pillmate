import type { 
  Medication, 
  MedicationLog, 
  LoveNote, 
  DoctorAppointment, 
  BloodPressureLog, 
  AvatarOption, 
  DayPeriod 
} from '../types/medication';

const MEDS_KEY = 'pillmate_medications_v2';
const LOGS_KEY = 'pillmate_logs_v2';
const LOVE_NOTES_KEY = 'pillmate_love_notes_v1';
const USERNAME_KEY = 'pillmate_user_name_v1';
const APPOINTMENTS_KEY = 'pillmate_appointments_v1';
const BP_LOGS_KEY = 'pillmate_bp_logs_v1';
const AVATAR_KEY = 'pillmate_avatar_v1';

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'classic',
    name: 'Klasik Kalpli PillMate',
    image: '/assets/mascot.jpg',
    description: 'İlk ve en tatlı şifa dostun 💖',
  },
  {
    id: 'strawberry',
    name: 'Çilekli Sevimli Maskot',
    image: '/assets/avatar_strawberry.jpg',
    description: 'Tatlı çilek şapkasıyla neşe saçar 🍓',
  },
  {
    id: 'waterdrop',
    name: 'Neşeli Su Damlası',
    image: '/assets/avatar_waterdrop.jpg',
    description: 'Bol bol su içmeyi hatırlatır 💧',
  },
  {
    id: 'healer',
    name: 'Şifacı Çiçekli Maskot',
    image: '/assets/avatar_healer.jpg',
    description: 'Stetoskopu ve çiçeğiyle şifa verir 🌸',
  },
];

const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Demir İlacı (Ferrum)',
    dosage: '1 Kapsül',
    time: '09:00',
    period: 'morning',
    doses: [
      { id: 'd1-1', time: '09:00', period: 'morning', label: 'Sabah' },
    ],
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
    name: 'Tansiyon / Kalp Destek',
    dosage: '1 Tablet',
    time: '09:00',
    period: 'morning',
    doses: [
      { id: 'd2-1', time: '09:00', period: 'morning', label: 'Sabah' },
      { id: 'd2-2', time: '21:00', period: 'night', label: 'Gece' },
    ],
    foodStatus: 'after_food',
    color: 'sky',
    icon: 'pill',
    totalStock: 60,
    remainingStock: 48,
    notes: 'Sabah ve gece aksatılmadan alınmalı 🩺',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-3',
    name: 'Omega 3 & Magnezyum',
    dosage: '1 Kapsül',
    time: '23:30',
    period: 'night',
    doses: [
      { id: 'd3-1', time: '23:30', period: 'night', label: 'Gece' },
    ],
    foodStatus: 'after_food',
    color: 'violet',
    icon: 'capsule',
    totalStock: 30,
    remainingStock: 18,
    notes: 'Uyumadan önce rahat bir uyku için 🌙',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Selin Yılmaz',
    specialty: 'Kardiyoloji',
    hospital: 'Memorial Hastanesi',
    date: getFutureDateString(3),
    time: '14:30',
    notes: 'Son 1 haftalık tansiyon ölçüm tablosu gösterilecek. Eko çekimi yapılacak.',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. Ahmet Demir',
    specialty: 'Dahiliye',
    hospital: 'Şişli Florence Nightingale',
    date: getFutureDateString(8),
    time: '10:00',
    notes: 'Aç karnına kan tahlili verilecek, demir değerlerine bakılacak.',
    completed: false,
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_BP_LOGS: BloodPressureLog[] = [
  {
    id: 'bp-1',
    date: getTodayDateString(),
    time: '09:15',
    systolic: 118,
    diastolic: 78,
    pulse: 72,
    feeling: 'great',
    notes: 'Sabah dinlenmiş olarak ölçüldü, çok iyi.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bp-2',
    date: getYesterdayDateString(),
    time: '20:30',
    systolic: 124,
    diastolic: 82,
    pulse: 76,
    feeling: 'normal',
    notes: 'Akşam yemeğinden 1 saat sonra.',
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
    text: 'Tansiyonunu ölçtüğün ve ilaçlarını aksatmadığın için seninle gurur duyuyorum! Suyunu da iç lütfen 💧',
    sender: 'Sevgilin ❤️',
    emoji: '🥰',
  },
  {
    id: 'note-3',
    text: 'Doktor kontrollerini de beraber takip ediyoruz, her zaman yanındayım canım sevgilim 🕊️',
    sender: 'Sevgilin ❤️',
    emoji: '✨',
  }
];

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getFutureDateString(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const storageService = {
  // Medications
  getMedications(): Medication[] {
    const data = localStorage.getItem(MEDS_KEY);
    if (!data) {
      this.saveMedications(DEFAULT_MEDICATIONS);
      return DEFAULT_MEDICATIONS;
    }
    try {
      const parsed: Medication[] = JSON.parse(data);
      // Migration: ensure every med has valid doses array
      let updated = false;
      const normalized = parsed.map(m => {
        if (!m.doses || m.doses.length === 0) {
          updated = true;
          return {
            ...m,
            doses: [{ id: `${m.id}-dose-1`, time: m.time || '09:00', period: m.period || 'morning', label: 'Tek Doz' }],
          };
        }
        return m;
      });
      if (updated) {
        this.saveMedications(normalized);
      }
      return normalized;
    } catch {
      return DEFAULT_MEDICATIONS;
    }
  },

  saveMedications(meds: Medication[]): void {
    localStorage.setItem(MEDS_KEY, JSON.stringify(meds));
  },

  addMedication(med: Omit<Medication, 'id' | 'createdAt'>): Medication {
    const meds = this.getMedications();
    const id = 'med-' + Date.now();
    
    // Ensure doses are prepared
    const doses = med.doses && med.doses.length > 0 
      ? med.doses.map((d, i) => ({ ...d, id: d.id || `${id}-d-${i + 1}` }))
      : [{ id: `${id}-d-1`, time: med.time, period: med.period, label: 'Doz 1' }];

    const newMed: Medication = {
      ...med,
      id,
      doses,
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

  // Daily Logs & Smart Midnight Attribution
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

  /**
   * Zeki Gece Yarısı Algılaması (Smart Midnight Logic):
   * Eğer saat 00:00 ile 05:00 arasındaysa ve dünün gece dozu henüz alınmadıysa,
   * bu dozu "dünün gece ilacı" olarak atar. Böylece ertesi günün ilacı erkenden harcanmaz!
   */
  getEffectiveDateForDose(medicationId: string, doseId?: string, period?: DayPeriod): { date: string; isMidnightShifted: boolean } {
    const now = new Date();
    const hour = now.getHours();
    const isLateNight = hour >= 0 && hour < 5; // 00:00 - 04:59

    if (isLateNight) {
      const yesterday = getYesterdayDateString();
      const logs = this.getLogs();
      const yesterdayLog = logs.find(l => 
        l.date === yesterday && 
        l.medicationId === medicationId && 
        (!doseId || l.doseId === doseId) &&
        l.status === 'taken'
      );

      // Eğer dünün dozu henüz alınmadıysa ve bu bir gece/akşam dozu ise dünün dozu say
      if (!yesterdayLog && (period === 'night' || period === 'evening' || !period)) {
        return { date: yesterday, isMidnightShifted: true };
      }
    }

    return { date: getTodayDateString(), isMidnightShifted: false };
  },

  // Mark specific dose of medication as taken
  markDoseAsTaken(medicationId: string, doseId: string, customDate?: string): MedicationLog {
    const meds = this.getMedications();
    const med = meds.find(m => m.id === medicationId);
    const dose = med?.doses.find(d => d.id === doseId);

    const { date: autoDate, isMidnightShifted } = this.getEffectiveDateForDose(
      medicationId, 
      doseId, 
      dose?.period || med?.period
    );
    const targetDate = customDate || autoDate;

    const logs = this.getLogs();
    const nowIso = new Date().toISOString();

    const existingIndex = logs.findIndex(
      l => l.date === targetDate && l.medicationId === medicationId && l.doseId === doseId
    );

    let updatedLog: MedicationLog;
    if (existingIndex !== -1) {
      logs[existingIndex].status = 'taken';
      logs[existingIndex].takenAt = nowIso;
      logs[existingIndex].snoozedUntil = null;
      logs[existingIndex].isMidnightShifted = isMidnightShifted;
      updatedLog = logs[existingIndex];
    } else {
      updatedLog = {
        id: 'log-' + Date.now(),
        medicationId,
        doseId,
        date: targetDate,
        status: 'taken',
        takenAt: nowIso,
        snoozedUntil: null,
        isMidnightShifted,
      };
      logs.push(updatedLog);
    }

    // Decrement remaining stock
    if (med && med.remainingStock > 0) {
      med.remainingStock = Math.max(0, med.remainingStock - 1);
      this.saveMedications(meds);
    }

    this.saveLogs(logs);
    return updatedLog;
  },

  // Undo specific dose
  undoDoseTaken(medicationId: string, doseId: string, targetDate?: string): void {
    const effectiveDate = targetDate || getTodayDateString();
    const yesterday = getYesterdayDateString();
    const logs = this.getLogs();
    const meds = this.getMedications();

    // Check today first, then yesterday if not found
    let idx = logs.findIndex(l => l.date === effectiveDate && l.medicationId === medicationId && l.doseId === doseId);
    if (idx === -1) {
      idx = logs.findIndex(l => l.date === yesterday && l.medicationId === medicationId && l.doseId === doseId);
    }

    if (idx !== -1) {
      logs.splice(idx, 1);
      this.saveLogs(logs);

      // Restore stock
      const med = meds.find(m => m.id === medicationId);
      if (med) {
        med.remainingStock = Math.min(med.totalStock, med.remainingStock + 1);
        this.saveMedications(meds);
      }
    }
  },

  // Snooze specific dose
  snoozeDose(medicationId: string, doseId: string, minutes: number = 15): MedicationLog {
    const today = getTodayDateString();
    const logs = this.getLogs();
    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();

    const existingIndex = logs.findIndex(
      l => l.date === today && l.medicationId === medicationId && l.doseId === doseId
    );

    let updatedLog: MedicationLog;
    if (existingIndex !== -1) {
      logs[existingIndex].status = 'snoozed';
      logs[existingIndex].snoozedUntil = snoozeUntil;
      updatedLog = logs[existingIndex];
    } else {
      updatedLog = {
        id: 'log-' + Date.now(),
        medicationId,
        doseId,
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

  // Doctor Appointments
  getAppointments(): DoctorAppointment[] {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    if (!data) {
      this.saveAppointments(DEFAULT_APPOINTMENTS);
      return DEFAULT_APPOINTMENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_APPOINTMENTS;
    }
  },

  saveAppointments(apts: DoctorAppointment[]): void {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(apts));
  },

  addAppointment(apt: Omit<DoctorAppointment, 'id' | 'createdAt'>): DoctorAppointment {
    const apts = this.getAppointments();
    const newApt: DoctorAppointment = {
      ...apt,
      id: 'apt-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    apts.push(newApt);
    // Sort by date ascending
    apts.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    this.saveAppointments(apts);
    return newApt;
  },

  updateAppointment(updatedApt: DoctorAppointment): void {
    const apts = this.getAppointments();
    const idx = apts.findIndex(a => a.id === updatedApt.id);
    if (idx !== -1) {
      apts[idx] = updatedApt;
      apts.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      this.saveAppointments(apts);
    }
  },

  deleteAppointment(id: string): void {
    const apts = this.getAppointments().filter(a => a.id !== id);
    this.saveAppointments(apts);
  },

  // Blood Pressure Logs
  getBloodPressureLogs(): BloodPressureLog[] {
    const data = localStorage.getItem(BP_LOGS_KEY);
    if (!data) {
      this.saveBloodPressureLogs(DEFAULT_BP_LOGS);
      return DEFAULT_BP_LOGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_BP_LOGS;
    }
  },

  saveBloodPressureLogs(logs: BloodPressureLog[]): void {
    localStorage.setItem(BP_LOGS_KEY, JSON.stringify(logs));
  },

  addBloodPressureLog(log: Omit<BloodPressureLog, 'id' | 'createdAt'>): BloodPressureLog {
    const logs = this.getBloodPressureLogs();
    const newLog: BloodPressureLog = {
      ...log,
      id: 'bp-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    this.saveBloodPressureLogs(logs);
    return newLog;
  },

  deleteBloodPressureLog(id: string): void {
    const logs = this.getBloodPressureLogs().filter(l => l.id !== id);
    this.saveBloodPressureLogs(logs);
  },

  // Avatar Selection
  getSelectedAvatar(): AvatarOption {
    const id = localStorage.getItem(AVATAR_KEY);
    const found = AVATAR_OPTIONS.find(a => a.id === id);
    return found || AVATAR_OPTIONS[0];
  },

  setSelectedAvatar(id: string): void {
    localStorage.setItem(AVATAR_KEY, id);
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

  // Comprehensive Export / Import
  exportAllData(): string {
    const data = {
      medications: this.getMedications(),
      logs: this.getLogs(),
      appointments: this.getAppointments(),
      bpLogs: this.getBloodPressureLogs(),
      loveNotes: this.getLoveNotes(),
      userName: this.getUserName(),
      selectedAvatar: this.getSelectedAvatar().id,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.medications)) this.saveMedications(data.medications);
      if (Array.isArray(data.logs)) this.saveLogs(data.logs);
      if (Array.isArray(data.appointments)) this.saveAppointments(data.appointments);
      if (Array.isArray(data.bpLogs)) this.saveBloodPressureLogs(data.bpLogs);
      if (Array.isArray(data.loveNotes)) this.saveLoveNotes(data.loveNotes);
      if (data.userName) this.setUserName(data.userName);
      if (data.selectedAvatar) this.setSelectedAvatar(data.selectedAvatar);
      return true;
    } catch {
      return false;
    }
  }
};
