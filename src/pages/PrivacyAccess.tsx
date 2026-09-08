import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileDown,
  Fingerprint,
  History,
  KeyRound,
  Lock,
  
  RefreshCw,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";
import {
  addAuditEvent,
  getPrivacyState,
  recordHealthDeletionRequest,
  recordHealthExport,
  revokeConsent,
  type AuditEvent,
  type ConsentRecord,
  type PrivacyState,
} from "../lib/privacyAudit";

interface PrivacyAccessProps {
  onNavigate: (page: Page) => void;
}

type ExportScope =
  | "Complete HealthPassport"
  | "Medical records"
  | "Laboratory history"
  | "Emergency profile";

const exportScopes: ExportScope[] = [
  "Complete HealthPassport",
  "Medical records",
  "Laboratory history",
  "Emergency profile",
];

const auditLabels: Record<string, string> = {
  document_uploaded: "Document uploaded",
  document_viewed: "Medical record viewed",
  document_deleted: "Document deleted",
  document_shared: "Health information shared",
  qr_accessed: "Emergency QR accessed",
  doctor_granted: "Doctor access granted",
  doctor_revoked: "Doctor access revoked",
  health_exported: "Health information exported",
  health_deleted: "Health data deletion requested",
  ai_analysis: "AI analysis performed",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatRelativeTime(timestamp: string) {
  return timestamp;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusClasses(status: ConsentRecord["status"]) {
  if (status === "active") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "expired") {
    return "border-slate-200 bg-slate-50 text-slate-500";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

function auditIcon(type: AuditEvent["type"]) {
  switch (type) {
    case "doctor_granted":
      return <UserCheck size={16} />;
    case "doctor_revoked":
      return <X size={16} />;
    case "qr_accessed":
      return <Zap size={16} />;
    case "health_exported":
      return <Download size={16} />;
    case "health_deleted":
      return <Trash2 size={16} />;
    case "ai_analysis":
      return <Activity size={16} />;
    case "document_uploaded":
      return <FileDown size={16} />;
    default:
      return <Eye size={16} />;
  }
}

function Modal({
  open,
  title,
  description,
  children,
  onClose,
  width = "max-w-lg",
}: {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  width?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        className={cn(
          "w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl",
          width
        )}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-500">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition",
        enabled ? "bg-indigo-600" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
          enabled ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}

export default function PrivacyAccess({
  onNavigate,
}: PrivacyAccessProps) {
  const [privacy, setPrivacy] = useState<PrivacyState>(() =>
    getPrivacyState()
  );

  const [auditFilter, setAuditFilter] = useState("all");
  const [auditSearch, setAuditSearch] = useState("");

  const [aiEnabled, setAiEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyEnabled, setEmergencyEnabled] = useState(true);

  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ConsentRecord | null>(
    null
  );

  const [selectedExportScope, setSelectedExportScope] =
    useState<ExportScope>("Complete HealthPassport");

  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setPrivacy(getPrivacyState());
    };

    window.addEventListener("healthpassport-privacy-updated", refresh);

    return () => {
      window.removeEventListener(
        "healthpassport-privacy-updated",
        refresh
      );
    };
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => {
      setNotice(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  const activeConsents = useMemo(
    () => privacy.consents.filter((consent) => consent.status === "active"),
    [privacy.consents]
  );

  const filteredAudit = useMemo(() => {
    const search = auditSearch.trim().toLowerCase();

    return privacy.audit.filter((event) => {
      const matchesFilter =
        auditFilter === "all" ||
        (auditFilter === "access" &&
          ["doctor_granted", "document_viewed", "qr_accessed"].includes(
            event.type
          )) ||
        (auditFilter === "sharing" &&
          ["doctor_granted", "doctor_revoked", "document_shared"].includes(
            event.type
          )) ||
        (auditFilter === "data" &&
          [
            "health_exported",
            "health_deleted",
            "document_uploaded",
            "document_deleted",
          ].includes(event.type)) ||
        (auditFilter === "ai" && event.type === "ai_analysis");

      const searchable = [
        event.title,
        event.actor,
        event.scope,
        event.purpose,
        auditLabels[event.type] ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!search || searchable.includes(search));
    });
  }, [privacy.audit, auditFilter, auditSearch]);

  const peopleWithAccess = useMemo(() => {
    const unique = new Map<string, ConsentRecord>();

    activeConsents.forEach((consent) => {
      const key = `${consent.recipientName}-${consent.organization}`;

      if (!unique.has(key)) {
        unique.set(key, consent);
      }
    });

    return Array.from(unique.values());
  }, [activeConsents]);

  const showNotice = (message: string) => {
    setNotice(message);
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;

    revokeConsent(revokeTarget.id);

    setPrivacy(getPrivacyState());
    setRevokeTarget(null);

    showNotice(
      `${revokeTarget.recipientName}'s access has been revoked.`
    );
  };

  const handleExport = () => {
    recordHealthExport(selectedExportScope);

    setPrivacy(getPrivacyState());
    setExportOpen(false);

    showNotice(
      `${selectedExportScope} export prepared successfully.`
    );
  };

  const handleDeleteRequest = () => {
    recordHealthDeletionRequest();

    setPrivacy(getPrivacyState());
    setDeleteOpen(false);

    showNotice(
      "Deletion request recorded. Your data is still protected."
    );
  };

  const handleResetDemo = () => {
    window.localStorage.removeItem("healthpassport-privacy-state-v1");
    window.dispatchEvent(
      new CustomEvent("healthpassport-privacy-updated")
    );

    setPrivacy(getPrivacyState());

    showNotice("Privacy demo data has been reset.");
  };

  const handleToggle = (
    label: string,
    current: boolean,
    setter: (value: boolean) => void
  ) => {
    const next = !current;
    setter(next);

    addAuditEvent({
      type: "ai_analysis",
      title: `${label} ${next ? "enabled" : "disabled"}`,
      actor: "You",
      scope: "Privacy controls",
      purpose: "Privacy preference updated",
      timestamp: "Just now",
      status: "info",
    });

    setPrivacy(getPrivacyState());
  };

  return (
    <div className="min-h-full bg-slate-50">
      {notice && (
        <div className="fixed right-5 top-5 z-[120] flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check size={15} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Privacy update
            </p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              {notice}
            </p>
          </div>

          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Hero */}
        <div className="relative mb-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-48 rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                    <ShieldCheck size={23} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                      Trust Center
                    </p>
                    <p className="text-xs text-slate-500">
                      Privacy & Access
                    </p>
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Your health data.
                  <br />
                  <span className="text-indigo-600">Your control.</span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  See who can access your HealthPassport, control sharing,
                  export your information, and review every important
                  access event from one place.
                </p>
              </div>

              <div className="min-w-[230px] rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <Shield size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-emerald-700">
                      Privacy status
                    </p>
                    <p className="text-base font-bold text-emerald-800">
                      Healthy
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700">
                  <Check size={14} />
                  <span>Your account is protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust summary */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Active access",
              value: activeConsents.length,
              icon: Users,
              text: "People with access",
            },
            {
              label: "Audit events",
              value: privacy.audit.length,
              icon: History,
              text: "Tracked activity",
            },
            {
              label: "Exports",
              value: privacy.exportCount,
              icon: Download,
              text: "Data exports",
            },
            {
              label: "Ownership",
              value: "100%",
              icon: Fingerprint,
              text: "Controlled by you",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {item.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon size={17} />
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* People with access */}
        <section className="mb-8">
          <SectionHeader
            eyebrow="Access management"
            title="People with access"
            description="Healthcare providers only receive the information and time window you approve."
            action={
              <button
                onClick={() => onNavigate("sharing")}
                className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:flex"
              >
                Manage sharing
                <ChevronRight size={16} />
              </button>
            }
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {peopleWithAccess.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center lg:col-span-2">
                <Users className="mx-auto text-slate-300" size={28} />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No one currently has access
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  You can share selected health information whenever needed.
                </p>
              </div>
            ) : (
              peopleWithAccess.map((consent) => (
                <div
                  key={consent.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                        {getInitials(consent.recipientName)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {consent.recipientName}
                        </h3>
                        <p className="truncate text-xs text-slate-500">
                          {consent.recipientRole} · {consent.organization}
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                        statusClasses(consent.status)
                      )}
                    >
                      Active
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <div className="flex items-start gap-2">
                      <KeyRound
                        size={15}
                        className="mt-0.5 shrink-0 text-indigo-500"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          {consent.purpose}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                          {consent.scope.join(" · ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock3 size={13} />
                      Expires {consent.expiresAt}
                    </div>

                    <button
                      onClick={() => setRevokeTarget(consent)}
                      className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Revoke access
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onNavigate("sharing")}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-indigo-600 sm:hidden"
          >
            Manage sharing
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Ownership */}
        <section className="mb-8">
          <SectionHeader
            eyebrow="Data ownership"
            title="Your data remains yours"
            description="HealthPassport separates ownership from provider access. Sharing your information never transfers ownership."
          />

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                  <Fingerprint size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Patient-controlled HealthPassport
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    You decide what is stored, who can see it, how long
                    access lasts, and when access ends.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Share", "Choose the scope"],
                  ["Revoke", "End access anytime"],
                  ["Export", "Take your data with you"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-white bg-white/75 p-3"
                  >
                    <p className="text-xs font-bold text-slate-800">
                      {title}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Take your data with you
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Export a copy of your HealthPassport or request account
                deletion.
              </p>

              <div className="mt-5 space-y-3">
                <button
                  onClick={() => setExportOpen(true)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                >
                  <span className="flex items-center gap-3">
                    <Download
                      size={17}
                      className="text-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Export my health data
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        Choose exactly what to export
                      </span>
                    </span>
                  </span>

                  <ChevronRight size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => setDeleteOpen(true)}
                  className="flex w-full items-center justify-between rounded-xl border border-rose-100 px-4 py-3 text-left transition hover:bg-rose-50"
                >
                  <span className="flex items-center gap-3">
                    <Trash2 size={17} className="text-rose-500" />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Delete my health data
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        Protected deletion workflow
                      </span>
                    </span>
                  </span>

                  <ChevronRight size={16} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy controls */}
        <section className="mb-8">
          <SectionHeader
            eyebrow="Privacy controls"
            title="Control how HealthPassport behaves"
            description="These preferences are local demo controls and can be changed at any time."
          />

          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Activity size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    AI health analysis
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Allow HealthPassport AI features to analyze your
                    health records for summaries and insights.
                  </p>
                </div>
              </div>

              <Toggle
                enabled={aiEnabled}
                onChange={() =>
                  handleToggle(
                    "AI health analysis",
                    aiEnabled,
                    setAiEnabled
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Bell size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Activity notifications
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Receive notifications when important access or
                    sharing activity occurs.
                  </p>
                </div>
              </div>

              <Toggle
                enabled={notificationsEnabled}
                onChange={() =>
                  handleToggle(
                    "Activity notifications",
                    notificationsEnabled,
                    setNotificationsEnabled
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Zap size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Emergency information
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Allow your explicitly selected emergency profile
                    to be available through Emergency QR.
                  </p>
                </div>
              </div>

              <Toggle
                enabled={emergencyEnabled}
                onChange={() =>
                  handleToggle(
                    "Emergency information",
                    emergencyEnabled,
                    setEmergencyEnabled
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* Audit trail */}
        <section className="mb-8">
          <SectionHeader
            eyebrow="Transparency"
            title="Access audit trail"
            description="A chronological record of important activity involving your HealthPassport."
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <History
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={auditSearch}
                    onChange={(event) =>
                      setAuditSearch(event.target.value)
                    }
                    placeholder="Search audit activity..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {[
                    ["all", "All"],
                    ["access", "Access"],
                    ["sharing", "Sharing"],
                    ["data", "Data"],
                    ["ai", "AI"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setAuditFilter(value)}
                      className={cn(
                        "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition",
                        auditFilter === value
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredAudit.length === 0 ? (
              <div className="p-10 text-center">
                <History
                  className="mx-auto text-slate-300"
                  size={28}
                />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No matching activity
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try a different filter or search term.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAudit.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-4 p-4 transition hover:bg-slate-50/70 sm:p-5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      {auditIcon(event.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row">
                        <p className="text-sm font-semibold text-slate-800">
                          {event.title || auditLabels[event.type]}
                        </p>

                        <span className="text-[11px] text-slate-400">
                          {formatRelativeTime(event.timestamp)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {event.actor}
                        {event.scope ? ` · ${event.scope}` : ""}
                      </p>

                      {event.purpose && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          Purpose: {event.purpose}
                        </p>
                      )}
                    </div>

                    {event.status && (
                      <span
                        className={cn(
                          "hidden h-fit rounded-full px-2 py-1 text-[10px] font-semibold sm:block",
                          event.status === "success" &&
                            "bg-emerald-50 text-emerald-600",
                          event.status === "info" &&
                            "bg-indigo-50 text-indigo-600",
                          event.status === "warning" &&
                            "bg-amber-50 text-amber-600"
                        )}
                      >
                        {event.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Consent history */}
        <section className="mb-8">
          <SectionHeader
            eyebrow="Consent history"
            title="Sharing history"
            description="Past access remains visible even after it expires or is revoked."
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr_100px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 md:grid">
              <span>Recipient</span>
              <span>Scope</span>
              <span>Duration</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {privacy.consents.map((consent) => (
                <div
                  key={consent.id}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr_100px] md:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {consent.recipientName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {consent.recipientRole} ·{" "}
                      {consent.organization}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-600">
                      {consent.scope.join(" · ")}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Via {consent.method}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-600">
                      {consent.grantedAt}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      → {consent.expiresAt}
                    </p>
                  </div>

                  <div>
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize",
                        statusClasses(consent.status)
                      )}
                    >
                      {consent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security principles */}
        <section className="mb-8">
          <SectionHeader
            eyebrow="Built around trust"
            title="Privacy principles"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Lock,
                title: "Private by default",
                text: "Your health information isn't shared without your action.",
              },
              {
                icon: KeyRound,
                title: "Granular access",
                text: "Share specific records, categories, or emergency information.",
              },
              {
                icon: Clock3,
                title: "Time-limited",
                text: "Provider access can expire automatically.",
              },
              {
                icon: History,
                title: "Transparent",
                text: "Important access and sharing activity is recorded.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon size={18} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Emergency handoff */}
        <section className="mb-8">
          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Zap size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Emergency access is separate from private records
                  </h3>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                    Emergency QR exposes only the information you
                    explicitly permit. It does not unlock your complete
                    HealthPassport.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate("emergency")}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Manage Emergency QR
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Demo / system footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck size={14} />
            <span>
              HealthPassport Trust Center · Demo environment
            </span>
          </div>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-2 self-start rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <RefreshCw size={13} />
            Reset demo privacy data
          </button>
        </div>
      </div>

      {/* Export modal */}
      <Modal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export my health data"
        description="Choose exactly what you want to take with you."
      >
        <div className="space-y-3">
          {exportScopes.map((scope) => (
            <button
              key={scope}
              onClick={() => setSelectedExportScope(scope)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
                selectedExportScope === scope
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    selectedExportScope === scope
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {selectedExportScope === scope ? (
                    <Check size={16} />
                  ) : (
                    <Download size={16} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {scope}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {scope === "Complete HealthPassport"
                      ? "All available HealthPassport information"
                      : `Export your ${scope.toLowerCase()} only`}
                  </p>
                </div>
              </div>

              {selectedExportScope === scope && (
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex gap-3">
            <Lock
              size={17}
              className="mt-0.5 shrink-0 text-indigo-600"
            />

            <p className="text-xs leading-5 text-indigo-700">
              This export action will be recorded in your audit trail
              so you always know when your health information was
              exported.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={() => setExportOpen(false)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            <Download size={16} />
            Prepare export
          </button>
        </div>
      </Modal>

      {/* Revoke modal */}
      <Modal
        open={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        title="Revoke access?"
        description="This action ends the selected provider's current access."
      >
        {revokeTarget && (
          <>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600">
                  <UserRound size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {revokeTarget.recipientName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {revokeTarget.recipientRole} ·{" "}
                    {revokeTarget.organization}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-500">
              <p>
                <span className="font-semibold text-slate-700">
                  Access:
                </span>{" "}
                {revokeTarget.scope.join(" · ")}
              </p>

              <p>
                <span className="font-semibold text-slate-700">
                  Purpose:
                </span>{" "}
                {revokeTarget.purpose}
              </p>

              <p>
                <span className="font-semibold text-slate-700">
                  Granted:
                </span>{" "}
                {revokeTarget.grantedAt}
              </p>
            </div>

            <div className="mt-5 flex gap-3 rounded-xl bg-slate-50 p-3">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              <p className="text-[11px] leading-5 text-slate-500">
                Revocation is recorded in the audit trail. Your
                ownership is unaffected.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setRevokeTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Keep access
              </button>

              <button
                onClick={handleRevoke}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Revoke access
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete my health data"
        description="This is a protected action and cannot be undone once completed."
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Please confirm carefully
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                In this POC, this action records a protected deletion
                request and creates an audit event. A production
                implementation would require authenticated
                confirmation and backend deletion workflows.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            "Your health records",
            "Shared access permissions",
            "Emergency profile data",
            "AI-generated health insights",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-sm text-slate-600"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                <Check size={13} />
              </div>
              {item}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] leading-5 text-slate-500">
            Your health data belongs to you. Deletion should always be
            deliberate, authenticated, and auditable.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={() => setDeleteOpen(false)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteRequest}
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <Trash2 size={16} />
            Confirm deletion request
          </button>
        </div>
      </Modal>
    </div>
  );
}