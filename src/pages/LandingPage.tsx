import {
  ArrowRight,
  Brain,
  FileHeart,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";

interface LandingPageProps {
  onEnterDemo: () => void;
}

function LandingPage({ onEnterDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[8rem] h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[35%] h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
              <FileHeart className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Health<span className="text-cyan-300">Passport</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                V3  Demo
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onEnterDemo}
            className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10 sm:flex"
          >
            Enter Demo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3.5 py-2 text-xs font-semibold text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                One longitudinal health record
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Your health.
                <br />
                <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  One passport.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
                Bring your medical records, medications, lab results,
                conditions and health insights together in one secure,
                patient-controlled health passport.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onEnterDemo}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:bg-cyan-50"
                >
                  View Demo Health Passport
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  Privacy-first by design
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Medical records
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  AI insights
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Health trends
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Emergency Passport
                </span>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-cyan-400/5 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.055] p-3 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5">
                  {/* Preview top */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10">
                        <FileHeart className="h-5 w-5 text-cyan-300" />
                      </div>

                      <div>
                        <div className="text-sm font-bold">HealthPassport</div>
                        <div className="text-xs text-slate-500">
                          Personal health intelligence
                        </div>
                      </div>
                    </div>

                    <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                      SECURE
                    </div>
                  </div>

                  {/* Patient */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-500">
                          PATIENT
                        </div>
                        <div className="mt-1 text-xl font-bold">
                          Arjun Rao
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          42 years · O+ · Health Passport
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-cyan-200">
                        AR
                      </div>
                    </div>
                  </div>

                  {/* Health cards */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <TrendingUp className="h-3.5 w-3.5 text-cyan-300" />
                        HbA1c
                      </div>
                      <div className="mt-2 text-2xl font-bold">6.8%</div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        Latest result
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Brain className="h-3.5 w-3.5 text-cyan-300" />
                        AI Insight
                      </div>
                      <div className="mt-2 text-sm font-bold">
                        3 insights
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        Ready to review
                      </div>
                    </div>
                  </div>

                  {/* Timeline preview */}
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-300">
                        Longitudinal health record
                      </div>
                      <span className="text-[10px] text-cyan-300">
                        LIVE VIEW
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        ["28 Aug 2026", "CBC report added"],
                        ["15 Aug 2026", "Diabetes consultation"],
                        ["02 Jul 2026", "HbA1c recorded"],
                      ].map(([date, event]) => (
                        <div
                          key={`${date}-${event}`}
                          className="flex items-center gap-3"
                        >
                          <div className="h-2 w-2 rounded-full bg-cyan-300" />
                          <div className="flex-1 text-xs text-slate-400">
                            {event}
                          </div>
                          <div className="text-[10px] text-slate-600">
                            {date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QR */}
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                        <QrCode className="h-4 w-4 text-cyan-300" />
                        Emergency Passport
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        Patient-selected critical information
                      </div>
                    </div>

                    <div className="grid h-10 w-10 grid-cols-4 gap-0.5 rounded-lg bg-white p-1">
                      {Array.from({ length: 16 }).map((_, index) => (
                        <span
                          key={index}
                          className={
                            [0, 1, 2, 4, 6, 8, 10, 11, 13, 14, 15].includes(
                              index,
                            )
                              ? "rounded-[1px] bg-slate-950"
                              : "rounded-[1px] bg-white"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem → solution */}
        <section className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                The problem
              </div>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Healthcare information is fragmented.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-400">
                Reports live in hospitals. Lab results sit in separate
                portals. Prescriptions are scattered across messages and
                paper. Health history becomes difficult to understand when
                patients need it most.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: FileHeart,
                  title: "Bring records together",
                  text: "Organize reports, tests, medications and important health information in one place.",
                },
                {
                  icon: Brain,
                  title: "Understand the history",
                  text: "Turn disconnected medical information into a longitudinal view with meaningful insights.",
                },
                {
                  icon: LockKeyhole,
                  title: "Keep control",
                  text: "Give patients visibility and control over what information is shared and for how long.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product pillars */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              One health passport
            </div>

            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              From medical documents to a longitudinal health experience.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              HealthPassport brings together the information that matters
              across the patient's health journey.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileHeart,
                title: "Medical Records",
                text: "Documents and structured health information.",
              },
              {
                icon: TrendingUp,
                title: "Health Trends",
                text: "See important measurements change over time.",
              },
              {
                icon: Stethoscope,
                title: "Care Sharing",
                text: "Prepare and share relevant information with care teams.",
              },
              {
                icon: Users,
                title: "Family Health",
                text: "A connected health experience for the whole family.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <Icon className="h-5 w-5 text-cyan-300" />

                  <div className="mt-5 text-sm font-bold">{item.title}</div>

                  <div className="mt-2 text-xs leading-5 text-slate-500">
                    {item.text}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Investor CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.08] via-white/[0.04] to-indigo-300/[0.08] p-8 text-center sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.10),transparent_45%)]" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                See HealthPassport in action.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
                Explore the interactive  demo using a fictional
                patient journey from records to insights, sharing and
                emergency access.
              </p>

              <button
                type="button"
                onClick={onEnterDemo}
                className="group mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-50"
              >
                Enter HealthPassport Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>© 2026 HealthPassport</div>

          <div className="flex items-center gap-2">
            <span> Demo</span>
            <span>•</span>
            <span>Frontend POC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;