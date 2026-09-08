import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  FlaskConical,
} from "lucide-react";
import { recentTests } from "../data/mockHealthData";

export default function RecentTests() {
  return (
    <section className="hp-card hp-card-hover p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <FlaskConical size={19} />
          </div>

          <h2 className="font-bold text-slate-900">
            Recent Tests
          </h2>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-blue-600">
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-4">
        {recentTests.map((test) => {
          const improving =
            test.direction === "down";

          return (
            <div
              key={test.name}
              className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-blue-500">
                <FlaskConical size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800">
                  {test.name}
                </div>

                <div className="mt-1 text-[9px] text-slate-400">
                  Ref: {test.reference}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-800">
                  {test.value}
                </div>

                <div className="mt-1 text-[9px] text-slate-400">
                  {test.date}
                </div>
              </div>

              <div
                className={
                  improving
                    ? "text-emerald-500"
                    : "text-orange-500"
                }
              >
                {improving ? (
                  <ArrowDownRight size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}