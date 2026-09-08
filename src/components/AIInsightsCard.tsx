import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AIInsightsCard() {
  return (
    <section className="hp-card hp-card-hover p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Sparkles size={19} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              AI Insights
            </h2>
            <p className="text-xs text-slate-400">
              Based on your available records
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-blue-600">
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <Insight
          icon={<Activity size={17} />}
          title="HbA1c is improving"
          description="Your latest result is lower than the previous test."
          type="blue"
        />

        <Insight
          icon={<CheckCircle2 size={17} />}
          title="Hemoglobin is stable"
          description="Your latest result remains within the reference range."
          type="green"
        />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="text-[10px] leading-4 text-slate-400">
          AI insights are informational only and are not a medical diagnosis
          or treatment recommendation.
        </p>
      </div>
    </section>
  );
}

function Insight({
  icon,
  title,
  description,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: "blue" | "green";
}) {
  return (
    <div
      className={`
        rounded-xl border p-3
        ${
          type === "blue"
            ? "border-blue-100 bg-blue-50/70"
            : "border-emerald-100 bg-emerald-50/70"
        }
      `}
    >
      <div className="flex gap-3">
        <div
          className={`
            mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
            ${
              type === "blue"
                ? "bg-white text-blue-600"
                : "bg-white text-emerald-600"
            }
          `}
        >
          {icon}
        </div>

        <div>
          <div
            className={`text-xs font-bold ${
              type === "blue"
                ? "text-blue-900"
                : "text-emerald-900"
            }`}
          >
            {title}
          </div>

          <p
            className={`mt-1 text-[11px] leading-4 ${
              type === "blue"
                ? "text-blue-800"
                : "text-emerald-800"
            }`}
          >
            {description}
          </p>
        </div>

        <ArrowRight
          size={14}
          className="ml-auto mt-1 shrink-0 text-slate-400"
        />
      </div>
    </div>
  );
}