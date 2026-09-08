import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserRound,
  X,
} from "lucide-react";

interface HealthOverviewProps {
  onNavigate: (page: any) => void;
}

type Section =
  | "conditions"
  | "medications"
  | "allergies"
  | "vaccinations"
  | "procedures"
  | "providers";

interface HealthItem {
  id: number;
  name: string;
  subtitle: string;
  status?: string;
  date?: string;
  source?: string;
  icon: any;
}

const conditions: HealthItem[] = [
  {
    id: 1,
    name: "Type 2 Diabetes",
    subtitle: "Active condition",
    status: "Active",
    date: "Diagnosed Aug 2024",
    source: "Diabetes Consultation",
    icon: Activity,
  },
  {
    id: 2,
    name: "Vitamin D Deficiency",
    subtitle: "Under monitoring",
    status: "Monitoring",
    date: "Identified Mar 2025",
    source: "Complete Blood Count",
    icon: HeartPulse,
  },
  {
    id: 3,
    name: "Hypertension",
    subtitle: "Historical condition",
    status: "Controlled",
    date: "Diagnosed Jan 2023",
    source: "Consultation Record",
    icon: ShieldCheck,
  },
];

const medications: HealthItem[] = [
  {
    id: 1,
    name: "Metformin 500 mg",
    subtitle: "Twice daily",
    status: "Current",
    date: "Since Aug 2024",
    source: "Prescription — 15 Aug 2026",
    icon: Pill,
  },
  {
    id: 2,
    name: "Vitamin D3",
    subtitle: "60,000 IU weekly",
    status: "Current",
    date: "Since Mar 2025",
    source: "Prescription — 15 Aug 2026",
    icon: Pill,
  },
  {
    id: 3,
    name: "Amlodipine 5 mg",
    subtitle: "Once daily",
    status: "Current",
    date: "Since Jan 2023",
    source: "Prescription history",
    icon: Pill,
  },
];

const allergies: HealthItem[] = [
  {
    id: 1,
    name: "Penicillin",
    subtitle: "Drug allergy",
    status: "Important",
    date: "Recorded Aug 2024",
    source: "Patient history",
    icon: AlertCircle,
  },
  {
    id: 2,
    name: "Dust",
    subtitle: "Environmental allergy",
    status: "Mild",
    date: "Recorded 2023",
    source: "Consultation Record",
    icon: AlertCircle,
  },
];

const vaccinations: HealthItem[] = [
  {
    id: 1,
    name: "COVID-19",
    subtitle: "Booster dose",
    status: "Completed",
    date: "12 Jan 2026",
    source: "Vaccination Certificate",
    icon: Syringe,
  },
  {
    id: 2,
    name: "Influenza",
    subtitle: "Annual vaccine",
    status: "Completed",
    date: "18 Oct 2025",
    source: "Vaccination Certificate",
    icon: Syringe,
  },
];

const procedures: HealthItem[] = [
  {
    id: 1,
    name: "Appendectomy",
    subtitle: "Surgical procedure",
    status: "Completed",
    date: "18 Jun 2022",
    source: "Discharge Summary",
    icon: Stethoscope,
  },
];

const providers: HealthItem[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    subtitle: "Internal Medicine",
    status: "Primary",
    date: "Last visit 15 Aug 2026",
    source: "Diabetes Consultation",
    icon: UserRound,
  },
  {
    id: 2,
    name: "CityCare Diagnostics",
    subtitle: "Diagnostic Laboratory",
    status: "Laboratory",
    date: "Last test 28 Aug 2026",
    source: "Complete Blood Count",
    icon: Activity,
  },
  {
    id: 3,
    name: "Manipal Hospital",
    subtitle: "Hospital",
    status: "Hospital",
    date: "Last admission Jun 2026",
    source: "Discharge Summary",
    icon: Stethoscope,
  },
];

const sectionData: Record<Section, HealthItem[]> = {
  conditions,
  medications,
  allergies,
  vaccinations,
  procedures,
  providers,
};

const sectionTitles: Record<Section, string> = {
  conditions: "Conditions",
  medications: "Medications",
  allergies: "Allergies",
  vaccinations: "Vaccinations",
  procedures: "Procedures",
  providers: "Healthcare Providers",
};

function SectionCard({
  title,
  count,
  icon: Icon,
  items,
  section,
  onOpen,
}: {
  title: string;
  count: number;
  icon: any;
  items: HealthItem[];
  section: Section;
  onOpen: (section: Section) => void;
}) {
  return (
    <button
      onClick={() => onOpen(section)}
      className="group w-full rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>

            <p className="mt-0.5 text-xs text-slate-500">
              {count} {count === 1 ? "entry" : "entries"}
            </p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
      </div>

      <div className="mt-5 space-y-3">
        {items.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.subtitle}
                </p>
              </div>

              {item.status && (
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
                  {item.status}
                </span>
              )}
            </div>
          </div>
        ))}

        {items.length > 2 && (
          <p className="pt-1 text-xs font-medium text-slate-500">
            +{items.length - 2} more
          </p>
        )}
      </div>
    </button>
  );
}

export default function HealthOverview({
  onNavigate,
}: HealthOverviewProps) {
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [showHealthFact, setShowHealthFact] = useState(false);

  const totalEntries = useMemo(
    () =>
      Object.values(sectionData).reduce(
        (total, items) => total + items.length,
        0
      ),
    []
  );

  const activeItems = activeSection
    ? sectionData[activeSection]
    : [];

  return (
    <div className="min-h-full bg-slate-50/70">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="px-6 py-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Health Graph
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                My Health
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Your structured health history, connected to the medical
                records that support it.
              </p>
            </div>

            <button
              onClick={() => setShowHealthFact(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
            >
              <HeartPulse className="h-4 w-4" />
              Add Health Fact
            </button>
          </div>
        </div>
      </div>

      <main className="space-y-6 p-6 lg:p-8">
        {/* HEALTH SNAPSHOT */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-2xl">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Health Snapshot
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Arjun Rao
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Patient ID · HP-2026-00128
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-2xl font-bold">
                    {totalEntries}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Health entries
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-2xl font-bold">4</p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Recent records
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-2xl font-bold">96%</p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    AI confidence
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-2xl font-bold">100%</p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Source linked
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              <button
                onClick={() => setActiveSection("conditions")}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-rose-300" />

                  <div>
                    <p className="text-sm font-semibold">
                      Active condition
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Type 2 Diabetes
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveSection("medications")}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-violet-300" />

                  <div>
                    <p className="text-sm font-semibold">
                      Current medicines
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      3 active medications
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveSection("allergies")}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-300" />

                  <div>
                    <p className="text-sm font-semibold">
                      Important allergy
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Penicillin
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION HEADER */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your health graph
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Structured information extracted from your medical history.
            </p>
          </div>

          <button
            onClick={() => onNavigate("records")}
            className="hidden items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950 sm:flex"
          >
            View source records
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* HEALTH GRAPH CARDS */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SectionCard
            title="Conditions"
            count={conditions.length}
            icon={Activity}
            items={conditions}
            section="conditions"
            onOpen={setActiveSection}
          />

          <SectionCard
            title="Medications"
            count={medications.length}
            icon={Pill}
            items={medications}
            section="medications"
            onOpen={setActiveSection}
          />

          <SectionCard
            title="Allergies"
            count={allergies.length}
            icon={AlertCircle}
            items={allergies}
            section="allergies"
            onOpen={setActiveSection}
          />

          <SectionCard
            title="Vaccinations"
            count={vaccinations.length}
            icon={Syringe}
            items={vaccinations}
            section="vaccinations"
            onOpen={setActiveSection}
          />

          <SectionCard
            title="Procedures"
            count={procedures.length}
            icon={Stethoscope}
            items={procedures}
            section="procedures"
            onOpen={setActiveSection}
          />

          <SectionCard
            title="Healthcare Providers"
            count={providers.length}
            icon={UserRound}
            items={providers}
            section="providers"
            onOpen={setActiveSection}
          />
        </div>

        {/* SOURCE TRACEABILITY */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Source-linked health information
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Structured health facts shown here are linked to supporting
                  medical records. This keeps the health graph traceable back
                  to its original source.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("records")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FileText className="h-4 w-4" />
              Open Records
            </button>
          </div>
        </section>

        {/* TIMELINE */}
        <button
          onClick={() => onNavigate("timeline")}
          className="group flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Calendar className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Explore your Health Timeline
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                See consultations, tests, admissions, procedures and major
                health events chronologically.
              </p>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
        </button>
      </main>

      {/* DETAIL DRAWER */}
      {activeSection && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-sm">
          <button
            aria-label="Close"
            className="absolute inset-0 cursor-default"
            onClick={() => setActiveSection(null)}
          />

          <aside className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Health Graph
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    {sectionTitles[activeSection]}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveSection(null)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-6">
              {activeItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {item.subtitle}
                            </p>
                          </div>

                          {item.status && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {item.status}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CircleDot className="h-3.5 w-3.5" />
                            {item.date}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FileText className="h-3.5 w-3.5" />
                            Source: {item.source}
                          </div>
                        </div>

                        <button
                          onClick={() => onNavigate("records")}
                          className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-slate-950"
                        >
                          View supporting record
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* ADD HEALTH FACT */}
      {showHealthFact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                  Health Graph
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Add a health fact
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add or review structured health information.
                </p>
              </div>

              <button
                onClick={() => setShowHealthFact(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Condition", Activity],
                ["Medication", Pill],
                ["Allergy", AlertCircle],
                ["Vaccination", Syringe],
              ].map(([label, Icon]: any) => (
                <button
                  key={label}
                  onClick={() => {
                    setShowHealthFact(false);

                    const sectionMap: Record<string, Section> = {
                      Condition: "conditions",
                      Medication: "medications",
                      Allergy: "allergies",
                      Vaccination: "vaccinations",
                    };

                    setActiveSection(sectionMap[label]);
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>

                  <span className="text-sm font-semibold text-slate-800">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
              In this frontend POC, health facts are simulated. Production
              data should remain connected to the supporting medical record
              and its provenance.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}