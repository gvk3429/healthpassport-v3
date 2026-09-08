import { useMemo, useState } from "react";
import type { Page } from "../components/AppSidebar";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Info,
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

interface DiseasePredictionProps {
  onNavigate: (page: Page) => void;
}

type PredictionLevel = "higher" | "watch" | "lower";

interface Prediction {
  id: string;
  title: string;
  level: PredictionLevel;
  score: number;
  summary: string;
  evidence: string[];
  contributors: string[];
  trend: string;
  action: string;
}

const predictions: Prediction[] = [
  {
    id: "metabolic",
    title: "Metabolic deterioration risk",
    level: "higher",
    score: 62,
    summary:
      "The longitudinal record shows a metabolic pattern that deserves continued monitoring. The signal is driven primarily by HbA1c history and recent glucose direction.",
    evidence: [
      "HbA1c is currently 6.8%",
      "HbA1c moved from 6.4% to 6.8% across the tracked period",
      "Fasting glucose is currently 94 mg/dL",
      "Type 2 diabetes is already present in the health record",
    ],
    contributors: [
      "Longitudinal HbA1c direction",
      "Recent glucose variation",
      "Existing metabolic condition",
    ],
    trend: "Increasing attention",
    action:
      "Continue monitoring glucose and HbA1c and discuss sustained changes with the treating clinician.",
  },
  {
    id: "cardiovascular",
    title: "Cardiovascular disease risk signal",
    level: "watch",
    score: 28,
    summary:
      "Current cardiovascular measurements appear relatively stable, but HealthPassport continues to evaluate the relationship between blood pressure, resting heart rate and longitudinal health trends.",
    evidence: [
      "Blood pressure: 118/76 mmHg",
      "Resting heart rate: 68 bpm",
      "Resting heart rate has improved from the tracked baseline",
      "No worsening blood-pressure trend is currently detected",
    ],
    contributors: [
      "Existing hypertension history",
      "Blood-pressure history",
      "Longitudinal cardiovascular measurements",
    ],
    trend: "Currently stable",
    action:
      "Maintain routine monitoring and review sustained changes rather than relying on a single measurement.",
  },
  {
    id: "vitamin-d",
    title: "Vitamin D deficiency signal",
    level: "higher",
    score: 74,
    summary:
      "The latest Vitamin D result is below the displayed reference range. This creates a strong laboratory signal that should be interpreted together with symptoms and clinical context.",
    evidence: [
      "Vitamin D: 22 ng/mL",
      "Displayed reference range: 30–100 ng/mL",
      "Latest result is below the tracked reference range",
      "Fatigue / low-energy symptoms are present in the demo health context",
    ],
    contributors: [
      "Low laboratory value",
      "Fatigue pattern",
      "Longitudinal health context",
    ],
    trend: "Needs follow-up",
    action:
      "Discuss the low result and appropriate follow-up testing or treatment with a healthcare professional.",
  },
  {
    id: "wellbeing",
    title: "Fatigue-related health signal",
    level: "watch",
    score: 41,
    summary:
      "Repeated fatigue or low-energy symptoms can have many possible contributors. HealthPassport combines symptom context with laboratory and trend information to identify when further review may be useful.",
    evidence: [
      "Fatigue / low-energy symptoms are represented in the longitudinal demo context",
      "Vitamin D is below the displayed reference range",
      "Multiple health measurements are available for comparison",
      "Medication and clinical history provide additional context",
    ],
    contributors: [
      "Sleep and recovery",
      "Vitamin D result",
      "Medication or clinical factors",
    ],
    trend: "Worth monitoring",
    action:
      "Continue recording symptoms and discuss persistent, worsening or unexplained fatigue with a clinician.",
  },
];

const levelStyles: Record<
  PredictionLevel,
  {
    label: string;
    badge: string;
    icon: string;
    border: string;
    bar: string;
  }
> = {
  higher: {
    label: "Higher signal",
    badge: "bg-rose-50 text-rose-700",
    icon: "bg-rose-50 text-rose-600",
    border: "border-rose-100",
    bar: "bg-rose-500",
  },
  watch: {
    label: "Worth watching",
    badge: "bg-amber-50 text-amber-700",
    icon: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
    bar: "bg-amber-500",
  },
  lower: {
    label: "Lower signal",
    badge: "bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
    bar: "bg-emerald-500",
  },
};

function getPredictionIcon(id: string) {
  switch (id) {
    case "metabolic":
      return Activity;

    case "cardiovascular":
      return TrendingUp;

    case "vitamin-d":
      return TrendingDown;

    default:
      return MessageCircle;
  }
}

export default function DiseasePrediction({
  onNavigate,
}: DiseasePredictionProps) {
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);

  const [showMethod, setShowMethod] =
    useState(false);

  const [showDisclaimer, setShowDisclaimer] =
    useState(false);

  const overallScore = useMemo(() => {
    const total = predictions.reduce(
      (sum, prediction) => sum + prediction.score,
      0,
    );

    return Math.round(total / predictions.length);
  }, []);

  const higherSignals = predictions.filter(
    (prediction) => prediction.level === "higher",
  ).length;

  const evidenceCount = predictions.reduce(
    (sum, prediction) =>
      sum + prediction.evidence.length,
    0,
  );

  return (
    <div className="hp-page-enter mx-auto w-full max-w-7xl space-y-6">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">
            <Sparkles size={15} />
            Predictive health intelligence
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Disease Prediction
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            HealthPassport combines laboratory results, health trends and
            symptom context to identify possible disease-related signals that
            may deserve further clinical review.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowMethod(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Info size={16} />
            How it works
          </button>

          <button
            type="button"
            onClick={() => onNavigate("ask")}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <MessageCircle size={16} />
            Ask HealthPassport
          </button>
        </div>
      </div>

      {/* =====================================================
          OVERVIEW
          ===================================================== */}
      <section className="rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
              <ShieldCheck size={14} />
              Longitudinal prediction
            </div>

            <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-slate-900">
              From health data to possible disease signals.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Instead of evaluating one result in isolation, HealthPassport
              looks at the direction and relationship between laboratory
              results, symptoms and tracked health measurements.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Lab Reports
              </span>

              <span className="text-slate-300">+</span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Symptoms
              </span>

              <span className="text-slate-300">+</span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Health Trends
              </span>

              <span className="text-slate-300">+</span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Clinical Context
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Overall prediction signal
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  Review recommended
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Demo interpretation only
                </p>
              </div>

              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-8 border-indigo-100">
                <span className="text-lg font-bold text-slate-800">
                  {overallScore}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${Math.min(
                      overallScore,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                <span>Lower signal</span>
                <span>Higher signal</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Signals
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {predictions.length}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Higher
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {higherSignals}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Evidence
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {evidenceCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PREDICTION CARDS
          ===================================================== */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              Prediction results
            </p>

            <h2 className="mt-1.5 text-xl font-bold text-slate-900">
              Possible disease-related signals
            </h2>
          </div>

          <span className="hidden text-xs text-slate-400 sm:block">
            Based on available HealthPassport demo data
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {predictions.map((prediction) => {
            const styles =
              levelStyles[prediction.level];

            const Icon = getPredictionIcon(
              prediction.id,
            );

            return (
              <button
                key={prediction.id}
                type="button"
                onClick={() =>
                  setSelectedPrediction(
                    prediction,
                  )
                }
                className={`group rounded-[24px] border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.border}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {prediction.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Longitudinal health signal
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badge}`}
                      >
                        {styles.label}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {prediction.summary}
                    </p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                          Prediction signal
                        </p>

                        <p className="text-sm font-bold text-slate-800">
                          {prediction.score}
                          <span className="text-xs font-medium text-slate-400">
                            /100
                          </span>
                        </p>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${styles.bar}`}
                          style={{
                            width: `${prediction.score}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-400">
                          Direction
                        </p>

                        <p className="mt-0.5 text-xs font-semibold text-slate-600">
                          {prediction.trend}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="text-slate-300 transition group-hover:text-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          EXPLANATION CARDS
          ===================================================== */}
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FileText size={18} />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            Evidence
          </p>

          <h3 className="mt-1.5 text-sm font-semibold text-slate-800">
            Lab reports matter
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Laboratory results provide measurable evidence that can be
            interpreted alongside historical results rather than as isolated
            numbers.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <TrendingUp size={18} />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            Trends
          </p>

          <h3 className="mt-1.5 text-sm font-semibold text-slate-800">
            Direction changes meaning
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            HealthPassport evaluates whether measurements are stable, improving
            or moving in a direction that may deserve attention.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <MessageCircle size={18} />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            Symptoms
          </p>

          <h3 className="mt-1.5 text-sm font-semibold text-slate-800">
            Symptoms add context
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Longitudinal symptom entries can provide additional context around
            laboratory and health-trend signals.
          </p>
        </section>
      </div>

      {/* =====================================================
          SUPPORTING DATA
          ===================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Activity size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Explore the evidence behind the prediction
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Review the underlying health trends, symptoms and medical
                records before discussing a prediction with a clinician.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate("trends")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <TrendingUp size={14} />
              Health Trends
            </button>

            <button
              type="button"
              onClick={() => onNavigate("symptoms")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <MessageCircle size={14} />
              Symptoms
            </button>

            <button
              type="button"
              onClick={() => onNavigate("records")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <FileText size={14} />
              Medical Records
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          SAFETY BOUNDARY
          ===================================================== */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              Important: prediction is not diagnosis
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              These results represent possible patterns in the available
              HealthPassport data. They do not confirm that a disease is
              present. Diagnosis requires appropriate clinical assessment,
              examination and testing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDisclaimer(true)}
            className="hidden shrink-0 text-xs font-semibold text-amber-700 underline underline-offset-2 sm:block"
          >
            Learn more
          </button>
        </div>
      </section>

      {/* =====================================================
          PREDICTION DETAIL MODAL
          ===================================================== */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    levelStyles[
                      selectedPrediction.level
                    ].icon
                  }`}
                >
                  {(() => {
                    const Icon =
                      getPredictionIcon(
                        selectedPrediction.id,
                      );

                    return <Icon size={20} />;
                  })()}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-500">
                    Disease prediction
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedPrediction.title}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Possible signal based on longitudinal data
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPrediction(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                aria-label="Close prediction"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-indigo-900">
                  {
                    levelStyles[
                      selectedPrediction.level
                    ].label
                  }
                </p>

                <p className="text-sm font-bold text-indigo-700">
                  {selectedPrediction.score}/100
                </p>
              </div>

              <p className="mt-2 text-sm leading-6 text-indigo-950">
                {selectedPrediction.summary}
              </p>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-600"
                />

                <h3 className="text-sm font-semibold text-slate-800">
                  Evidence considered
                </h3>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {selectedPrediction.evidence.map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-xl bg-slate-50 p-3"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2
                          size={14}
                          className="mt-0.5 shrink-0 text-emerald-500"
                        />

                        <p className="text-xs leading-5 text-slate-600">
                          {item}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Lightbulb
                  size={16}
                  className="text-indigo-500"
                />

                <h3 className="text-sm font-semibold text-slate-800">
                  Possible contributors
                </h3>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedPrediction.contributors.map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-600">
                Suggested next step
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-900">
                {selectedPrediction.action}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setSelectedPrediction(null);
                  onNavigate("ask");
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Ask HealthPassport
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPrediction(null);
                  onNavigate("records");
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                View Records
                <FileText size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          HOW IT WORKS MODAL
          ===================================================== */}
      {showMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-500">
                  Explainability
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  How Disease Prediction works
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowMethod(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                aria-label="Close methodology"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <FileText
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      1. Read available health evidence
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Laboratory results and relevant medical-record context
                      are considered as part of the patient health picture.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      2. Evaluate longitudinal direction
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Health trends are used to identify whether measurements
                      are stable, improving or moving in a concerning direction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      3. Add symptom context
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Longitudinal symptoms can strengthen or weaken a signal
                      and provide additional context for interpretation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Stethoscope
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      4. Present a review signal
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      The result is presented as a possible signal for further
                      review, not as a confirmed medical diagnosis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMethod(false)}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          DISCLAIMER MODAL
          ===================================================== */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <AlertCircle size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-600">
                    Health guidance boundary
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    Prediction is not diagnosis
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDisclaimer(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                aria-label="Close disclaimer"
              >
                <X size={17} />
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              Disease Prediction is designed to demonstrate how HealthPassport
              can connect longitudinal patient data and highlight patterns for
              earlier review. It does not establish a diagnosis and should not
              replace professional medical assessment.
            </p>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-xs leading-5 text-amber-800">
                  For the investor demonstration, the displayed prediction
                  signals are illustrative and based on the fictional demo
                  patient's available health data.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDisclaimer(false)}
              className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}