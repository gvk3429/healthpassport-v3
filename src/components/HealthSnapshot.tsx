import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Droplets,
  Pill,
} from "lucide-react";

const metrics = [
  {
    label: "Blood Group",
    value: "O+",
    icon: Droplets,
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    label: "Age",
    value: "34 years",
    icon: CalendarDays,
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Conditions",
    value: "2",
    icon: Activity,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    label: "Medications",
    value: "3",
    icon: Pill,
    bg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    label: "Allergies",
    value: "1",
    icon: AlertTriangle,
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

export default function HealthSnapshot() {
  return (
    <section
      aria-label="Today's health snapshot"
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-sky-100
        bg-gradient-to-br
        from-sky-50
        via-white
        to-blue-50
        px-4
        py-4
        shadow-sm
        sm:px-5
        sm:py-4
      "
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          absolute
          -right-20
          -top-24
          h-56
          w-56
          rounded-full
          bg-sky-200/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          -bottom-24
          right-20
          h-40
          w-40
          rounded-full
          bg-blue-200/20
          blur-3xl
        "
      />

      <div className="relative">
        {/* ===================================================
            DESKTOP SNAPSHOT
            =================================================== */}

        <div className="hidden items-center gap-5 xl:flex">
          {/* Patient */}
          <div className="flex min-w-[330px] flex-1 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-slate-600 to-slate-900 text-base font-bold text-white shadow-md">
              AR
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                Your health snapshot for today
              </p>

              <h2 className="mt-0.5 truncate text-xl font-black tracking-tight text-blue-950">
                Good afternoon, Arjun{" "}
                <span className="inline-block">👋</span>
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Better insights. Healthier tomorrows.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid min-w-0 flex-[1.7] grid-cols-5 gap-2">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white
                    bg-white/80
                    px-2.5
                    py-2
                    shadow-sm
                    backdrop-blur
                  "
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${metric.bg} ${metric.iconColor}`}
                  >
                    <Icon
                      size={15}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[8px] font-medium text-slate-400">
                      {metric.label}
                    </div>

                    <div className="mt-0.5 truncate text-[11px] font-black text-slate-800">
                      {metric.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            TABLET / MOBILE SNAPSHOT
            =================================================== */}

        <div className="xl:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-3 border-white bg-gradient-to-br from-slate-600 to-slate-900 text-sm font-bold text-white shadow-md">
              AR
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                Your health snapshot for today
              </p>

              <h2 className="mt-0.5 truncate text-lg font-black tracking-tight text-blue-950">
                Good afternoon, Arjun 👋
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Better insights. Healthier tomorrows.
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white
                    bg-white/80
                    px-2.5
                    py-2
                    shadow-sm
                  "
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${metric.bg} ${metric.iconColor}`}
                  >
                    <Icon
                      size={14}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[8px] text-slate-400">
                      {metric.label}
                    </div>

                    <div className="truncate text-[10px] font-bold text-slate-800">
                      {metric.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}