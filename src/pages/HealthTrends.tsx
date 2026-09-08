import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Droplets,
  Heart,
  Info,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Weight,
  Zap,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";

interface HealthTrendsProps {
  onNavigate: (page: Page) => void;
}

type MetricId =
  | "heart-rate"
  | "blood-pressure"
  | "weight"
  | "glucose";

type Range = "7D" | "30D" | "90D";

interface Metric {
  id: MetricId;
  label: string;
  value: string;
  unit: string;
  change: string;
  changeValue: number;
  status: "positive" | "neutral" | "attention";
  icon: typeof Heart;
  description: string;
}

interface TrendPoint {
  label: string;
  value: number;
}

const metrics: Metric[] = [
  {
    id: "heart-rate",
    label: "Resting Heart Rate",
    value: "68",
    unit: "bpm",
    change: "-3 bpm",
    changeValue: -3,
    status: "positive",
    icon: Heart,
    description:
      "Average resting heart rate has gradually improved.",
  },
  {
    id: "blood-pressure",
    label: "Blood Pressure",
    value: "118/76",
    unit: "mmHg",
    change: "-2%",
    changeValue: -2,
    status: "positive",
    icon: Activity,
    description:
      "Recent readings remain within your tracked baseline.",
  },
  {
    id: "weight",
    label: "Weight",
    value: "71.8",
    unit: "kg",
    change: "-1.4 kg",
    changeValue: -1.4,
    status: "positive",
    icon: Weight,
    description:
      "Weight has decreased steadily over the selected period.",
  },
  {
    id: "glucose",
    label: "Fasting Glucose",
    value: "94",
    unit: "mg/dL",
    change: "+2 mg/dL",
    changeValue: 2,
    status: "neutral",
    icon: Droplets,
    description:
      "Latest readings are close to your recent average.",
  },
];

const trendData: Record<
  MetricId,
  Record<Range, TrendPoint[]>
> = {
  "heart-rate": {
    "7D": [
      { label: "Mon", value: 72 },
      { label: "Tue", value: 70 },
      { label: "Wed", value: 69 },
      { label: "Thu", value: 71 },
      { label: "Fri", value: 68 },
      { label: "Sat", value: 67 },
      { label: "Sun", value: 68 },
    ],
    "30D": [
      { label: "W1", value: 73 },
      { label: "W2", value: 71 },
      { label: "W3", value: 70 },
      { label: "W4", value: 68 },
    ],
    "90D": [
      { label: "Jan", value: 76 },
      { label: "Feb", value: 73 },
      { label: "Mar", value: 70 },
      { label: "Apr", value: 68 },
    ],
  },

  "blood-pressure": {
    "7D": [
      { label: "Mon", value: 121 },
      { label: "Tue", value: 119 },
      { label: "Wed", value: 120 },
      { label: "Thu", value: 118 },
      { label: "Fri", value: 117 },
      { label: "Sat", value: 119 },
      { label: "Sun", value: 118 },
    ],
    "30D": [
      { label: "W1", value: 122 },
      { label: "W2", value: 120 },
      { label: "W3", value: 119 },
      { label: "W4", value: 118 },
    ],
    "90D": [
      { label: "Jan", value: 126 },
      { label: "Feb", value: 123 },
      { label: "Mar", value: 120 },
      { label: "Apr", value: 118 },
    ],
  },

  weight: {
    "7D": [
      { label: "Mon", value: 73.2 },
      { label: "Tue", value: 72.9 },
      { label: "Wed", value: 72.8 },
      { label: "Thu", value: 72.5 },
      { label: "Fri", value: 72.2 },
      { label: "Sat", value: 72.0 },
      { label: "Sun", value: 71.8 },
    ],
    "30D": [
      { label: "W1", value: 74.1 },
      { label: "W2", value: 73.4 },
      { label: "W3", value: 72.7 },
      { label: "W4", value: 71.8 },
    ],
    "90D": [
      { label: "Jan", value: 76.4 },
      { label: "Feb", value: 74.8 },
      { label: "Mar", value: 73.1 },
      { label: "Apr", value: 71.8 },
    ],
  },

  glucose: {
    "7D": [
      { label: "Mon", value: 91 },
      { label: "Tue", value: 93 },
      { label: "Wed", value: 92 },
      { label: "Thu", value: 95 },
      { label: "Fri", value: 94 },
      { label: "Sat", value: 96 },
      { label: "Sun", value: 94 },
    ],
    "30D": [
      { label: "W1", value: 92 },
      { label: "W2", value: 93 },
      { label: "W3", value: 95 },
      { label: "W4", value: 94 },
    ],
    "90D": [
      { label: "Jan", value: 90 },
      { label: "Feb", value: 92 },
      { label: "Mar", value: 93 },
      { label: "Apr", value: 94 },
    ],
  },
};

function TrendChart({
  data,
  unit,
}: {
  data: TrendPoint[];
  unit: string;
}) {
  const width = 720;
  const height = 260;
  const paddingX = 30;
  const paddingY = 35;

  const values = data.map(
    (point) => point.value,
  );

  const minValue =
    Math.min(...values) - 2;

  const maxValue =
    Math.max(...values) + 2;

  const range =
    maxValue - minValue || 1;

  const points = data.map(
    (point, index) => {
      const x =
        paddingX +
        (index *
          (width - paddingX * 2)) /
          Math.max(data.length - 1, 1);

      const y =
        height -
        paddingY -
        ((point.value - minValue) /
          range) *
          (height - paddingY * 2);

      return {
        ...point,
        x,
        y,
      };
    },
  );

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
    )
    .join(" ");

  const areaPath = `${path} L ${
    points[points.length - 1]?.x ?? width
  } ${height - paddingY} L ${
    points[0]?.x ?? paddingX
  } ${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[260px] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="trendArea"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#0ea5e9"
              stopOpacity="0.20"
            />
            <stop
              offset="100%"
              stopColor="#0ea5e9"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map(
          (line) => {
            const y =
              paddingY +
              (line *
                (height -
                  paddingY * 2)) /
                3;

            return (
              <line
                key={line}
                x1={paddingX}
                x2={width - paddingX}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="5 6"
              />
            );
          },
        )}

        <path
          d={areaPath}
          fill="url(#trendArea)"
        />

        <path
          d={path}
          fill="none"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map(
          (point) => (
            <g key={point.label}>
              <circle
                cx={point.x}
                cy={point.y}
                r="7"
                fill="white"
                stroke="#0284c7"
                strokeWidth="3"
              />

              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {point.label}
              </text>
            </g>
          ),
        )}

        {points.length > 0 && (
          <text
            x={points[points.length - 1].x}
            y={
              points[points.length - 1].y -
              14
            }
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#0f172a"
          >
            {points[points.length - 1].value}{" "}
            {unit}
          </text>
        )}
      </svg>
    </div>
  );
}

export default function HealthTrends({
  onNavigate,
}: HealthTrendsProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricId>("heart-rate");

  const [range, setRange] =
    useState<Range>("30D");

  const activeMetric =
    metrics.find(
      (metric) =>
        metric.id === selectedMetric,
    ) ?? metrics[0];

  const chartData =
    trendData[selectedMetric][range];

  const trendSummary = useMemo(() => {
    if (chartData.length < 2) {
      return {
        direction: "stable",
        change: 0,
      };
    }

    const first =
      chartData[0].value;

    const last =
      chartData[chartData.length - 1]
        .value;

    const change =
      ((last - first) /
        Math.max(Math.abs(first), 1)) *
      100;

    return {
      direction:
        change > 1
          ? "up"
          : change < -1
            ? "down"
            : "stable",
      change,
    };
  }, [chartData]);

  const ActiveIcon =
    activeMetric.icon;

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
            <TrendingUp size={14} />
            Health Intelligence
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Health Trends
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            See how your key health measurements are changing over time
            and understand meaningful patterns in your health journey.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onNavigate("timeline")
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
        >
          View Health Timeline
          <ChevronRight size={15} />
        </button>
      </div>

      {/* AI insight banner */}
      <div className="mb-7 overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <Sparkles size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900">
                  HealthPassport Insight
                </h2>

                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-sky-700">
                  Demo AI
                </span>
              </div>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                Your resting heart rate and weight are showing a gradual
                improvement over the last 30 days. Blood pressure has
                remained relatively stable around your recent baseline.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={15} />
            Pattern looks positive
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const selected =
            selectedMetric === metric.id;

          return (
            <button
              key={metric.id}
              type="button"
              onClick={() =>
                setSelectedMetric(metric.id)
              }
              className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
                selected
                  ? "border-sky-300 ring-2 ring-sky-100"
                  : "border-slate-200 hover:border-sky-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Icon size={19} />
                </div>

                <div
                  className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                    metric.status ===
                    "positive"
                      ? "bg-emerald-50 text-emerald-700"
                      : metric.status ===
                          "attention"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {metric.status ===
                  "positive"
                    ? "Improving"
                    : metric.status ===
                        "attention"
                      ? "Watch"
                      : "Stable"}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold text-slate-500">
                  {metric.label}
                </div>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-black tracking-tight text-slate-950">
                    {metric.value}
                  </span>

                  <span className="pb-1 text-xs font-medium text-slate-400">
                    {metric.unit}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5">
                {metric.changeValue <= 0 ? (
                  <ArrowDownRight
                    size={14}
                    className="text-emerald-600"
                  />
                ) : (
                  <ArrowUpRight
                    size={14}
                    className="text-amber-600"
                  />
                )}

                <span
                  className={`text-xs font-bold ${
                    metric.status ===
                    "positive"
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  {metric.change}
                </span>

                <span className="text-[10px] text-slate-400">
                  vs previous period
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main chart */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <ActiveIcon size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">
                  {activeMetric.label}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {activeMetric.description}
                </p>
              </div>
            </div>

            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(
                ["7D", "30D", "90D"] as Range[]
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setRange(option)
                  }
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                    range === option
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <TrendChart
            data={chartData}
            unit={activeMetric.unit}
          />

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {trendSummary.direction ===
              "down" ? (
                <TrendingDown
                  size={17}
                  className="text-emerald-600"
                />
              ) : (
                <TrendingUp
                  size={17}
                  className="text-sky-600"
                />
              )}

              <div>
                <div className="text-xs font-bold text-slate-700">
                  {trendSummary.direction ===
                  "down"
                    ? "Downward trend"
                    : trendSummary.direction ===
                        "up"
                      ? "Upward trend"
                      : "Stable trend"}
                </div>

                <div className="text-[10px] text-slate-400">
                  Based on your selected timeframe
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-600">
              {Math.abs(
                trendSummary.change,
              ).toFixed(1)}
              % change
            </div>
          </div>
        </section>

        {/* Insight panel */}
        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Zap size={18} />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">
                  Key Insights
                </h2>

                <p className="text-[10px] text-slate-400">
                  Generated from your health trends
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-start gap-3">
                  <TrendingDown
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <div className="text-xs font-bold text-emerald-800">
                      Resting heart rate improved
                    </div>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-700/80">
                      Your average has moved from approximately 71 bpm
                      toward 68 bpm.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <div className="flex items-start gap-3">
                  <Activity
                    size={17}
                    className="mt-0.5 shrink-0 text-sky-600"
                  />

                  <div>
                    <div className="text-xs font-bold text-sky-800">
                      Blood pressure is stable
                    </div>

                    <p className="mt-1 text-[11px] leading-5 text-sky-700/80">
                      Recent systolic readings remain close to your
                      tracked baseline.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex items-start gap-3">
                  <Info
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>
                    <div className="text-xs font-bold text-amber-800">
                      Glucose deserves attention
                    </div>

                    <p className="mt-1 text-[11px] leading-5 text-amber-700/80">
                      There is a small upward movement compared with
                      your earlier readings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays
                size={17}
                className="text-slate-500"
              />

              <div>
                <div className="text-xs font-bold text-slate-800">
                  Tracking period
                </div>

                <div className="mt-0.5 text-[10px] text-slate-400">
                  Last updated today
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Records
                </div>

                <div className="mt-1 text-lg font-black text-slate-900">
                  28
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Metrics
                </div>

                <div className="mt-1 text-lg font-black text-slate-900">
                  4
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Bottom navigation */}
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() =>
            onNavigate("summary")
          }
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Heart size={17} />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800">
                Health Summary
              </div>

              <div className="text-[10px] text-slate-400">
                See your overall health snapshot
              </div>
            </div>
          </div>

          <ChevronRight
            size={15}
            className="text-slate-300 transition group-hover:text-sky-500"
          />
        </button>

        <button
          type="button"
          onClick={() =>
            onNavigate("timeline")
          }
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Activity size={17} />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800">
                Health Timeline
              </div>

              <div className="text-[10px] text-slate-400">
                Trace trends back to health events
              </div>
            </div>
          </div>

          <ChevronRight
            size={15}
            className="text-slate-300 transition group-hover:text-sky-500"
          />
        </button>

        <button
          type="button"
          onClick={() =>
            onNavigate("ask")
          }
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Sparkles size={17} />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800">
                Ask HealthPassport
              </div>

              <div className="text-[10px] text-slate-400">
                Explore your health data with AI
              </div>
            </div>
          </div>

          <ChevronRight
            size={15}
            className="text-slate-300 transition group-hover:text-sky-500"
          />
        </button>
      </div>

      {/* Demo disclaimer */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <Info
          size={15}
          className="mt-0.5 shrink-0 text-slate-400"
        />

        <p className="text-[10px] leading-5 text-slate-400">
          Health trend values shown in this investor-demo POC are
          illustrative frontend data. They demonstrate how HealthPassport
          can surface longitudinal patterns and insights from connected
          health records.
        </p>
      </div>
    </div>
  );
}