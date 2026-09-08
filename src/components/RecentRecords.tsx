import {
  ArrowRight,
  ClipboardList,
  FileText,
  Hospital,
  Pill,
  Stethoscope,
} from "lucide-react";

import { records } from "../data/mockHealthData";

interface RecentRecordsProps {
  onOpenRecords?: () => void;
}

export default function RecentRecords({
  onOpenRecords,
}: RecentRecordsProps) {
  return (
    <section className="hp-card hp-card-hover p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={19} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Recent Medical Records
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Your latest uploaded documents
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRecords}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-4">
        {records.map((record) => {
          const Icon =
            record.category === "Lab Report"
              ? ClipboardList
              : record.category === "Prescription"
                ? Pill
                : record.category === "Hospital"
                  ? Hospital
                  : Stethoscope;

          return (
            <button
              key={record.id}
              onClick={onOpenRecords}
              className="group flex w-full items-center gap-3 border-b border-slate-100 py-3 text-left last:border-0 hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                <Icon size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-slate-800">
                  {record.title}
                </div>

                <div className="mt-1 truncate text-[10px] text-slate-400">
                  {record.provider} · {record.date}
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-600">
                  {record.category}
                </span>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">
                  AI Analysed
                </span>
              </div>

              <ArrowRight
                size={14}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}