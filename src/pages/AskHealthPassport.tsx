import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Heart,
  Info,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";

interface AskHealthPassportProps {
  onNavigate: (page: Page) => void;
}

type SignalStatus =
  | "improving"
  | "stable"
  | "watch"
  | "review";

type InsightType =
  | "positive"
  | "attention"
  | "neutral";

interface DecisionSignal {
  id: string;
  title: string;
  status: SignalStatus;
  metric: string;
  value: string;
  context: string;
  whyItMatters: string;
  nextStep: string;
  evidence: string[];
  icon: typeof TrendingUp;
}

interface Insight {
  id: string;
  title: string;
  answer: string;
  confidence: string;
  type: InsightType;
  icon: typeof TrendingUp;
  evidence: string[];
  followUps: string[];
}

interface EvidenceItem {
  title: string;
  source: string;
  date: string;
  detail: string;
  icon: typeof FileText;
}

interface ConversationItem {
  id: string;
  question: string;
  answer: Insight;
  timestamp: string;
}

const suggestedQuestions = [
  "What changed in my health recently?",
  "What should I discuss with my doctor?",
  "Which health signals should I watch?",
  "Prepare a clinical summary for my visit",
];

const decisionSignals: DecisionSignal[] = [
  {
    id: "heart-rate",
    title: "Resting heart rate",
    status: "improving",
    metric: "Current",
    value: "68 bpm",
    context:
      "Your recent resting heart rate is lower than the earlier tracked baseline of approximately 71 bpm.",
    whyItMatters:
      "A sustained change can provide useful context when reviewing activity, recovery and overall cardiovascular patterns.",
    nextStep:
      "Continue tracking and review the longer-term pattern with your clinician if the change persists or is accompanied by symptoms.",
    evidence: [
      "Current reading: 68 bpm",
      "Earlier baseline: approximately 71 bpm",
      "Recent readings show a gradual downward pattern",
    ],
    icon: TrendingDown,
  },
  {
    id: "blood-pressure",
    title: "Blood pressure",
    status: "stable",
    metric: "Recent",
    value: "118/76",
    context:
      "Recent blood pressure measurements remain close to the tracked baseline without a major directional change.",
    whyItMatters:
      "Stable measurements provide useful longitudinal context when considered alongside other health information.",
    nextStep:
      "Continue routine monitoring according to your existing care plan.",
    evidence: [
      "Recent reading: approximately 118/76 mmHg",
      "No major trend shift detected",
      "Multiple historical measurements available",
    ],
    icon: Activity,
  },
  {
    id: "glucose",
    title: "Fasting glucose",
    status: "watch",
    metric: "Current",
    value: "94 mg/dL",
    context:
      "Recent fasting glucose readings show mild upward movement compared with the earlier tracked average.",
    whyItMatters:
      "A repeated change may be useful context for a clinician, especially when considered with weight, diet, activity and other records.",
    nextStep:
      "Continue tracking and discuss the pattern with your clinician if it continues.",
    evidence: [
      "Current reading: 94 mg/dL",
      "Earlier tracked average: approximately 91–92 mg/dL",
      "Recent readings show mild variation",
    ],
    icon: AlertCircle,
  },
  {
    id: "weight",
    title: "Weight",
    status: "improving",
    metric: "Recent",
    value: "71.8 kg",
    context:
      "Your tracked weight has decreased from approximately 73.2 kg to 71.8 kg.",
    whyItMatters:
      "Weight trends can add context when reviewing metabolic health and other longitudinal measurements.",
    nextStep:
      "Continue observing the trend rather than focusing on a single measurement.",
    evidence: [
      "Current weight: 71.8 kg",
      "Earlier weight: approximately 73.2 kg",
      "Net tracked change: approximately −1.4 kg",
    ],
    icon: TrendingDown,
  },
];

const insights: Insight[] = [
  {
    id: "recent-change",
    title: "Your recent health pattern",
    answer:
      "Your recent records show a generally positive pattern. Resting heart rate and weight have moved downward gradually, while blood pressure has remained relatively stable. Fasting glucose shows a smaller upward movement that is worth watching.",
    confidence: "High confidence",
    type: "positive",
    icon: TrendingUp,
    evidence: [
      "Resting heart rate: 71 → 68 bpm",
      "Weight: 73.2 → 71.8 kg",
      "Blood pressure: approximately 118/76 mmHg",
      "Fasting glucose: 94 mg/dL",
    ],
    followUps: [
      "Which signals should I watch?",
      "Show my health trends",
      "What should I discuss with my doctor?",
    ],
  },
  {
    id: "doctor",
    title: "Doctor discussion points",
    answer:
      "Three useful discussion points emerge from the available data: the recent glucose movement, the continuing weight trend, and the change in resting heart rate. The value is in reviewing these patterns together rather than interpreting any single measurement in isolation.",
    confidence: "Moderate confidence",
    type: "neutral",
    icon: Stethoscope,
    evidence: [
      "Fasting glucose: 94 mg/dL",
      "Weight has decreased approximately 1.4 kg",
      "Resting heart rate has decreased approximately 3 bpm",
      "Blood pressure remains relatively stable",
    ],
    followUps: [
      "Prepare a clinical summary",
      "Show supporting records",
      "Show my health timeline",
    ],
  },
  {
    id: "watch",
    title: "Signals worth watching",
    answer:
      "The clearest attention signal is the recent fasting glucose movement. The available data does not indicate an immediate problem, but the direction is worth following over additional readings.",
    confidence: "Moderate confidence",
    type: "attention",
    icon: AlertCircle,
    evidence: [
      "Current fasting glucose: 94 mg/dL",
      "Earlier tracked average: approximately 91–92 mg/dL",
      "Recent measurements show mild variation",
    ],
    followUps: [
      "Show my glucose trend",
      "Compare my recent readings",
      "What should I discuss with my doctor?",
    ],
  },
];

const evidenceItems: EvidenceItem[] = [
  {
    title: "Health Trends",
    source: "HealthPassport Trends",
    date: "Today",
    detail:
      "Longitudinal measurements and detected directional patterns.",
    icon: TrendingUp,
  },
  {
    title: "Health Timeline",
    source: "HealthPassport Timeline",
    date: "Today",
    detail:
      "Chronological health events and contextual history.",
    icon: CalendarDays,
  },
  {
    title: "Medical Records",
    source: "Connected Records",
    date: "Recent",
    detail:
      "Reports, prescriptions and clinical documents.",
    icon: FileText,
  },
];

function resolveQuestion(question: string): Insight {
  const normalized = question.toLowerCase();

  if (
    normalized.includes("doctor") ||
    normalized.includes("clinical") ||
    normalized.includes("visit") ||
    normalized.includes("discuss") ||
    normalized.includes("summary")
  ) {
    return insights[1];
  }

  if (
    normalized.includes("watch") ||
    normalized.includes("signal") ||
    normalized.includes("risk") ||
    normalized.includes("attention") ||
    normalized.includes("glucose")
  ) {
    return insights[2];
  }

  return insights[0];
}

function getStatusLabel(status: SignalStatus) {
  switch (status) {
    case "improving":
      return "Improving";
    case "stable":
      return "Stable";
    case "watch":
      return "Watch";
    case "review":
      return "Review";
    default:
      return "Review";
  }
}

function getStatusClasses(status: SignalStatus) {
  switch (status) {
    case "improving":
      return {
        badge: "bg-emerald-50 text-emerald-700",
        icon: "bg-emerald-50 text-emerald-600",
        border: "border-emerald-100",
      };

    case "stable":
      return {
        badge: "bg-sky-50 text-sky-700",
        icon: "bg-sky-50 text-sky-600",
        border: "border-sky-100",
      };

    case "watch":
      return {
        badge: "bg-amber-50 text-amber-700",
        icon: "bg-amber-50 text-amber-600",
        border: "border-amber-100",
      };

    default:
      return {
        badge: "bg-rose-50 text-rose-700",
        icon: "bg-rose-50 text-rose-600",
        border: "border-rose-100",
      };
  }
}

function getInsightTone(type: InsightType) {
  switch (type) {
    case "positive":
      return {
        wrapper: "border-emerald-100 bg-emerald-50",
        icon: "bg-emerald-100 text-emerald-700",
        text: "text-emerald-900",
        badge: "bg-emerald-100 text-emerald-700",
      };

    case "attention":
      return {
        wrapper: "border-amber-100 bg-amber-50",
        icon: "bg-amber-100 text-amber-700",
        text: "text-amber-900",
        badge: "bg-amber-100 text-amber-700",
      };

    default:
      return {
        wrapper: "border-sky-100 bg-sky-50",
        icon: "bg-sky-100 text-sky-700",
        text: "text-sky-900",
        badge: "bg-sky-100 text-sky-700",
      };
  }
}

export default function AskHealthPassport({
  onNavigate,
}: AskHealthPassportProps) {
  const [question, setQuestion] = useState("");
  const [activeInsight, setActiveInsight] =
    useState<Insight>(insights[0]);

  const [selectedSignal, setSelectedSignal] =
    useState<DecisionSignal | null>(null);

  const [conversation, setConversation] =
    useState<ConversationItem[]>([]);

  const [showSources, setShowSources] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [clinicianMode, setClinicianMode] = useState(false);
  const [showAllSignals, setShowAllSignals] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const submitQuestion = (value: string) => {
    const cleanQuestion = value.trim();

    if (!cleanQuestion || isProcessing) {
      return;
    }

    setIsProcessing(true);

    window.setTimeout(() => {
      const answer = resolveQuestion(cleanQuestion);

      const item: ConversationItem = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        question: cleanQuestion,
        answer,
        timestamp: "Just now",
      };

      setConversation((current) => [
        ...current,
        item,
      ]);

      setActiveInsight(answer);
      setQuestion("");
      setIsProcessing(false);
    }, 220);
  };

  const currentInsight = activeInsight;
  const InsightIcon = currentInsight.icon;
  const insightTone = useMemo(
    () => getInsightTone(currentInsight.type),
    [currentInsight.type],
  );

  const visibleSignals = showAllSignals
    ? decisionSignals
    : decisionSignals.slice(0, 3);

  const latestQuestions = conversation.slice(-4).reverse();

  return (
    <div className="mx-auto max-w-[1280px] pb-8">
      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            <Sparkles size={14} />
            Health Intelligence
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Ask HealthPassport
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Understand what is changing, why it may matter, and
            what information could be useful to review with a
            clinician.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setClinicianMode((current) => !current)
            }
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${
              clinicianMode
                ? "border-violet-200 bg-violet-50 text-violet-700"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Stethoscope size={14} />

            {clinicianMode
              ? "Clinician View"
              : "Patient View"}
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            <ShieldCheck size={14} />
            Private by design
          </div>
        </div>
      </div>

      {/* HERO / ASK */}
      <section className="mb-7 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 shadow-sm sm:p-7">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
            <Sparkles size={25} />
          </div>

          <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
            {clinicianMode
              ? "Clinical context from your health record."
              : "Your health data, made understandable."}
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {clinicianMode
              ? "Review trends, context and discussion points in a compact clinician-friendly format."
              : "Ask questions about your health history and get simple, evidence-linked answers."}
          </p>

          <div className="relative mx-auto mt-6 max-w-3xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitQuestion(question);
                }
              }}
              placeholder="Ask something about your health..."
              aria-label="Ask HealthPassport a question"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-28 text-sm font-medium text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />

            <button
              type="button"
              onClick={() => submitQuestion(question)}
              disabled={!question.trim() || isProcessing}
              className="absolute right-2 top-2 inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isProcessing ? "Thinking..." : "Ask"}
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestedQuestions.slice(0, 3).map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submitQuestion(suggestion)}
                  className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {suggestion}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* DECISION SIGNALS */}
      <section className="mb-7">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Stethoscope
                size={15}
                className="text-violet-600"
              />

              <h2 className="text-sm font-black text-slate-900">
                Clinical context
              </h2>
            </div>

            <p className="max-w-2xl text-[11px] leading-5 text-slate-400">
              HealthPassport connects recent measurements into
              reviewable signals instead of treating each number
              independently.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
            <CheckCircle2
              size={13}
              className="text-emerald-500"
            />
            {decisionSignals.length} signals analyzed
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleSignals.map((signal) => {
            const SignalIcon = signal.icon;
            const classes = getStatusClasses(
              signal.status,
            );

            return (
              <button
                key={signal.id}
                type="button"
                onClick={() => setSelectedSignal(signal)}
                className={`group rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${classes.border}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${classes.icon}`}
                  >
                    <SignalIcon size={17} />
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-black ${classes.badge}`}
                  >
                    {getStatusLabel(signal.status)}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-slate-800">
                      {signal.title}
                    </div>

                    <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {signal.metric}
                    </div>
                  </div>

                  <div className="text-lg font-black text-slate-950">
                    {signal.value}
                  </div>
                </div>

                <p className="mt-3 line-clamp-3 text-[10px] leading-5 text-slate-500">
                  {signal.context}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[9px] font-bold text-violet-600">
                    Why this matters
                  </span>

                  <ChevronRight
                    size={14}
                    className="text-slate-300 transition group-hover:text-violet-500"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {decisionSignals.length > 3 && (
          <button
            type="button"
            onClick={() =>
              setShowAllSignals((current) => !current)
            }
            className="mx-auto mt-4 flex items-center gap-1 text-[10px] font-bold text-violet-600 hover:text-violet-700"
          >
            {showAllSignals
              ? "Show fewer signals"
              : "Show all signals"}

            <ChevronDown
              size={13}
              className={`transition-transform ${
                showAllSignals ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </section>

      {/* INSIGHT */}
      <section className="mb-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              {clinicianMode ? (
                <Stethoscope size={18} />
              ) : (
                <Sparkles size={18} />
              )}
            </div>

            <div>
              <h2 className="font-black text-slate-950">
                {clinicianMode
                  ? "Clinician-ready interpretation"
                  : "HealthPassport Insight"}
              </h2>

              <p className="text-[10px] text-slate-400">
                {clinicianMode
                  ? "Concise context for a health review"
                  : "Based on your available health data"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDisclaimer(true)}
            className="inline-flex items-center gap-1.5 self-start rounded-lg px-2 py-1 text-[10px] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 sm:self-auto"
          >
            <Info size={13} />
            About insights
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {clinicianMode ? (
            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <div className="mb-3 text-[10px] font-black uppercase tracking-wider text-violet-600">
                  Clinical interpretation
                </div>

                <p className="text-sm leading-7 text-slate-700">
                  The available longitudinal data shows an
                  overall favorable pattern in resting heart
                  rate and weight, with relatively stable blood
                  pressure. Fasting glucose shows mild upward
                  movement and may be useful to follow across
                  additional measurements.
                </p>

                <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-violet-600"
                    />

                    <div>
                      <div className="text-xs font-black text-violet-900">
                        Suggested discussion
                      </div>

                      <p className="mt-1 text-[11px] leading-5 text-violet-800/80">
                        Review the glucose direction alongside
                        recent weight, activity, diet and any
                        relevant clinical history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Quick clinical snapshot
                </div>

                <div className="space-y-2">
                  {decisionSignals.map((signal) => {
                    const classes = getStatusClasses(
                      signal.status,
                    );

                    return (
                      <div
                        key={signal.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                      >
                        <div className="text-[10px] font-semibold text-slate-600">
                          {signal.title}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-800">
                            {signal.value}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[8px] font-black ${classes.badge}`}
                          >
                            {getStatusLabel(signal.status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-2xl border p-5 ${insightTone.wrapper}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${insightTone.icon}`}
                >
                  <InsightIcon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-black ${insightTone.text}`}
                    >
                      {currentInsight.title}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-black ${insightTone.badge}`}
                    >
                      {currentInsight.confidence}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {currentInsight.answer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* EVIDENCE */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Evidence trail
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  Trace observations back to the underlying
                  HealthPassport data.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSources((current) => !current)
                }
                className="shrink-0 text-[10px] font-bold text-violet-600 hover:text-violet-700"
              >
                {showSources
                  ? "Hide sources"
                  : "View sources"}
              </button>
            </div>

            <div className="space-y-2">
              {currentInsight.evidence.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-emerald-500"
                  />

                  <span className="text-xs font-medium text-slate-600">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {showSources && (
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {evidenceItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                        <Icon size={15} />
                      </div>

                      <span className="text-[9px] font-bold text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    <div className="mt-3 text-xs font-black text-slate-800">
                      {item.title}
                    </div>

                    <div className="mt-1 text-[10px] text-violet-600">
                      {item.source}
                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-slate-400">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* FOLLOW UPS */}
          <div className="mt-7">
            <div className="mb-3 flex items-center gap-2">
              <MessageCircle
                size={15}
                className="text-violet-500"
              />

              <h3 className="text-xs font-black text-slate-800">
                Explore further
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentInsight.followUps.map((followUp) => (
                <button
                  key={followUp}
                  type="button"
                  onClick={() => submitQuestion(followUp)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {followUp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUGGESTED QUESTIONS */}
      <section className="mb-7">
        <div className="mb-3">
          <h2 className="text-sm font-black text-slate-900">
            Suggested questions
          </h2>

          <p className="mt-1 text-[10px] text-slate-400">
            Explore your health data with one tap.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {suggestedQuestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => submitQuestion(suggestion)}
              className="group flex min-h-[82px] items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-200 hover:bg-violet-50/40 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <MessageCircle size={15} />
                </div>

                <span className="text-xs font-semibold leading-5 text-slate-700">
                  {suggestion}
                </span>
              </div>

              <ChevronRight
                size={15}
                className="shrink-0 text-slate-300 transition group-hover:text-violet-500"
              />
            </button>
          ))}
        </div>
      </section>

      {/* SESSION + NAVIGATION */}
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Clock3 size={16} />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-900">
                Your questions
              </h2>

              <p className="text-[10px] text-slate-400">
                This session
              </p>
            </div>
          </div>

          {latestQuestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <MessageCircle
                size={20}
                className="mx-auto text-slate-300"
              />

              <p className="mt-2 text-xs font-semibold text-slate-500">
                No questions yet
              </p>

              <p className="mt-1 text-[10px] leading-5 text-slate-400">
                Ask anything about your health data.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {latestQuestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveInsight(item.answer)
                  }
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-violet-100 hover:bg-violet-50/40"
                >
                  <div className="flex items-start gap-2">
                    <UserRound
                      size={13}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[10px] font-semibold leading-5 text-slate-600">
                        {item.question}
                      </span>

                      <span className="mt-1 block text-[9px] font-medium text-slate-400">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-black text-slate-900">
              Explore your health
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              Jump directly to supporting HealthPassport views.
            </p>
          </div>

          <div className="space-y-2">
            {[
              {
                label: "Health Summary",
                page: "summary" as Page,
              },
              {
                label: "Health Trends",
                page: "trends" as Page,
              },
              {
                label: "Health Timeline",
                page: "timeline" as Page,
              },
              {
                label: "Medical Records",
                page: "records" as Page,
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.page)}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-left hover:border-violet-100 hover:bg-violet-50"
              >
                <span className="text-[10px] font-bold text-slate-600">
                  {item.label}
                </span>

                <ChevronRight
                  size={14}
                  className="text-slate-300 group-hover:text-violet-500"
                />
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* TRUST FOOTER */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] text-slate-400">
        <ShieldCheck
          size={13}
          className="text-emerald-500"
        />
        <span>
          HealthPassport intelligence is grounded in available
          patient data.
        </span>
      </div>

      {/* SIGNAL DETAIL MODAL */}
      {selectedSignal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedSignal.title} details`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedSignal(null);
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    getStatusClasses(selectedSignal.status)
                      .icon
                  }`}
                >
                  {(() => {
                    const SignalIcon =
                      selectedSignal.icon;

                    return <SignalIcon size={20} />;
                  })()}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-slate-950">
                      {selectedSignal.title}
                    </h2>

                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-black ${
                        getStatusClasses(
                          selectedSignal.status,
                        ).badge
                      }`}
                    >
                      {getStatusLabel(
                        selectedSignal.status,
                      )}
                    </span>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {selectedSignal.metric} ·{" "}
                    {selectedSignal.value}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSignal(null)}
                aria-label="Close signal details"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <div className="mb-2 text-[10px] font-black uppercase tracking-wider text-violet-600">
                  What changed
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  {selectedSignal.context}
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex items-start gap-3">
                  <Info
                    size={16}
                    className="mt-0.5 shrink-0 text-sky-600"
                  />

                  <div>
                    <div className="text-xs font-black text-sky-900">
                      Why this matters
                    </div>

                    <p className="mt-1 text-[11px] leading-5 text-sky-800/80">
                      {selectedSignal.whyItMatters}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Supporting evidence
                </div>

                <div className="space-y-2">
                  {selectedSignal.evidence.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5"
                    >
                      <CheckCircle2
                        size={14}
                        className="shrink-0 text-emerald-500"
                      />

                      <span className="text-[10px] font-semibold text-slate-600">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <div className="flex items-start gap-3">
                  <Stethoscope
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-600"
                  />

                  <div>
                    <div className="text-xs font-black text-violet-900">
                      Suggested next step
                    </div>

                    <p className="mt-1 text-[11px] leading-5 text-violet-800/80">
                      {selectedSignal.nextStep}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSignal(null);
                    onNavigate("trends");
                  }}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  View health trends
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSignal(null);
                    submitQuestion(
                      "What should I discuss with my doctor?",
                    );
                  }}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white hover:bg-violet-700"
                >
                  Ask HealthPassport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISCLAIMER */}
      {showDisclaimer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="About HealthPassport Intelligence"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDisclaimer(false);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Info size={18} />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">
                    About HealthPassport Intelligence
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Transparent, evidence-linked decision support
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDisclaimer(false)}
                aria-label="Close information"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-xs leading-6 text-slate-600">
              <p>
                HealthPassport Intelligence organizes available
                health information into patterns, context and
                discussion points.
              </p>

              <p>
                Signals are designed to help patients and
                clinicians review longitudinal information more
                efficiently. They should not be interpreted as
                diagnoses.
              </p>

              <p>
                This investor-demo POC uses illustrative
                frontend data and does not provide medical advice
                or replace professional clinical judgment.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDisclaimer(false)}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}