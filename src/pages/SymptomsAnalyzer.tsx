import { useMemo, useState } from "react";
import type { Page } from "../components/AppSidebar";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Lightbulb,
  MessageCircle,
  Pill,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

interface SymptomsAnalyzerProps {
  onNavigate: (page: Page) => void;
}

type Severity =
  | "Mild"
  | "Moderate"
  | "High";

interface SymptomRecord {
  id: string;
  symptom: string;
  date: string;
  severity: Severity;
  duration: string;
  frequency: string;
  notes: string;
}

const initialSymptoms: SymptomRecord[] = [
  {
    id: "s1",
    symptom: "Fatigue / low energy",
    date: "08 Sep 2026",
    severity: "Moderate",
    duration: "2 weeks",
    frequency: "Daily",
    notes:
      "More noticeable in the afternoon and after poor sleep.",
  },
  {
    id: "s2",
    symptom: "Headache",
    date: "04 Sep 2026",
    severity: "Mild",
    duration: "2 days",
    frequency: "Occasional",
    notes:
      "Improved with rest and hydration.",
  },
  {
    id: "s3",
    symptom: "Increased thirst",
    date: "28 Aug 2026",
    severity: "Moderate",
    duration: "1 week",
    frequency: "Daily",
    notes:
      "More noticeable during active days.",
  },
];

const severityClasses: Record<
  Severity,
  string
> = {
  Mild: "bg-emerald-50 text-emerald-700",
  Moderate: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

const correlationCards = [
  {
    title: "Laboratory reports",
    value: "3 signals",
    detail:
      "Vitamin D is below the displayed reference range. HbA1c is being tracked longitudinally.",
    icon: FileText,
    tone: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Medication context",
    value: "2 medicines",
    detail:
      "Current medication history is considered when reviewing symptom timing and possible contributors.",
    icon: Pill,
    tone: "bg-sky-50 text-sky-600",
  },
  {
    title: "Health trends",
    value: "4 trends",
    detail:
      "Weight, glucose, blood pressure and resting heart rate provide longitudinal context.",
    icon: TrendingUp,
    tone: "bg-emerald-50 text-emerald-600",
  },
];

export default function SymptomsAnalyzer({
  onNavigate,
}: SymptomsAnalyzerProps) {
  const [symptoms, setSymptoms] =
    useState<SymptomRecord[]>(
      initialSymptoms,
    );

  const [selectedSymptom, setSelectedSymptom] =
    useState<SymptomRecord | null>(null);

  const [showAdd, setShowAdd] =
    useState(false);

  const [showGuidance, setShowGuidance] =
    useState(false);

  const [newSymptom, setNewSymptom] =
    useState({
      symptom: "",
      severity: "Mild" as Severity,
      duration: "",
      frequency: "Occasional",
      notes: "",
    });

  const activeSymptoms = useMemo(
    () =>
      symptoms.filter(
        (item) =>
          item.severity === "Moderate" ||
          item.severity === "High",
      ).length,
    [symptoms],
  );

  const handleAddSymptom = () => {
    if (!newSymptom.symptom.trim()) {
      return;
    }

    const record: SymptomRecord = {
      id: `symptom-${Date.now()}`,
      symptom: newSymptom.symptom.trim(),
      date: "08 Sep 2026",
      severity: newSymptom.severity,
      duration:
        newSymptom.duration ||
        "Not specified",
      frequency: newSymptom.frequency,
      notes:
        newSymptom.notes ||
        "No additional notes.",
    };

    setSymptoms((current) => [
      record,
      ...current,
    ]);

    setNewSymptom({
      symptom: "",
      severity: "Mild",
      duration: "",
      frequency: "Occasional",
      notes: "",
    });

    setShowAdd(false);
  };

  return (
    <div className="hp-page-enter mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">
            <Sparkles size={15} />
            Longitudinal health intelligence
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Symptoms Analyzer
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Record symptoms over time and connect them with medications,
            laboratory results and health trends to identify possible
            contributors and signals that may need attention.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowGuidance(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ShieldCheck size={16} />
            Safety guidance
          </button>

          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={16} />
            Record symptom
          </button>
        </div>
      </div>

      {/* Summary */}
      <section className="rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
              <Activity size={14} />
              Symptom intelligence
            </span>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              See symptoms in context, not isolation.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              HealthPassport compares recorded symptoms with available health
              information to highlight possible contributors. It does not
              diagnose disease.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Symptoms
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Labs
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Medications
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Trends
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
              Current symptom picture
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {symptoms.length}
            </p>

            <p className="text-xs text-slate-400">
              symptoms recorded
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Needs attention
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {activeSymptoms}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Data sources
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  4
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Correlation cards */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
            Cross-check
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            What HealthPassport compares
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {correlationCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}
                >
                  <Icon size={18} />
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {card.title}
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {card.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {card.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Possible contributors */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Lightbulb
            size={19}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              Possible contributors identified
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              The current fatigue pattern may have more than one possible
              contributor. The available demo data shows a low Vitamin D
              result, symptom timing related to sleep/recovery, and existing
              medication and health history that should be considered together.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-amber-800">
                Low Vitamin D
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-amber-800">
                Sleep / recovery
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-amber-800">
                Medication context
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-amber-800">
                Existing conditions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              Longitudinal record
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Recorded symptoms
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {symptoms.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setSelectedSymptom(item)
              }
              className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MessageCircle size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.symptom}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${severityClasses[item.severity]}`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={13} />
                        {item.date}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={13} />
                        {item.duration}
                      </span>

                      <span>
                        {item.frequency}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {item.notes}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-indigo-600">
                  Analyze
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Action guidance */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={19}
              className="text-emerald-600"
            />

            <p className="text-sm font-semibold text-emerald-800">
              Recommended monitoring
            </p>
          </div>

          <ul className="mt-3 space-y-2 text-xs leading-5 text-emerald-700">
            <li>
              • Continue recording symptom frequency and severity.
            </li>

            <li>
              • Compare symptoms against future laboratory results.
            </li>

            <li>
              • Track sleep, recovery and other relevant health trends.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
          <div className="flex items-center gap-3">
            <AlertCircle
              size={19}
              className="text-rose-600"
            />

            <p className="text-sm font-semibold text-rose-800">
              When to seek medical attention
            </p>
          </div>

          <p className="mt-3 text-xs leading-5 text-rose-700">
            Seek urgent medical care for severe or rapidly worsening symptoms,
            difficulty breathing, chest pain, fainting, confusion, severe
            allergic reactions, or other symptoms that feel immediately
            dangerous.
          </p>
        </div>
      </section>

      {/* Bottom actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Continue the health investigation
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Use the recorded symptoms together with HealthPassport's other
              longitudinal information.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                onNavigate("trends")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <TrendingUp size={14} />
              Health Trends
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigate("records")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText size={14} />
              Lab Reports
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigate("prediction")
              }
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <TrendingUp size={14} />
              Disease Prediction
            </button>
          </div>
        </div>
      </section>

      {/* Add symptom modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-500">
                  Longitudinal record
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Record a symptom
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Symptom
                </span>

                <input
                  value={newSymptom.symptom}
                  onChange={(event) =>
                    setNewSymptom(
                      (current) => ({
                        ...current,
                        symptom:
                          event.target.value,
                      }),
                    )
                  }
                  placeholder="e.g. fatigue, headache..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Severity
                  </span>

                  <select
                    value={newSymptom.severity}
                    onChange={(event) =>
                      setNewSymptom(
                        (current) => ({
                          ...current,
                          severity:
                            event.target.value as Severity,
                        }),
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400"
                  >
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>High</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Frequency
                  </span>

                  <select
                    value={newSymptom.frequency}
                    onChange={(event) =>
                      setNewSymptom(
                        (current) => ({
                          ...current,
                          frequency:
                            event.target.value,
                        }),
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400"
                  >
                    <option>Occasional</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Persistent</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Duration
                </span>

                <input
                  value={newSymptom.duration}
                  onChange={(event) =>
                    setNewSymptom(
                      (current) => ({
                        ...current,
                        duration:
                          event.target.value,
                      }),
                    )
                  }
                  placeholder="e.g. 3 days, 2 weeks"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Notes
                </span>

                <textarea
                  value={newSymptom.notes}
                  onChange={(event) =>
                    setNewSymptom(
                      (current) => ({
                        ...current,
                        notes:
                          event.target.value,
                      }),
                    )
                  }
                  rows={3}
                  placeholder="Anything that may help explain the symptom..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddSymptom}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Save Symptom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Symptom detail modal */}
      {selectedSymptom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-500">
                  Symptom analysis
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedSymptom.symptom}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedSymptom.date} ·{" "}
                  {selectedSymptom.duration} ·{" "}
                  {selectedSymptom.frequency}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedSymptom(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Severity
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${severityClasses[selectedSymptom.severity]}`}
                >
                  {selectedSymptom.severity}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Frequency
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedSymptom.frequency}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <Lightbulb
                  size={18}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />

                <div>
                  <p className="text-sm font-semibold text-indigo-900">
                    Possible contributors
                  </p>

                  <p className="mt-1 text-xs leading-5 text-indigo-800">
                    This symptom can have multiple possible causes. The current
                    HealthPassport context suggests reviewing laboratory results,
                    medication timing, sleep/recovery and existing conditions
                    together rather than attributing it to one cause.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                Recorded notes
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selectedSymptom.notes}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-xs leading-5 text-amber-800">
                  If this symptom becomes severe, rapidly worsens, or occurs
                  with concerning symptoms such as chest pain, difficulty
                  breathing, fainting or confusion, seek appropriate urgent
                  medical care.
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedSymptom(null);
                  onNavigate("records");
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700"
              >
                View Records
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSymptom(null);
                  onNavigate("prediction");
                }}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white"
              >
                Disease Prediction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety modal */}
      {showGuidance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-600">
                    Health guidance boundary
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    How to use Symptoms Analyzer
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowGuidance(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                Symptoms Analyzer identifies possible relationships between
                symptoms and available HealthPassport information.
              </p>

              <p>
                Possible contributors are not confirmed causes and should not
                be treated as a diagnosis.
              </p>

              <p>
                Persistent, severe or worsening symptoms should be reviewed by
                a qualified healthcare professional.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowGuidance(false)
              }
              className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}