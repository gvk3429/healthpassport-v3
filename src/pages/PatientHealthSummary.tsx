import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Droplets,
  Heart,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  TrendingDown,
  TrendingUp,
  UserRound,
} from "lucide-react";

import {
  allergies,
  conditions,
  medications,
  patient,
  recentTests,
  records,
} from "../data/mockHealthData";

import type { Page } from "../components/AppSidebar";

interface PatientHealthSummaryProps {
  onNavigate: (page: Page) => void;
}

interface VitalCardProps {
  label: string;
  value: string;
  unit?: string;
  status: string;
  statusType: "good" | "attention" | "neutral";
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  trend?: "up" | "down";
}

function VitalCard({
  label,
  value,
  unit,
  status,
  statusType,
  icon: Icon,
  trend,
}: VitalCardProps) {
  const statusClasses = {
    good: "bg-emerald-50 text-emerald-700",
    attention: "bg-amber-50 text-amber-700",
    neutral: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <Icon size={16} strokeWidth={1.8} />
        </div>

        {trend && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            {trend === "up" ? (
              <TrendingUp size={13} />
            ) : (
              <TrendingDown size={13} />
            )}
          </span>
        )}
      </div>

      <p className="mt-4 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-black tracking-tight text-slate-900">
          {value}
        </span>

        {unit && (
          <span className="text-[9px] font-bold text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <span
        className={`mt-2 inline-flex rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wide ${statusClasses[statusType]}`}
      >
        {status}
      </span>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  tone?: "blue" | "red" | "amber" | "green";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[12px] font-black text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function PatientHealthSummary({
  onNavigate,
}: PatientHealthSummaryProps) {
  const activeConditions = conditions.filter(
    (condition) => condition.status === "Active",
  );

  const currentMedications = medications.length;

  const latestTest = recentTests[0];

  const latestRecord = records[0];

  return (
    <div className="hp-page-enter mx-auto max-w-[1500px] space-y-5">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <HeartPulse size={14} />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-500">
              Patient Health Summary
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-blue-950 md:text-3xl">
            Your health at a glance.
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            A simple view of the health information that matters
            most right now.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate("ask")}
            className="hp-secondary-btn"
          >
            <Sparkles size={15} />
            Ask HealthPassport
          </button>

          <button
            type="button"
            onClick={() => onNavigate("records")}
            className="hp-primary-btn"
          >
            View Records
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* =====================================================
          HERO SUMMARY
          ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 p-5 text-white shadow-card sm:p-7">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10 backdrop-blur">
                <UserRound size={22} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-200">
                  Patient
                </p>

                <h2 className="mt-0.5 text-xl font-black">
                  {patient.name}
                </h2>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-[13px] leading-6 text-blue-100">
              Your HealthPassport brings your important health
              information together so you can understand your
              current picture, prepare for care, and share only
              what you choose.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold text-white">
                {patient.age} years
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold text-white">
                {patient.gender}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold text-white">
                Blood group {patient.bloodGroup}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-[9px] font-black text-emerald-100">
                <ShieldCheck size={11} />
                Identity protected
              </span>
            </div>
          </div>

          {/* Summary score */}
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-blue-200">
                  Health information
                </p>

                <p className="mt-1 text-3xl font-black">
                  Ready
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                <CheckCircle2 size={22} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[86%] rounded-full bg-emerald-300" />
            </div>

            <p className="mt-3 text-[10px] leading-4 text-blue-100">
              Your core health information is organized and
              available for your review.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK METRICS
          ===================================================== */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryMetric
          label="Active conditions"
          value={`${activeConditions.length} tracked`}
          icon={Activity}
          tone="blue"
        />

        <SummaryMetric
          label="Medications"
          value={`${currentMedications} current`}
          icon={Pill}
          tone="green"
        />

        <SummaryMetric
          label="Allergies"
          value={`${allergies.length} important`}
          icon={AlertCircle}
          tone="red"
        />

        <SummaryMetric
          label="Health records"
          value={`${patient.records} records`}
          icon={Stethoscope}
          tone="amber"
        />
      </section>

      {/* =====================================================
          VITALS
          ===================================================== */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-500">
              Latest measurements
            </p>

            <h2 className="mt-1 text-base font-black text-slate-900">
              Health snapshot
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("trends")}
            className="hidden items-center gap-1 text-[10px] font-bold text-blue-600 sm:flex"
          >
            View trends
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <VitalCard
            label="HbA1c"
            value="6.8"
            unit="%"
            status="Needs attention"
            statusType="attention"
            icon={Activity}
            trend="up"
          />

          <VitalCard
            label="Hemoglobin"
            value="14.2"
            unit="g/dL"
            status="Within range"
            statusType="good"
            icon={Droplets}
            trend="up"
          />

          <VitalCard
            label="Vitamin D"
            value="22"
            unit="ng/mL"
            status="Below reference"
            statusType="attention"
            icon={Thermometer}
            trend="down"
          />

          <VitalCard
            label="Cholesterol"
            value="182"
            unit="mg/dL"
            status="Within reference"
            statusType="good"
            icon={Heart}
            trend="down"
          />
        </div>
      </section>

      {/* =====================================================
          WHAT MATTERS NOW
          ===================================================== */}
      <section className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="h-full rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Sparkles size={15} />
                  </span>

                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-600">
                    What matters now
                  </p>
                </div>

                <h2 className="mt-3 text-lg font-black text-slate-900">
                  A few things deserve your attention.
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <Activity size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-800">
                    HbA1c is 6.8%
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Your latest HbA1c result is above the normal
                    reference range shown in your record.
                  </p>

                  <button
                    type="button"
                    onClick={() => onNavigate("records")}
                    className="mt-2 inline-flex items-center gap-1 text-[9px] font-black text-amber-700"
                  >
                    Open record
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                  <Thermometer size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-800">
                    Vitamin D is 22 ng/mL
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    This result is below the reference range
                    shown in your health records.
                  </p>

                  <button
                    type="button"
                    onClick={() => onNavigate("trends")}
                    className="mt-2 inline-flex items-center gap-1 text-[9px] font-black text-sky-700"
                  >
                    View trend
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                  <AlertCircle size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-800">
                    Penicillin allergy
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Keep this allergy visible when sharing your
                    emergency or medication information.
                  </p>

                  <button
                    type="button"
                    onClick={() => onNavigate("emergency")}
                    className="mt-2 inline-flex items-center gap-1 text-[9px] font-black text-red-700"
                  >
                    Emergency Passport
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            CONDITIONS + MEDICATIONS
            =================================================== */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Current
                </p>

                <h3 className="mt-1 text-[14px] font-black text-slate-900">
                  Conditions
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("overview")}
                className="text-[9px] font-black text-blue-600"
              >
                View all
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {conditions.map((condition) => (
                <div
                  key={condition.name}
                  className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                      <Activity size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-black text-slate-800">
                        {condition.name}
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        {condition.status}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-black uppercase ${
                      condition.status === "Active"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {condition.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Current
                </p>

                <h3 className="mt-1 text-[14px] font-black text-slate-900">
                  Medications
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("overview")}
                className="text-[9px] font-black text-blue-600"
              >
                View all
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {medications.slice(0, 3).map((medication) => (
                <div
                  key={medication.name}
                  className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm">
                      <Pill size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-black text-slate-800">
                        {medication.name}
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        {medication.dosage} · {medication.schedule}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-black uppercase text-emerald-700">
                    Current
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RECENT ACTIVITY
          ===================================================== */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-500">
              Recent activity
            </p>

            <h2 className="mt-1 text-base font-black text-slate-900">
              Latest health information
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("timeline")}
            className="flex items-center gap-1 text-[10px] font-black text-blue-600"
          >
            Open timeline
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {/* Latest record */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Stethoscope size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-black text-slate-800">
                    {latestRecord.title}
                  </p>

                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-black uppercase text-emerald-700">
                    {latestRecord.status}
                  </span>
                </div>

                <p className="mt-1 text-[9px] text-slate-500">
                  {latestRecord.provider}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[8px] font-bold text-slate-400">
                  <CalendarDays size={11} />
                  {latestRecord.date}
                </div>
              </div>
            </div>
          </div>

          {/* Latest test */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                <Activity size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-black text-slate-800">
                    {latestTest.name}
                  </p>

                  <span className="text-lg font-black text-slate-900">
                    {latestTest.value}
                  </span>
                </div>

                <p className="mt-1 text-[9px] text-slate-500">
                  Reference {latestTest.reference}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[8px] font-bold text-slate-400">
                  <Clock3 size={11} />
                  {latestTest.date}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRIVACY FOOTER
          ===================================================== */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <ShieldCheck size={18} />
          </div>

          <div>
            <p className="text-[11px] font-black text-slate-800">
              Your health summary stays under your control.
            </p>

            <p className="mt-0.5 text-[9px] leading-4 text-slate-500">
              Review your privacy settings before sharing health
              information with anyone.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("privacy")}
          className="flex items-center gap-1 text-[10px] font-black text-blue-600"
        >
          Privacy & Access
          <ArrowRight size={13} />
        </button>
      </section>
    </div>
  );
}