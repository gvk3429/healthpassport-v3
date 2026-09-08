import { useState, type ReactNode } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  LockKeyhole,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";

interface SettingsProps {
  onNavigate?: (page: Page) => void;
}

function Settings({ onNavigate }: SettingsProps) {
  const [reminders, setReminders] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [compactDashboard, setCompactDashboard] = useState(false);
  const [saved, setSaved] = useState(false);

  const savePreferences = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  return (
    <div className="hp-page-enter mx-auto max-w-[1000px] space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <SettingsIcon className="h-5 w-5" />
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Account preferences
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950">
              Settings
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Configure your HealthPassport experience and notification
              preferences.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white shadow-card">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950">
            Preferences
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Choose how HealthPassport keeps you informed.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          <SettingRow
            icon={<Bell className="h-4 w-4" />}
            title="Health reminders"
            description="Receive reminders for medications, vaccinations and upcoming appointments."
            enabled={reminders}
            onToggle={() => setReminders((value) => !value)}
          />

          <SettingRow
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Security alerts"
            description="Get notified about important privacy and access activity."
            enabled={securityAlerts}
            onToggle={() => setSecurityAlerts((value) => !value)}
          />

          <SettingRow
            icon={<SettingsIcon className="h-4 w-4" />}
            title="Compact dashboard"
            description="Use a more condensed layout when viewing your health information."
            enabled={compactDashboard}
            onToggle={() => setCompactDashboard((value) => !value)}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {saved ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                Preferences saved.
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Changes are local to this demo.
              </>
            )}
          </div>

          <button
            type="button"
            onClick={savePreferences}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white shadow-card">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950">
            Trust & security
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Review your profile and privacy controls.
          </p>
        </div>

        <div className="p-3">
          <SettingsLink
            icon={<LockKeyhole className="h-4 w-4" />}
            title="Privacy & Access"
            description="Review permissions, sharing and access activity."
            onClick={() => onNavigate?.("privacy")}
          />

          <SettingsLink
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Patient Profile"
            description="Review your identity and health profile information."
            onClick={() => onNavigate?.("profile")}
          />
        </div>
      </section>

      <div className="rounded-2xl bg-slate-100 px-5 py-4 text-xs leading-5 text-slate-500">
        <strong className="text-slate-700">Demo environment:</strong>{" "}
        HealthPassport V3 is currently presented as a frontend investor
        demonstration. Settings shown here are illustrative.
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-6">
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 sm:flex">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-slate-800">
          {title}
        </div>

        <div className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          {description}
        </div>
      </div>

      <button
        type="button"
        aria-label={`${title}: ${enabled ? "enabled" : "disabled"}`}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-blue-950" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SettingsLink({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-slate-800">
          {title}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {description}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-slate-300" />
    </button>
  );
}

export default Settings;