import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Copy,
  HeartPulse,
  History,
  Info,
  Lock,
  Phone,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";
import { patient } from "../data/mockHealthData";
import {
  addAuditEvent,
  getPrivacyState,
  type PrivacyState,
} from "../lib/privacyAudit";

interface EmergencyPassportProps {
  onNavigate: (page: Page) => void;
}

interface EmergencyField {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  priority: string;
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="min-w-0 pr-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/*
 * Deterministic QR-style visual for the investor demo.
 *
 * This is intentionally a visual/demo QR pattern and is NOT intended
 * to be a production-scannable QR code.
 *
 * The actual emergency scan interaction is simulated through the
 * "Simulate emergency scan" action below.
 */
function QrPattern({ compact = false }: { compact?: boolean }) {
  const size = 21;

  const cells = Array.from({
    length: size * size,
  });

  const finderZones = [
    { top: 0, left: 0 },
    { top: 0, left: size - 7 },
    { top: size - 7, left: 0 },
  ];

  const isInsideFinder = (row: number, col: number) => {
    return finderZones.some(({ top, left }) => {
      return (
        row >= top &&
        row < top + 7 &&
        col >= left &&
        col < left + 7
      );
    });
  };

  const getFinderValue = (row: number, col: number) => {
    for (const { top, left } of finderZones) {
      if (
        row >= top &&
        row < top + 7 &&
        col >= left &&
        col < left + 7
      ) {
        const r = row - top;
        const c = col - left;

        return (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 &&
            r <= 4 &&
            c >= 2 &&
            c <= 4)
        );
      }
    }

    return false;
  };

  return (
    <div
      className={cn(
        "grid rounded-lg bg-white",
        compact ? "gap-[1px] p-2" : "gap-[1px] p-3"
      )}
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
      }}
      aria-label="Emergency QR demo pattern"
    >
      {cells.map((_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;

        const finder = isInsideFinder(row, col);

        const alignment =
          row >= 14 &&
          row <= 18 &&
          col >= 14 &&
          col <= 18 &&
          (
            row === 14 ||
            row === 18 ||
            col === 14 ||
            col === 18 ||
            (
              row === 16 &&
              col === 16
            )
          );

        const timing =
          (
            row === 6 &&
            col >= 8 &&
            col <= 12
          ) ||
          (
            col === 6 &&
            row >= 8 &&
            row <= 12
          );

        const data =
          (
            (
              row * 13 +
              col * 17 +
              row * col * 3 +
              7
            ) %
            11
          ) < 5;

        const filled = finder
          ? getFinderValue(row, col)
          : alignment || timing || data;

        return (
          <span
            key={index}
            aria-hidden="true"
            className={cn(
              "aspect-square w-full rounded-[1px]",
              filled
                ? "bg-slate-950"
                : "bg-white"
            )}
          />
        );
      })}
    </div>
  );
}

const initialFields: EmergencyField[] = [
  {
    id: "name",
    label: "Name",
    value: patient.name,
    enabled: true,
  },
  {
    id: "age",
    label: "Age",
    value: `${patient.age} years`,
    enabled: true,
  },
  {
    id: "blood",
    label: "Blood group",
    value: patient.bloodGroup,
    enabled: true,
  },
  {
    id: "allergy",
    label: "Allergies",
    value: "Penicillin",
    enabled: true,
  },
  {
    id: "condition",
    label: "Critical condition",
    value: "Type 2 diabetes",
    enabled: true,
  },
  {
    id: "medication",
    label: "Critical medication",
    value: "Metformin 500 mg",
    enabled: false,
  },
  {
    id: "instructions",
    label: "Important instructions",
    value:
      "Check blood glucose before administering medication.",
    enabled: true,
  },
];

const contacts: EmergencyContact[] = [
  {
    name: "Priya Rao",
    relationship: "Spouse",
    phone: "+91 98765 43210",
    priority: "Primary",
  },
  {
    name: "Rahul Rao",
    relationship: "Brother",
    phone: "+91 99887 66554",
    priority: "Secondary",
  },
];

export default function EmergencyPassport({
  onNavigate,
}: EmergencyPassportProps) {
  const [fields, setFields] =
    useState<EmergencyField[]>(initialFields);

  const [qrEnabled, setQrEnabled] =
    useState(true);

  const [showQr, setShowQr] =
    useState(false);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [scanOpen, setScanOpen] =
    useState(false);

  const [privacy, setPrivacy] =
    useState<PrivacyState>(() =>
      getPrivacyState()
    );

  const [notice, setNotice] =
    useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setPrivacy(getPrivacyState());
    };

    window.addEventListener(
      "healthpassport-privacy-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "healthpassport-privacy-updated",
        refresh
      );
    };
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice(null);
    }, 3500);

    return () =>
      window.clearTimeout(timer);
  }, [notice]);

  const enabledFields = useMemo(
    () =>
      fields.filter(
        (field) => field.enabled
      ),
    [fields]
  );

  const qrAccessEvents = useMemo(
    () =>
      privacy.audit.filter(
        (event) =>
          event.type === "qr_accessed"
      ),
    [privacy.audit]
  );

  const toggleField = (id: string) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id
          ? {
              ...field,
              enabled: !field.enabled,
            }
          : field
      )
    );
  };

  const showQrModal = () => {
    if (!qrEnabled) {
      setNotice(
        "Enable Emergency QR before showing the emergency profile."
      );
      return;
    }

    setShowQr(true);
  };

  const simulateScan = () => {
    if (!qrEnabled) return;

    addAuditEvent({
      type: "qr_accessed",
      title: "Emergency QR accessed",
      actor: "Emergency QR",
      scope: "Emergency profile",
      purpose: "Emergency access",
      timestamp: "Just now",
      status: "success",
    });

    setPrivacy(getPrivacyState());

    setScanOpen(false);

    setNotice(
      "Emergency QR access recorded in the audit trail."
    );
  };

  const copyEmergencyLink = () => {
    const link =
      "https://healthpassport.demo/emergency/HP-7F29-A2";

    navigator.clipboard
      ?.writeText(link)
      .catch(() => undefined);

    setNotice("Emergency link copied.");
  };

  const callContact = (
    contact: EmergencyContact
  ) => {
    addAuditEvent({
      type: "qr_accessed",
      title: `Emergency contact action: ${contact.name}`,
      actor: "Emergency profile",
      scope: "Emergency contact",
      purpose: "Emergency contact action",
      timestamp: "Just now",
      status: "info",
    });

    setPrivacy(getPrivacyState());

    setNotice(
      `Calling ${contact.name} in the demo.`
    );
  };

  return (
    <div className="min-h-full bg-slate-50">
      {notice ? (
        <div className="fixed right-5 top-5 z-[120] flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check size={15} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Emergency Passport
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              {notice}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="relative mb-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-rose-100/60 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 h-32 w-48 rounded-full bg-indigo-100/50 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
                    <HeartPulse size={22} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500">
                      Emergency Passport
                    </p>

                    <p className="text-xs text-slate-500">
                      Emergency access, without full record access
                    </p>
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  The right information
                  <br />
                  <span className="text-rose-600">
                    when it matters.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Your Emergency QR provides only the information you explicitly
                  permit. It does not expose your complete private HealthPassport.
                </p>
              </div>

              <div
                className={cn(
                  "min-w-[230px] rounded-2xl border p-4",
                  qrEnabled
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm",
                      qrEnabled
                        ? "text-emerald-600"
                        : "text-slate-400"
                    )}
                  >
                    <QrCode size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Emergency QR
                    </p>

                    <p
                      className={cn(
                        "text-base font-bold",
                        qrEnabled
                          ? "text-emerald-700"
                          : "text-slate-600"
                      )}
                    >
                      {qrEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setQrEnabled(
                      (current) => !current
                    )
                  }
                  className={cn(
                    "mt-4 w-full rounded-xl py-2 text-xs font-semibold transition",
                    qrEnabled
                      ? "bg-white text-rose-600 hover:bg-rose-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  )}
                >
                  {qrEnabled
                    ? "Disable QR"
                    : "Enable QR"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-500">
                Emergency information
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Choose what your QR reveals
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Only enabled fields will appear to someone accessing the
                Emergency Passport.
              </p>
            </div>

            <div className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700">
                      {field.label}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {field.value}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleField(field.id)
                    }
                    aria-label={`${field.enabled ? "Hide" : "Show"} ${field.label}`}
                    aria-pressed={field.enabled}
                    className={cn(
                      "relative h-7 w-12 shrink-0 rounded-full transition",
                      field.enabled
                        ? "bg-emerald-600"
                        : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
                        field.enabled
                          ? "left-6"
                          : "left-1"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
              <Lock
                size={16}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <p className="text-[11px] leading-5 text-indigo-700">
                Emergency access is intentionally separated from your private
                medical records.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-500">
                Your emergency QR
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Ready when needed
              </h2>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6">
              <div className="mx-auto max-w-[230px] rounded-2xl bg-white p-2">
                <QrPattern />
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm font-semibold text-white">
                  {patient.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Emergency HealthPassport · {patient.age} years
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!qrEnabled}
                onClick={showQrModal}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition",
                  qrEnabled
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                )}
              >
                <QrCode size={15} />
                Show QR
              </button>

              <button
                type="button"
                onClick={() =>
                  setPreviewOpen(true)
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Smartphone size={15} />
                Preview
              </button>
            </div>

            <button
              type="button"
              disabled={!qrEnabled}
              onClick={() =>
                setScanOpen(true)
              }
              className={cn(
                "mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-semibold transition",
                qrEnabled
                  ? "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  : "cursor-not-allowed border-slate-100 text-slate-300"
              )}
            >
              <ScanLine size={15} />
              Simulate emergency scan
            </button>

            <button
              type="button"
              onClick={copyEmergencyLink}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[11px] font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            >
              <Copy size={13} />
              Copy emergency link
            </button>
          </section>
        </div>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-500">
              Emergency contacts
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              People who can help
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {contacts.map((contact) => (
              <div
                key={contact.name}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <UserRound size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {contact.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {contact.relationship} · {contact.priority}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      callContact(contact)
                    }
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    <Phone size={14} />
                    Call
                  </button>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  {contact.phone}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                Transparency
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Emergency access activity
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                onNavigate("privacy")
              }
              className="flex items-center gap-1 self-start text-xs font-semibold text-indigo-600"
            >
              Full audit trail
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {qrAccessEvents.length === 0 ? (
              <div className="p-8 text-center">
                <History
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No emergency access yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  QR access events will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {qrAccessEvents
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <QrCode size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {event.title}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {event.actor} · {event.timestamp}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                        Recorded
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle size={19} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Emergency access is not full medical access
                </h3>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                  The Emergency Passport is intentionally limited to selected
                  emergency information. A person accessing the QR does not
                  receive your complete medical records, laboratory history,
                  documents, or private HealthPassport information.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck size={14} />

            <span>
              Emergency profile is patient-controlled
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate("privacy")
            }
            className="flex items-center gap-1 self-start text-[11px] font-semibold text-indigo-600"
          >
            Review privacy controls
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <Modal
        open={showQr}
        onClose={() => setShowQr(false)}
        title="Emergency QR"
        description="Only your selected emergency information is exposed."
      >
        <div className="rounded-3xl bg-slate-950 p-6">
          <div className="mx-auto max-w-[270px] rounded-2xl bg-white p-3">
            <QrPattern compact />
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm font-semibold text-white">
              {patient.name} · Emergency Passport
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Emergency-only access · {patient.age} years
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
          <div className="flex gap-3">
            <ShieldCheck
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-[11px] leading-5 text-emerald-700">
              This demo QR does not provide access to the full HealthPassport.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setShowQr(false)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Done
          </button>
        </div>
      </Modal>

      <Modal
        open={previewOpen}
        onClose={() =>
          setPreviewOpen(false)
        }
        title="Emergency view"
        description="This is what an emergency-access visitor would see."
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="bg-rose-600 p-5 text-white">
            <div className="flex items-center gap-3">
              <HeartPulse size={22} />

              <div>
                <p className="text-sm font-bold">
                  Emergency HealthPassport
                </p>

                <p className="text-[11px] text-rose-100">
                  {patient.name}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-4">
            {enabledFields.map((field) => (
              <div
                key={field.id}
                className="rounded-xl bg-slate-50 p-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {field.label}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-4">
            <div className="flex gap-2">
              <Info
                size={15}
                className="mt-0.5 shrink-0 text-indigo-500"
              />

              <p className="text-[11px] leading-5 text-slate-500">
                Private medical records remain protected.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() =>
              setPreviewOpen(false)
            }
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Close preview
          </button>
        </div>
      </Modal>

      <Modal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        title="Simulate emergency scan"
        description="This demonstrates the emergency access flow."
      >
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
              <ScanLine size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-indigo-900">
                QR scan detected
              </p>

              <p className="mt-1 text-xs leading-5 text-indigo-700">
                The visitor will receive the Emergency Passport containing
                only your explicitly permitted fields.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {enabledFields
            .slice(0, 5)
            .map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3"
              >
                <span className="text-xs text-slate-500">
                  {field.label}
                </span>

                <span className="text-right text-xs font-semibold text-slate-700">
                  {field.value}
                </span>
              </div>
            ))}
        </div>

        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
          <p className="text-[11px] leading-5 text-emerald-700">
            The scan will be recorded in your Privacy & Access audit trail.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              setScanOpen(false)
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={simulateScan}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <ScanLine size={16} />
            Simulate scan
          </button>
        </div>
      </Modal>
    </div>
  );
}