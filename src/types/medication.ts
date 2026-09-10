export type FoodStatus = 'before_food' | 'after_food' | 'with_food' | 'independent';
export type DayPeriod = 'morning' | 'noon' | 'evening' | 'night';

export interface MedicationDose {
  id: string;
  time: string; // "09:00"
  period: DayPeriod; // 'morning' | 'noon' | 'evening' | 'night'
  label?: string; // e.g. "Sabah Dozu", "Akşam Dozu"
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // primary/legacy time format "09:00"
  period: DayPeriod; // primary/legacy period
  doses: MedicationDose[]; // multiple times support!
  foodStatus: FoodStatus;
  color: 'rose' | 'violet' | 'amber' | 'emerald' | 'sky';
  icon: 'pill' | 'capsule' | 'droplet' | 'sparkles';
  totalStock: number;
  remainingStock: number;
  notes?: string;
  active: boolean;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  doseId?: string; // specific dose id (e.g. morning vs evening)
  date: string; // "YYYY-MM-DD" (effective logical date)
  takenAt: string | null; // ISO string e.g. 2026-09-10T02:30:00.000Z
  status: 'taken' | 'skipped' | 'snoozed';
  snoozedUntil?: string | null;
  isMidnightShifted?: boolean; // True if taken past midnight (00:00-05:00) and counted toward yesterday's dose
}

export interface LoveNote {
  id: string;
  text: string;
  sender: string;
  emoji: string;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "14:30"
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface BloodPressureLog {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "10:30"
  systolic: number; // Büyük tansiyon
  diastolic: number; // Küçük tansiyon
  pulse?: number; // Nabız
  feeling?: 'great' | 'normal' | 'dizzy' | 'headache' | 'tired';
  notes?: string;
  createdAt: string;
}

export interface AvatarOption {
  id: string;
  name: string;
  image: string;
  description: string;
}
