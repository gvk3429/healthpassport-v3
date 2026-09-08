import {
  ArrowLeft,
  ArrowRight,
  FileHeart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface DemoLoginProps {
  onBack: () => void;
  onContinue: () => void;
}

function DemoLogin({ onBack, onContinue }: DemoLoginProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-14rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <FileHeart className="h-4 w-4 text-cyan-300" />
              </div>

              <div className="text-sm font-bold">
                Health<span className="text-cyan-300">Passport</span>
              </div>
            </div>

            <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:block">
              Investor Demo
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Intro */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 shadow-lg shadow-cyan-500/5">
                <LockKeyhole className="h-6 w-6 text-cyan-300" />
              </div>

              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Secure demo environment
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome to HealthPassport
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Continue with the prepared patient profile to explore the
                HealthPassport investor experience.
              </p>
            </div>

            {/* Patient card */}
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Demo patient
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/20 to-sky-400/10 text-lg font-bold text-cyan-200 ring-1 ring-cyan-300/10">
                  AR
                </div>

                <div className="min-w-0">
                  <div className="text-lg font-bold">Arjun Rao</div>

                  <div className="mt-1 text-xs text-slate-500">
                    42 years · Male · O+
                  </div>
                </div>

                <div className="ml-auto">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300/10">
                    <div className="h-2 w-2 rounded-full bg-emerald-300" />
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/[0.035] px-3 py-3 text-center">
                    <div className="text-xs font-bold text-slate-200">2</div>
                    <div className="mt-1 text-[10px] text-slate-600">
                      Conditions
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/[0.035] px-3 py-3 text-center">
                    <div className="text-xs font-bold text-slate-200">3</div>
                    <div className="mt-1 text-[10px] text-slate-600">
                      Medicines
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/[0.035] px-3 py-3 text-center">
                    <div className="text-xs font-bold text-slate-200">1</div>
                    <div className="mt-1 text-[10px] text-slate-600">
                      Allergy
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onContinue}
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/5 transition hover:bg-cyan-50"
              >
                Continue to HealthPassport
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

              <div>
                <div className="text-xs font-semibold text-slate-300">
                  Demo access only
                </div>

                <p className="mt-1 text-[11px] leading-5 text-slate-600">
                  This investor demonstration uses fictional patient data.
                  No real authentication or medical data is being processed by
                  this demo.
                </p>
              </div>
            </div>

            <div className="mt-7 text-center text-[10px] uppercase tracking-[0.18em] text-slate-700">
              HealthPassport V3 · Investor Demonstration
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DemoLogin;