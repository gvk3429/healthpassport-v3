import {
  ArrowRight,
  Heart,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import HealthSnapshot from "../components/HealthSnapshot";
import HealthTrendsCard from "../components/HealthTrendsCard";
import EmergencyCard from "../components/EmergencyCard";
import AIInsightsCard from "../components/AIInsightsCard";
import RemindersCard from "../components/RemindersCard";
import RecentRecords from "../components/RecentRecords";
import RecentTests from "../components/RecentTests";

import type { Page } from "../components/AppSidebar";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

interface QuickAction {
  label: string;
  page: Page;
}

const quickActions: QuickAction[] = [
  {
    label: "Track",
    page: "timeline",
  },
  {
    label: "Understand",
    page: "ask",
  },
  {
    label: "Share",
    page: "sharing",
  },
];

export default function Dashboard({
  onNavigate,
}: DashboardProps) {
  return (
    <div className="mx-auto flex min-h-full max-w-[1500px] flex-col">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <header className="mb-3 flex shrink-0 flex-col justify-between gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Heart
                size={13}
                fill="currentColor"
                aria-hidden="true"
              />
            </span>

            <span className="text-[11px] font-semibold text-slate-400">
              Monday, 7 September 2026
            </span>
          </div>

          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-blue-950 sm:text-[28px]">
            Your health, beautifully organized.
          </h1>

          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Everything important about your health, in one place.
          </p>
        </div>

        {/* ===================================================
            PRIMARY ACTIONS
            =================================================== */}

        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigate("ask")}
            className="
              inline-flex
              h-10
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              text-xs
              font-bold
              text-slate-700
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:border-violet-200
              hover:bg-violet-50
              hover:text-violet-700
              sm:flex-none
            "
          >
            <Sparkles
              size={15}
              aria-hidden="true"
            />

            Ask HealthPassport
          </button>

          <button
            type="button"
            onClick={() => onNavigate("records")}
            className="
              inline-flex
              h-10
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-blue-600
              bg-gradient-to-r
              from-blue-600
              to-blue-700
              px-4
              text-xs
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/15
              transition
              hover:-translate-y-0.5
              hover:from-blue-700
              hover:to-blue-800
              sm:flex-none
            "
          >
            <Plus
              size={16}
              aria-hidden="true"
            />

            Add Record
          </button>
        </div>
      </header>

      {/* =====================================================
          HEALTH SNAPSHOT

          Compact desktop version.
          ===================================================== */}

      <div className="shrink-0">
        <HealthSnapshot />
      </div>

      {/* =====================================================
          CORE INTELLIGENCE WORKSPACE

          This is the main investor-demo viewport.
          ===================================================== */}

      <section
        aria-label="Health intelligence"
        className="
          mt-3
          grid
          min-h-0
          flex-1
          gap-3
          xl:grid-cols-12
        "
      >
        {/* ---------------------------------------------------
            HEALTH TRENDS
            --------------------------------------------------- */}

        <div className="min-h-0 xl:col-span-5">
          <HealthTrendsCard />
        </div>

        {/* ---------------------------------------------------
            AI INSIGHTS
            --------------------------------------------------- */}

        <div className="min-h-0 xl:col-span-4">
          <AIInsightsCard />
        </div>

        {/* ---------------------------------------------------
            EMERGENCY
            --------------------------------------------------- */}

        <div className="min-h-0 xl:col-span-3">
          <EmergencyCard
            onOpen={() => onNavigate("emergency")}
          />
        </div>
      </section>

      {/* =====================================================
          DESKTOP QUICK ACCESS STRIP

          Instead of adding another large vertical section,
          secondary information is exposed through compact
          navigation actions.
          ===================================================== */}

      <section
        aria-label="Health quick access"
        className="mt-3 shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
              <ShieldCheck
                size={15}
                aria-hidden="true"
              />
            </div>

            <div>
              <div className="text-[11px] font-black text-slate-800">
                Your health workspace
              </div>

              <div className="text-[9px] text-slate-400">
                Everything else is one click away.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate("timeline")}
              className="
                inline-flex
                items-center
                gap-1
                rounded-lg
                bg-slate-50
                px-3
                py-2
                text-[9px]
                font-bold
                text-slate-600
                transition
                hover:bg-blue-50
                hover:text-blue-700
              "
            >
              Timeline
              <ArrowRight size={11} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("records")}
              className="
                inline-flex
                items-center
                gap-1
                rounded-lg
                bg-slate-50
                px-3
                py-2
                text-[9px]
                font-bold
                text-slate-600
                transition
                hover:bg-blue-50
                hover:text-blue-700
              "
            >
              Medical Records
              <ArrowRight size={11} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("trends")}
              className="
                inline-flex
                items-center
                gap-1
                rounded-lg
                bg-slate-50
                px-3
                py-2
                text-[9px]
                font-bold
                text-slate-600
                transition
                hover:bg-blue-50
                hover:text-blue-700
              "
            >
              Trends
              <ArrowRight size={11} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("privacy")}
              className="
                inline-flex
                items-center
                gap-1
                rounded-lg
                bg-slate-50
                px-3
                py-2
                text-[9px]
                font-bold
                text-slate-600
                transition
                hover:bg-blue-50
                hover:text-blue-700
              "
            >
              Privacy & Access
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE / TABLET SECONDARY INFORMATION

          Desktop does not need this duplicate vertical stack.
          On smaller screens it remains available.
          ===================================================== */}

      <div className="mt-3 grid gap-3 lg:hidden">
        <RecentRecords
          onOpenRecords={() => onNavigate("records")}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <RemindersCard />
          <RecentTests />
        </div>
      </div>

      {/* =====================================================
          MOBILE HEALTH JOURNEY
          ===================================================== */}

      <section className="mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 p-5 text-white shadow-lg lg:hidden">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck
                size={17}
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Your health journey is in your hands.
            </h2>

            <p className="mt-1 max-w-md text-[11px] leading-5 text-blue-100">
              Track your records, understand your health, share
              securely, and stay prepared.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onNavigate(action.page)}
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  bg-white/10
                  px-3
                  py-2
                  text-[9px]
                  font-bold
                  backdrop-blur
                  transition
                  hover:bg-white/20
                "
              >
                {action.label}

                <ArrowRight size={10} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}