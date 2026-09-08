import {
  ArrowDownRight,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { healthTrend } from "../data/mockHealthData";

export default function HealthTrendsCard() {
  const max = 8;
  const min = 5.5;

  const points = healthTrend.map((item, index) => {
    const x = (index / (healthTrend.length - 1)) * 100;
    const y =
      100 -
      ((item.value - min) / (max - min)) * 100;

    return {
      ...item,
      x,
      y,
    };
  });

  const path = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <section className="hp-card hp-card-hover p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp size={19} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Health Trends
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              HbA1c over time
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-blue-600">
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500">
            HbA1c (%)
          </div>

          <div className="mt-1 text-2xl font-bold text-blue-950">
            6.8%
          </div>
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
          Improving
        </span>
      </div>

      <div className="relative mt-5 h-40">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[8, 7, 6, 5].map((value) => (
            <div
              key={value}
              className="flex items-center gap-2"
            >
              <span className="w-5 text-[9px] text-slate-300">
                {value.toFixed(1)}
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          ))}
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute left-7 right-0 top-0 h-[calc(100%-20px)] w-[calc(100%-28px)] overflow-visible"
        >
          <defs>
            <linearGradient
              id="trendFill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#38bdf8"
                stopOpacity="0.18"
              />
              <stop
                offset="100%"
                stopColor="#38bdf8"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <path
            d={`${path} L 100 100 L 0 100 Z`}
            fill="url(#trendFill)"
          />

          <path
            d={path}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {points.map((point) => (
            <circle
              key={`${point.month}-${point.year}`}
              cx={point.x}
              cy={point.y}
              r="1.8"
              fill="white"
              stroke="#0ea5e9"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className="absolute bottom-0 left-7 right-0 flex justify-between">
          {healthTrend.map((item) => (
            <span
              key={`${item.month}-${item.year}`}
              className="text-[8px] text-slate-400"
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x border-t pt-4">
        <div className="px-2 first:pl-0">
          <div className="text-[10px] text-slate-400">
            Latest value
          </div>
          <div className="mt-1 text-sm font-bold">
            6.8%
          </div>
        </div>

        <div className="px-3">
          <div className="text-[10px] text-slate-400">
            Reference
          </div>
          <div className="mt-1 text-sm font-semibold">
            &lt; 5.7%
          </div>
        </div>

        <div className="px-2">
          <div className="flex items-center gap-1 text-[10px] text-emerald-600">
            <ArrowDownRight size={12} />
            0.4%
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            vs last test
          </div>
        </div>
      </div>
    </section>
  );
}