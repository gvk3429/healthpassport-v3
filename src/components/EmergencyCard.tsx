import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface EmergencyCardProps {
  onOpen: () => void;
}

export default function EmergencyCard({
  onOpen,
}: EmergencyCardProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 p-5 shadow-card">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-100/50 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-bold text-red-900">
                Emergency Passport
              </h2>

              <p className="mt-0.5 text-[11px] text-red-700/70">
                Critical information, when it matters most.
              </p>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:text-red-600"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          {/* QR */}
          <div className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
            <div className="grid grid-cols-7 gap-[2px]">
              {Array.from({ length: 49 }).map((_, index) => {
                const dark =
                  [
                    0, 1, 2, 4, 6, 7, 9, 11, 12, 14,
                    16, 18, 20, 21, 23, 25, 27, 29,
                    30, 32, 34, 36, 38, 40, 42, 44,
                    46, 48,
                  ].includes(index);

                return (
                  <span
                    key={index}
                    className={`h-[8px] w-[8px] ${
                      dark ? "bg-slate-900" : "bg-white"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500">
              QR STATUS
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-slate-800">
                Active & Protected
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Share only the emergency information you have explicitly
              permitted.
            </p>
          </div>
        </div>

        <button
          onClick={onOpen}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 py-2.5 text-xs font-bold text-white shadow-sm transition hover:from-red-600 hover:to-rose-600"
        >
          <AlertTriangle size={15} />
          Show Emergency QR
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}