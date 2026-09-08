import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  Filter,
  FlaskConical,
  HeartPulse,
  Hospital,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  Syringe,
  X,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";

interface HealthTimelineProps {
  onNavigate: (page: Page) => void;
}

type TimelineCategory =
  | "All"
  | "Consultation"
  | "Lab"
  | "Medication"
  | "Hospital"
  | "Vaccination"
  | "Procedure";

interface TimelineEvent {
  id: number;
  date: string;
  month: string;
  title: string;
  description: string;
  category: Exclude<TimelineCategory, "All">;
  provider: string;
  source: string;
  status: "AI Analysed" | "Verified";
  icon: typeof Stethoscope;
  color: string;
  highlight?: boolean;
}

const events: TimelineEvent[] = [
  {
    id: 1,
    date: "28 Aug 2026",
    month: "AUG 2026",
    title: "Complete Blood Count",
    description:
      "Routine laboratory testing with haemoglobin, glucose and lipid measurements.",
    category: "Lab",
    provider: "CityCare Diagnostics",
    source: "Complete Blood Count.pdf",
    status: "AI Analysed",
    icon: FlaskConical,
    color: "sky",
    highlight: true,
  },
  {
    id: 2,
    date: "15 Aug 2026",
    month: "AUG 2026",
    title: "Diabetes Consultation",
    description:
      "Follow-up consultation reviewing glucose control and current medication.",
    category: "Consultation",
    provider: "Dr. Priya Sharma",
    source: "Consultation Note.pdf",
    status: "Verified",
    icon: Stethoscope,
    color: "violet",
  },
  {
    id: 3,
    date: "15 Aug 2026",
    month: "AUG 2026",
    title: "Metformin 500 mg",
    description:
      "Medication continued as part of the current diabetes management plan.",
    category: "Medication",
    provider: "Dr. Priya Sharma",
    source: "Prescription.pdf",
    status: "AI Analysed",
    icon: Pill,
    color: "emerald",
  },
  {
    id: 4,
    date: "18 Jun 2026",
    month: "JUN 2026",
    title: "Hospital Discharge",
    description:
      "Discharge summary recorded following hospital care and observation.",
    category: "Hospital",
    provider: "Manipal Hospital",
    source: "Discharge Summary.pdf",
    status: "Verified",
    icon: Hospital,
    color: "amber",
  },
  {
    id: 5,
    date: "12 May 2026",
    month: "MAY 2026",
    title: "COVID-19 Vaccination",
    description:
      "Vaccination record added to the longitudinal health history.",
    category: "Vaccination",
    provider: "CityCare Clinic",
    source: "Vaccination Certificate.pdf",
    status: "AI Analysed",
    icon: Syringe,
    color: "cyan",
  },
  {
    id: 6,
    date: "22 Mar 2026",
    month: "MAR 2026",
    title: "Appendectomy",
    description:
      "Surgical procedure recorded in the patient's medical history.",
    category: "Procedure",
    provider: "Manipal Hospital",
    source: "Surgical Record.pdf",
    status: "Verified",
    icon: HeartPulse,
    color: "rose",
  },
];

const categories: TimelineCategory[] = [
  "All",
  "Consultation",
  "Lab",
  "Medication",
  "Hospital",
  "Vaccination",
  "Procedure",
];

function colorClasses(color: string) {
  const map: Record<
    string,
    {
      icon: string;
      dot: string;
      badge: string;
      glow: string;
    }
  > = {
    sky: {
      icon: "bg-sky-50 text-sky-600",
      dot: "bg-sky-500",
      badge: "bg-sky-50 text-sky-700",
      glow: "shadow-sky-100",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      dot: "bg-violet-500",
      badge: "bg-violet-50 text-violet-700",
      glow: "shadow-violet-100",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      dot: "bg-emerald-500",
      badge: "bg-emerald-50 text-emerald-700",
      glow: "shadow-emerald-100",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      dot: "bg-amber-500",
      badge: "bg-amber-50 text-amber-700",
      glow: "shadow-amber-100",
    },
    cyan: {
      icon: "bg-cyan-50 text-cyan-600",
      dot: "bg-cyan-500",
      badge: "bg-cyan-50 text-cyan-700",
      glow: "shadow-cyan-100",
    },
    rose: {
      icon: "bg-rose-50 text-rose-600",
      dot: "bg-rose-500",
      badge: "bg-rose-50 text-rose-700",
      glow: "shadow-rose-100",
    },
  };

  return map[color] ?? map.sky;
}

export default function HealthTimeline({
  onNavigate,
}: HealthTimelineProps) {
  const [activeCategory, setActiveCategory] =
    useState<TimelineCategory>("All");

  const [search, setSearch] = useState("");

  const [selectedEvent, setSelectedEvent] =
    useState<TimelineEvent | null>(null);

  const [showFilters, setShowFilters] =
    useState(false);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return events.filter((event) => {
      const categoryMatch =
        activeCategory === "All" ||
        event.category === activeCategory;

      const searchMatch =
        !normalizedSearch ||
        `${event.title} ${event.provider} ${event.description} ${event.category}`
          .toLowerCase()
          .includes(normalizedSearch);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};

    filteredEvents.forEach((event) => {
      if (!groups[event.month]) {
        groups[event.month] = [];
      }

      groups[event.month].push(event);
    });

    return Object.entries(groups);
  }, [filteredEvents]);

  return (
    <div className="hp-page-enter mx-auto max-w-[1450px] space-y-5">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={16} />
            </div>

            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-500">
              Longitudinal Health
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
            Health Timeline
          </h1>

          <p className="mt-1 max-w-2xl text-[12px] leading-5 text-slate-500 sm:text-sm sm:leading-6">
            One connected timeline for your consultations, tests,
            treatments, procedures and important health events.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate("summary")}
            className="hp-secondary-btn"
          >
            <HeartPulse size={15} />
            Health Summary
          </button>

          <button
            type="button"
            onClick={() => onNavigate("records")}
            className="hp-primary-btn"
          >
            <FileText size={15} />
            Medical Records
          </button>
        </div>
      </div>

      {/* =====================================================
          TIMELINE HERO
          ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 p-5 text-white shadow-card sm:p-7">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />

              <span className="text-[8px] font-black uppercase tracking-[0.15em] text-blue-100">
                Connected health history
              </span>
            </div>

            <h2 className="mt-4 max-w-2xl text-xl font-black sm:text-2xl">
              Every important health event,
              <br className="hidden sm:block" />
              connected in context.
            </h2>

            <p className="mt-3 max-w-2xl text-[11px] leading-5 text-blue-100 sm:text-[12px]">
              HealthPassport brings information from different
              healthcare moments into one chronological view,
              making it easier to understand what happened and
              when.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] font-bold text-white">
                {events.length} major events
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] font-bold text-white">
                100% source linked
              </span>

              <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[8px] font-black text-emerald-100">
                <ShieldCheck
                  size={10}
                  className="mr-1 inline"
                />
                Traceable
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-blue-200">
              Latest activity
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <FlaskConical size={19} />
              </div>

              <div>
                <p className="text-[12px] font-black">
                  Complete Blood Count
                </p>

                <p className="mt-1 text-[9px] text-blue-100">
                  28 Aug 2026 · CityCare Diagnostics
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEvent(events[0])}
              className="mt-5 flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 text-[9px] font-black transition hover:bg-white/15"
            >
              View latest event
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Activity}
          label="Health Events"
          value="24"
          detail="Across your history"
        />

        <SummaryCard
          icon={CalendarDays}
          label="Latest Activity"
          value="28 Aug"
          detail="Complete Blood Count"
        />

        <SummaryCard
          icon={FlaskConical}
          label="Lab Results"
          value="12"
          detail="Structured observations"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Source Linked"
          value="100%"
          detail="Traceable health data"
        />
      </div>

      {/* =====================================================
          SEARCH + FILTERS
          ===================================================== */}
      <section className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search health history..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-[11px] font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-[10px] font-black transition ${
                showFilters
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">
                Filters
              </span>
            </button>
          </div>

          <div
            className={`overflow-x-auto transition ${
              showFilters
                ? "max-h-20 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex min-w-max items-center gap-2 pt-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-[9px] font-black transition ${
                    activeCategory === category
                      ? "bg-blue-950 text-white shadow-sm"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {!showFilters && (
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-slate-400">
                Showing
              </span>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(true)
                }
                className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[9px] font-black text-blue-700"
              >
                {activeCategory}
              </button>

              <span className="shrink-0 text-[9px] text-slate-400">
                · {filteredEvents.length} events
              </span>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          TIMELINE
          ===================================================== */}
      <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-card sm:p-7">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-500">
              Chronological record
            </p>

            <h2 className="mt-1 text-lg font-black text-blue-950">
              Your health journey
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              {filteredEvents.length} event
              {filteredEvents.length === 1 ? "" : "s"} shown
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
            <CheckCircle2
              size={13}
              className="text-emerald-500"
            />

            <span className="text-[9px] font-black text-emerald-700">
              Source traceability enabled
            </span>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 py-16 text-center">
            <Search
              size={28}
              className="mx-auto text-slate-300"
            />

            <div className="mt-3 text-sm font-black text-slate-600">
              No health events found
            </div>

            <div className="mt-1 text-[10px] text-slate-400">
              Try another search term or timeline category.
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-4 rounded-xl bg-white px-4 py-2 text-[9px] font-black text-blue-600 shadow-sm"
            >
              Reset timeline
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute bottom-8 left-[19px] top-8 w-px bg-gradient-to-b from-blue-200 via-slate-200 to-transparent" />

            <div className="space-y-9">
              {groupedEvents.map(
                ([month, monthEvents]) => (
                  <div key={month}>
                    {/* Month marker */}
                    <div className="relative z-20 mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-[8px] font-black text-white ring-8 ring-white">
                        {month.split(" ")[0].slice(0, 3)}
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-800">
                          {month}
                        </p>

                        <p className="mt-0.5 text-[8px] text-slate-400">
                          {monthEvents.length} event
                          {monthEvents.length === 1
                            ? ""
                            : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pl-0">
                      {monthEvents.map((event) => {
                        const Icon = event.icon;
                        const colors = colorClasses(
                          event.color,
                        );

                        return (
                          <div
                            key={event.id}
                            className="relative flex gap-4"
                          >
                            <div
                              className={`relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.icon} ring-8 ring-white`}
                            >
                              <Icon size={17} />
                            </div>

                            <div
                              className={`min-w-0 flex-1 rounded-2xl border p-4 transition ${
                                event.highlight
                                  ? "border-blue-100 bg-blue-50/40 shadow-sm"
                                  : "border-slate-100 bg-slate-50/60 hover:border-sky-100 hover:bg-white hover:shadow-sm"
                              }`}
                            >
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-[12px] font-black text-slate-800">
                                      {event.title}
                                    </h3>

                                    <span
                                      className={`rounded-lg px-2 py-1 text-[8px] font-black ${colors.badge}`}
                                    >
                                      {event.category}
                                    </span>

                                    {event.highlight && (
                                      <span className="rounded-lg bg-blue-600 px-2 py-1 text-[8px] font-black text-white">
                                        Latest
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-bold text-slate-400">
                                    <span>
                                      {event.date}
                                    </span>

                                    <span>·</span>

                                    <span>
                                      {event.provider}
                                    </span>
                                  </div>

                                  <p className="mt-3 max-w-2xl text-[10px] leading-5 text-slate-500">
                                    {event.description}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedEvent(
                                      event,
                                    )
                                  }
                                  className="flex shrink-0 items-center gap-1 text-[9px] font-black text-blue-600"
                                >
                                  Details
                                  <ChevronRight
                                    size={13}
                                  />
                                </button>
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                                <span className="max-w-full truncate rounded-lg bg-white px-2.5 py-1.5 text-[8px] font-semibold text-slate-500 shadow-sm">
                                  Source: {event.source}
                                </span>

                                <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[8px] font-black text-emerald-700">
                                  <CheckCircle2 size={10} />
                                  {event.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          CONNECTED HEALTH STORY
          ===================================================== */}
      <section className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_330px] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <HeartPulse size={15} />
              </div>

              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-500">
                Longitudinal insight
              </span>
            </div>

            <h2 className="mt-3 text-lg font-black text-blue-950">
              Your health story is becoming more connected.
            </h2>

            <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-500">
              When consultations, laboratory observations,
              prescriptions and hospital records are viewed
              together, changes over time become easier to
              understand in context.
            </p>
          </div>

          <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingIcon />
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-800">
                  Continue exploring
                </p>

                <p className="mt-1 text-[8px] text-slate-400">
                  Compare health measurements over time.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("trends")}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-blue-50 px-3 py-2.5 text-[9px] font-black text-blue-700 transition hover:bg-blue-100"
            >
              Explore Health Trends
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          DETAIL MODAL
          ===================================================== */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-50 px-2 py-1 text-[8px] font-black uppercase text-blue-600">
                    Timeline Event
                  </span>

                  <span className="text-[8px] font-bold text-slate-400">
                    {selectedEvent.date}
                  </span>
                </div>

                <h2 className="mt-2 text-lg font-black text-blue-950">
                  {selectedEvent.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedEvent(null)
                }
                className="hp-icon-btn"
                aria-label="Close event details"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              <DetailRow
                label="Category"
                value={selectedEvent.category}
              />

              <DetailRow
                label="Provider"
                value={selectedEvent.provider}
              />

              <DetailRow
                label="Source record"
                value={selectedEvent.source}
              />

              <DetailRow
                label="Data status"
                value={selectedEvent.status}
              />

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Event context
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-600">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-sky-800">
                  <ShieldCheck size={14} />
                  Source traceability
                </div>

                <p className="mt-2 text-[9px] leading-4 text-sky-700">
                  This timeline event is linked to its originating
                  medical record so the source can be reviewed.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedEvent(null);
                  onNavigate("records");
                }}
                className="hp-primary-btn w-full justify-center"
              >
                Open Medical Records
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={16} />
        </div>

        <span className="text-[8px] font-black uppercase tracking-wider text-slate-300">
          HealthPassport
        </span>
      </div>

      <div className="mt-4 text-2xl font-black tracking-tight text-blue-950">
        {value}
      </div>

      <div className="mt-1 text-[10px] font-black text-slate-600">
        {label}
      </div>

      <div className="mt-1 text-[8px] font-medium text-slate-400">
        {detail}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 rounded-xl bg-slate-50 p-3">
      <span className="text-[9px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <span className="text-right text-[10px] font-black text-slate-700">
        {value}
      </span>
    </div>
  );
}

function TrendingIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  );
}