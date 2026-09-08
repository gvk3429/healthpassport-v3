import {
  ArrowRight,
  CalendarDays,
  Pill,
  Syringe,
  Stethoscope,
} from "lucide-react";
import { reminders } from "../data/mockHealthData";

export default function RemindersCard() {
  return (
    <section className="hp-card hp-card-hover p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={19} />
          </div>

          <h2 className="font-bold text-slate-900">
            Upcoming Reminders
          </h2>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-blue-600">
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {reminders.map((reminder) => {
          const Icon =
            reminder.type === "Medication"
              ? Pill
              : reminder.type === "Vaccination"
                ? Syringe
                : Stethoscope;

          return (
            <div
              key={`${reminder.type}-${reminder.title}`}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <Icon size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800">
                  {reminder.type}
                </div>

                <div className="truncate text-[11px] text-slate-500">
                  {reminder.title}
                  {reminder.time && ` · ${reminder.time}`}
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-blue-600 shadow-sm">
                {reminder.date}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}