import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileHeart,
  FlaskConical,
  HeartPulse,
  ShieldCheck,
  Smartphone,
  Watch,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";

interface IntegrationsProps {
  onNavigate?: (page: Page) => void;
}

function Integrations({ onNavigate }: IntegrationsProps) {
  const sources = [
    {
      icon: Building2,
      title: "Hospitals & Clinics",
      description:
        "Connect clinical records and care information into the patient's longitudinal health record.",
      status: "Planned",
    },
    {
      icon: FlaskConical,
      title: "Diagnostic Labs",
      description:
        "Bring laboratory results and test history into one patient-controlled health view.",
      status: "Planned",
    },
    {
      icon: FileHeart,
      title: "Prescriptions",
      description:
        "Keep medications and prescription history organized alongside the patient's health record.",
      status: "Ready",
    },
    {
      icon: Smartphone,
      title: "Camera Scan",
      description:
        "Capture paper reports and medical documents for structured health information.",
      status: "Ready",
    },
    {
      icon: HeartPulse,
      title: "ABDM / ABHA",
      description:
        "Designed to support India's emerging connected digital health ecosystem.",
      status: "Ready",
    },
    {
      icon: Watch,
      title: "Wearables",
      description:
        "Future integration with continuous health signals and personal wellness data.",
      status: "Planned",
    },
  ];

  return (
    <div className="hp-page-enter mx-auto max-w-[1200px] space-y-6">
      <section className="overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-card md:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
            <HeartPulse className="h-3.5 w-3.5" />
            Health ecosystem
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
            One passport. Every source of health information.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            HealthPassport is designed to become the longitudinal health layer
            connecting records, labs, prescriptions, devices and care
            experiences around the patient.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {[
            "Hospital",
            "Diagnostic Lab",
            "Prescription",
            "Camera Scan",
            "ABDM / ABHA",
            "Wearables",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              HealthPassport ecosystem
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-blue-950">
              Records flowing into one patient-controlled health record
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            Patient controlled
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => {
            const Icon = source.icon;
            const ready = source.status === "Ready";

            return (
              <div
                key={source.title}
                className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      ready
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {source.status}
                  </span>
                </div>

                <h3 className="mt-5 text-sm font-bold text-slate-800">
                  {source.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {source.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card md:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Destination
        </div>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <FileHeart className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-blue-950">
                HealthPassport
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                One longitudinal patient health record.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Patient-controlled access
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card md:p-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Roadmap
          </div>

          <h2 className="mt-2 text-2xl font-bold text-blue-950">
            Connected health, built around the patient
          </h2>
        </div>

        <div className="mt-6 space-y-3">
          {[
            ["Medical Records", "Connected"],
            ["ABDM / ABHA", "Ready"],
            ["Hospitals & Clinics", "Planned"],
            ["Diagnostic Labs", "Planned"],
            ["Wearables", "Planned"],
            ["Care Team", "Ready"],
          ].map(([name, status]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={`h-4 w-4 ${
                    status === "Planned"
                      ? "text-slate-300"
                      : "text-emerald-500"
                  }`}
                />

                <span className="text-sm font-semibold text-slate-700">
                  {name}
                </span>
              </div>

              <span className="text-xs font-medium text-slate-400">
                {status}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.("privacy")}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700"
        >
          Review privacy and access
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}

export default Integrations;