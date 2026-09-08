export interface Patient {
  name: string;
  initials: string;
  age: number;
  gender: string;
  bloodGroup: string;
  conditions: number;
  medications: number;
  allergies: number;
  records: number;
}

export interface HealthCondition {
  name: string;
  status: string;
}

export interface Medication {
  name: string;
  dosage: string;
  schedule: string;
}

export interface Allergy {
  name: string;
  severity: string;
}

export interface MedicalRecord {
  id: number;
  title: string;
  category: string;
  provider: string;
  date: string;
  status: string;
}

export interface RecentTest {
  name: string;
  value: string;
  reference: string;
  date: string;
  direction: string;
}

export interface Reminder {
  type: string;
  title: string;
  time: string;
  date: string;
}

export interface HealthTrendPoint {
  month: string;
  year: string;
  value: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  type: string;
}

/**
 * Shared fictional patient for the investor demonstration.
 *
 * Keep this dataset consistent across Dashboard,
 * Health Summary, Emergency Passport, Timeline,
 * Trends, Medical Records and Ask HealthPassport.
 */
export const patient: Patient = {
  name: "Arjun Rao",
  initials: "AR",
  age: 42,
  gender: "Male",
  bloodGroup: "O+",
  conditions: 2,
  medications: 3,
  allergies: 1,
  records: 12,
};

/**
 * Current health conditions.
 */
export const conditions: HealthCondition[] = [
  {
    name: "Type 2 Diabetes",
    status: "Active",
  },
  {
    name: "Hypertension",
    status: "Active",
  },
];

/**
 * Current medications.
 */
export const medications: Medication[] = [
  {
    name: "Metformin",
    dosage: "500 mg",
    schedule: "8:00 AM",
  },
  {
    name: "Amlodipine",
    dosage: "5 mg",
    schedule: "9:00 AM",
  },
  {
    name: "Atorvastatin",
    dosage: "10 mg",
    schedule: "9:00 PM",
  },
];

/**
 * Known allergies.
 */
export const allergies: Allergy[] = [
  {
    name: "Penicillin",
    severity: "High",
  },
];

/**
 * Demo medical records.
 *
 * These represent the longitudinal records available
 * throughout the investor demonstration.
 */
export const records: MedicalRecord[] = [
  {
    id: 1,
    title: "Complete Blood Count",
    category: "Lab Report",
    provider: "CityCare Diagnostics",
    date: "28 Aug 2026",
    status: "AI Analysed",
  },
  {
    id: 2,
    title: "Diabetes Consultation",
    category: "Consultation",
    provider: "Dr. Priya Sharma",
    date: "15 Aug 2026",
    status: "AI Analysed",
  },
  {
    id: 3,
    title: "Prescription",
    category: "Prescription",
    provider: "Dr. Priya Sharma",
    date: "15 Aug 2026",
    status: "AI Analysed",
  },
  {
    id: 4,
    title: "Discharge Summary",
    category: "Hospital",
    provider: "Manipal Hospital",
    date: "18 Jun 2026",
    status: "AI Analysed",
  },
];

/**
 * Recent laboratory/test results.
 */
export const recentTests: RecentTest[] = [
  {
    name: "HbA1c",
    value: "6.8%",
    reference: "< 5.7%",
    date: "12 Aug 2026",
    direction: "up",
  },
  {
    name: "Hemoglobin",
    value: "14.2 g/dL",
    reference: "13–17",
    date: "12 Aug 2026",
    direction: "up",
  },
  {
    name: "Vitamin D",
    value: "22 ng/mL",
    reference: "30–100",
    date: "08 Aug 2026",
    direction: "down",
  },
  {
    name: "Cholesterol",
    value: "182 mg/dL",
    reference: "< 200",
    date: "02 Aug 2026",
    direction: "down",
  },
];

/**
 * Upcoming reminders.
 */
export const reminders: Reminder[] = [
  {
    type: "Medication",
    title: "Metformin",
    time: "8:00 PM",
    date: "Today",
  },
  {
    type: "Vaccination",
    title: "Flu vaccine",
    time: "",
    date: "In 14 days",
  },
  {
    type: "Follow-up",
    title: "Dr. Rao — General Medicine",
    time: "",
    date: "Sep 18",
  },
];

/**
 * Longitudinal HbA1c trend used by the dashboard
 * and Health Trends card.
 */
export const healthTrend: HealthTrendPoint[] = [
  {
    month: "Apr",
    year: "2025",
    value: 6.4,
  },
  {
    month: "Jun",
    year: "2025",
    value: 6.7,
  },
  {
    month: "Aug",
    year: "2025",
    value: 6.5,
  },
  {
    month: "Nov",
    year: "2025",
    value: 6.6,
  },
  {
    month: "Feb",
    year: "2026",
    value: 7.0,
  },
  {
    month: "May",
    year: "2026",
    value: 6.7,
  },
  {
    month: "Aug",
    year: "2026",
    value: 6.8,
  },
];

/**
 * Longitudinal health timeline.
 */
export const timelineEvents: TimelineEvent[] = [
  {
    date: "28 Aug 2026",
    title: "Complete Blood Count",
    type: "Lab Test",
  },
  {
    date: "15 Aug 2026",
    title: "Diabetes Consultation",
    type: "Consultation",
  },
  {
    date: "15 Aug 2026",
    title: "Prescription Updated",
    type: "Medication",
  },
  {
    date: "02 Jul 2026",
    title: "HbA1c Test",
    type: "Lab Test",
  },
  {
    date: "10 May 2026",
    title: "Annual Health Checkup",
    type: "Consultation",
  },
];