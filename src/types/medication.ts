export type FoodStatus = 'before_food' | 'after_food' | 'with_food' | 'independent';
export type DayPeriod = 'morning' | 'noon' | 'evening' | 'night';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // "09:00"
  period: DayPeriod;
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
  date: string; // "YYYY-MM-DD"
  takenAt: string | null; // ISO string e.g. 2026-09-05T09:15:32.000Z
  status: 'taken' | 'skipped' | 'snoozed';
  snoozedUntil?: string | null;
}

export interface LoveNote {
  id: string;
  text: string;
  sender: string;
  emoji: string;
}
