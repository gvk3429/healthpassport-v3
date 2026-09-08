import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  FileText,
  Lock,
  QrCode,
  ShieldCheck,
  Share2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";
import {
  addAuditEvent,
  getPrivacyState,
  savePrivacyState,
} from "../lib/privacyAudit";

interface SharingConsentProps {
  onNavigate?: (page: Page) => void;
}

type RecipientType =
  | "doctor"
  | "hospital"
  | "family"
  | "caregiver";

type AccessDuration =
  | "24h"
  | "7d"
  | "30d"
  | "until-revoked";

interface RecipientOption {
  value: RecipientType;
  label: string;
  description: string;
  icon: typeof UserRound;
}

interface SharedItem {
  id: string;
  label: string;
  description: string;
  selected: boolean;
}

interface ActiveShare {
  id: string;
  recipientName: string;
  recipientType: RecipientType;
  recipientContact: string;
  accessCode: string;
  expiresAt: string;
  items: string[];
}

const PRIVACY_SHARE_KEY =
  "healthpassport-active-share-v1";

const recipientOptions: RecipientOption[] = [
  {
    value: "doctor",
    label: "Doctor",
    description:
      "Share with a healthcare professional",
    icon: UserRound,
  },
  {
    value: "hospital",
    label: "Hospital",
    description:
      "Share with a hospital or care team",
    icon: Users,
  },
  {
    value: "family",
    label: "Family Member",
    description:
      "Give a trusted family member access",
    icon: Users,
  },
  {
    value: "caregiver",
    label: "Caregiver",
    description:
      "Share selected information with a caregiver",
    icon: ShieldCheck,
  },
];

const durationOptions: Array<{
  value: AccessDuration;
  label: string;
  description: string;
}> = [
  {
    value: "24h",
    label: "24 hours",
    description:
      "Automatically expires after one day",
  },
  {
    value: "7d",
    label: "7 days",
    description:
      "Automatically expires after one week",
  },
  {
    value: "30d",
    label: "30 days",
    description:
      "Automatically expires after one month",
  },
  {
    value: "until-revoked",
    label: "Until I revoke",
    description:
      "You control when access ends",
  },
];

const initialItems: SharedItem[] = [
  {
    id: "profile",
    label: "Patient Profile",
    description:
      "Identity, contact and basic profile information",
    selected: true,
  },
  {
    id: "medications",
    label: "Medications",
    description:
      "Current medications and medication history",
    selected: true,
  },
  {
    id: "allergies",
    label: "Allergies",
    description:
      "Known allergies and reactions",
    selected: true,
  },
  {
    id: "conditions",
    label: "Health Conditions",
    description:
      "Diagnoses and important medical conditions",
    selected: true,
  },
  {
    id: "records",
    label: "Medical Records",
    description:
      "Selected reports, prescriptions and documents",
    selected: false,
  },
  {
    id: "timeline",
    label: "Health Timeline",
    description:
      "Chronological history of important health events",
    selected: false,
  },
];

function createAccessCode(): string {
  const first = Math.floor(
    1000 + Math.random() * 9000,
  );

  const second = Math.floor(
    1000 + Math.random() * 9000,
  );

  return `HP-${first}-${second}`;
}

function getDurationLabel(
  duration: AccessDuration,
): string {
  switch (duration) {
    case "24h":
      return "24 hours";
    case "7d":
      return "7 days";
    case "30d":
      return "30 days";
    case "until-revoked":
      return "Until revoked";
    default:
      return "7 days";
  }
}

function getExpiryDate(
  duration: AccessDuration,
): string {
  if (duration === "until-revoked") {
    return "No automatic expiry";
  }

  const date = new Date();

  if (duration === "24h") {
    date.setHours(date.getHours() + 24);
  }

  if (duration === "7d") {
    date.setDate(date.getDate() + 7);
  }

  if (duration === "30d") {
    date.setDate(date.getDate() + 30);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function readActiveShare(): ActiveShare | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored =
      window.localStorage.getItem(
        PRIVACY_SHARE_KEY,
      );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as ActiveShare;
  } catch {
    return null;
  }
}

function writeActiveShare(
  share: ActiveShare | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!share) {
    window.localStorage.removeItem(
      PRIVACY_SHARE_KEY,
    );
  } else {
    window.localStorage.setItem(
      PRIVACY_SHARE_KEY,
      JSON.stringify(share),
    );
  }

  window.dispatchEvent(
    new CustomEvent(
      "healthpassport-privacy-updated",
    ),
  );
}

export default function SharingConsent({
  onNavigate,
}: SharingConsentProps) {
  const [recipientType, setRecipientType] =
    useState<RecipientType>("doctor");

  const [recipientName, setRecipientName] =
    useState("");

  const [recipientContact, setRecipientContact] =
    useState("");

  const [duration, setDuration] =
    useState<AccessDuration>("7d");

  const [sharedItems, setSharedItems] =
    useState<SharedItem[]>(initialItems);

  const [activeShare, setActiveShare] =
    useState<ActiveShare | null>(null);

  const [showReview, setShowReview] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [showQr, setShowQr] =
    useState(false);

  const [accessCode, setAccessCode] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    const loadShare = () => {
      const share = readActiveShare();

      setActiveShare(share);

      if (share) {
        setAccessCode(share.accessCode);
      }
    };

    loadShare();

    window.addEventListener(
      "healthpassport-privacy-updated",
      loadShare,
    );

    return () => {
      window.removeEventListener(
        "healthpassport-privacy-updated",
        loadShare,
      );
    };
  }, []);

  const selectedRecipient =
    useMemo<RecipientOption>(() => {
      return (
        recipientOptions.find(
          (option) =>
            option.value === recipientType,
        ) ?? recipientOptions[0]
      );
    }, [recipientType]);

  const selectedItems = useMemo(
    () =>
      sharedItems.filter(
        (item) => item.selected,
      ),
    [sharedItems],
  );

  const canContinue =
    recipientName.trim().length > 0 &&
    recipientContact.trim().length > 0 &&
    selectedItems.length > 0;

  const toggleItem = (id: string) => {
    setSharedItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
            }
          : item,
      ),
    );
  };

  const selectAll = () => {
    setSharedItems((current) =>
      current.map((item) => ({
        ...item,
        selected: true,
      })),
    );
  };

  const clearAll = () => {
    setSharedItems((current) =>
      current.map((item) => ({
        ...item,
        selected: false,
      })),
    );
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    setShowReview(true);
  };

  const handleCreateShare = () => {
    const newAccessCode =
      createAccessCode();

    const newShare: ActiveShare = {
      id: `share-${Date.now()}`,
      recipientName:
        recipientName.trim(),
      recipientType,
      recipientContact:
        recipientContact.trim(),
      accessCode: newAccessCode,
      expiresAt:
        getExpiryDate(duration),
      items: selectedItems.map(
        (item) => item.label,
      ),
    };

    const privacyState =
      getPrivacyState();

    const timestamp =
      new Date().toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
      );

    addAuditEvent({
      type: "document_shared",
      title: "Health information shared",
      actor: "You",
      scope: selectedItems
        .map((item) => item.label)
        .join(" + "),
      purpose:
        "Secure HealthPassport sharing",
      timestamp,
      status: "success",
    });

    const updatedState = {
      ...privacyState,
    };

    savePrivacyState(
      updatedState,
    );

    writeActiveShare(newShare);

    setActiveShare(newShare);
    setAccessCode(newAccessCode);
    setShowReview(false);
    setShowSuccess(true);
  };

  const handleCopyCode = async () => {
    if (!accessCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        accessCode,
      );
    } catch {
      // Clipboard may not be available in the POC.
    }

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const handleRevoke = () => {
    if (!activeShare) {
      return;
    }

    const privacyState =
      getPrivacyState();

    const timestamp =
      new Date().toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
      );

    addAuditEvent({
      type: "doctor_revoked",
      title: "Shared access revoked",
      actor: "You",
      scope:
        activeShare.items.join(
          " + ",
        ),
      purpose:
        "Revoke HealthPassport sharing",
      timestamp,
      status: "success",
    });

    savePrivacyState(
      privacyState,
    );

    writeActiveShare(null);

    setActiveShare(null);
    setAccessCode("");
    setShowSuccess(false);
  };

  const handleNewShare = () => {
    setRecipientName("");
    setRecipientContact("");
    setRecipientType("doctor");
    setDuration("7d");
    setSharedItems(initialItems);
    setShowSuccess(false);
    setShowReview(false);
    setAccessCode("");
  };

  const RecipientIcon =
    selectedRecipient.icon;

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-300">
              <Share2 className="h-4 w-4" />
              Secure Health Sharing
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Share HealthPassport
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Give trusted people access to the health
              information they need — while keeping you
              in control.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate?.("privacy")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
          >
            <Lock className="h-4 w-4" />
            Privacy Center
          </button>
        </div>

        {/* Security banner */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-slate-900 to-indigo-500/[0.08] p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  You stay in control
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Every share is consent-based, time-limited,
                  recorded in your privacy audit and revocable
                  at any time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
                <div className="text-lg font-semibold">
                  100%
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Consent
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
                <div className="text-lg font-semibold">
                  Secure
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Access
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
                <div className="text-lg font-semibold">
                  Live
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Audit
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active share */}
        {activeShare && (
          <div className="mb-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      Active share
                    </h3>

                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                      ACTIVE
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {activeShare.recipientName} has access to{" "}
                    {activeShare.items.length} selected health
                    information categories.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>
                      Code:{" "}
                      <span className="font-medium text-slate-300">
                        {activeShare.accessCode}
                      </span>
                    </span>

                    <span>•</span>

                    <span>
                      Expires:{" "}
                      <span className="font-medium text-slate-300">
                        {activeShare.expiresAt}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRevoke}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
              >
                <X className="h-4 w-4" />
                Revoke Access
              </button>
            </div>
          </div>
        )}

        {!showSuccess && (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            {/* Recipient */}
            <div className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="mb-5">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-semibold text-cyan-300">
                      01
                    </span>

                    <h2 className="font-semibold">
                      Who are you sharing with?
                    </h2>
                  </div>

                  <p className="ml-9 text-sm text-slate-500">
                    Select the type of recipient.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {recipientOptions.map(
                    (option) => {
                      const Icon =
                        option.icon;

                      const selected =
                        recipientType ===
                        option.value;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() =>
                            setRecipientType(
                              option.value,
                            )
                          }
                          className={`rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-cyan-400/40 bg-cyan-400/[0.08]"
                              : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                selected
                                  ? "bg-cyan-400/15 text-cyan-300"
                                  : "bg-white/[0.05] text-slate-400"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-medium">
                                  {option.label}
                                </span>

                                {selected && (
                                  <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                                )}
                              </div>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {
                                  option.description
                                }
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Name
                    </span>

                    <input
                      value={
                        recipientName
                      }
                      onChange={(event) =>
                        setRecipientName(
                          event.target
                            .value,
                        )
                      }
                      placeholder="e.g. Dr. Priya Sharma"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Email or phone
                    </span>

                    <input
                      value={
                        recipientContact
                      }
                      onChange={(event) =>
                        setRecipientContact(
                          event.target
                            .value,
                        )
                      }
                      placeholder="recipient@example.com"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                    />
                  </label>
                </div>
              </section>

              {/* Information */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-400/10 text-xs font-semibold text-indigo-300">
                        02
                      </span>

                      <h2 className="font-semibold">
                        What should they see?
                      </h2>
                    </div>

                    <p className="ml-9 text-sm text-slate-500">
                      Only selected categories are shared.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-400/10"
                    >
                      Select all
                    </button>

                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/5"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {sharedItems.map(
                    (item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          toggleItem(
                            item.id,
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                          item.selected
                            ? "border-cyan-400/20 bg-cyan-400/[0.05]"
                            : "border-white/5 bg-black/10 hover:border-white/10"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            item.selected
                              ? "bg-cyan-400/15 text-cyan-300"
                              : "bg-white/[0.04] text-slate-600"
                          }`}
                        >
                          {item.selected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">
                            {item.label}
                          </div>

                          <div className="mt-0.5 text-xs text-slate-500">
                            {
                              item.description
                            }
                          </div>
                        </div>

                        <div
                          className={`h-5 w-5 rounded-full border ${
                            item.selected
                              ? "border-cyan-300 bg-cyan-300"
                              : "border-slate-600"
                          }`}
                        >
                          {item.selected && (
                            <Check className="h-full w-full p-0.5 text-slate-950" />
                          )}
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="mb-5">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/10 text-xs font-semibold text-violet-300">
                      03
                    </span>

                    <h2 className="font-semibold">
                      How long should access last?
                    </h2>
                  </div>

                  <p className="ml-9 text-sm text-slate-500">
                    Access automatically ends based on your selection.
                  </p>
                </div>

                <div className="space-y-2">
                  {durationOptions.map(
                    (option) => {
                      const selected =
                        duration ===
                        option.value;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() =>
                            setDuration(
                              option.value,
                            )
                          }
                          className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                            selected
                              ? "border-violet-400/30 bg-violet-400/[0.07]"
                              : "border-white/5 bg-black/10 hover:border-white/10"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              selected
                                ? "bg-violet-400/15 text-violet-300"
                                : "bg-white/[0.04] text-slate-500"
                            }`}
                          >
                            <Clock3 className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium">
                              {
                                option.label
                              }
                            </div>

                            <div className="mt-0.5 text-xs text-slate-500">
                              {
                                option.description
                              }
                            </div>
                          </div>

                          <div
                            className={`h-5 w-5 rounded-full border p-1 ${
                              selected
                                ? "border-violet-300"
                                : "border-slate-600"
                            }`}
                          >
                            {selected && (
                              <div className="h-full w-full rounded-full bg-violet-300" />
                            )}
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                    <ShieldCheck className="h-5 w-5 text-cyan-300" />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Sharing preview
                    </h2>

                    <p className="text-xs text-slate-500">
                      Review before generating access.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Recipient
                    </span>

                    <span className="text-right text-sm font-medium">
                      {recipientName ||
                        "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Type
                    </span>

                    <span className="text-sm text-slate-300">
                      {
                        selectedRecipient.label
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Information
                    </span>

                    <span className="text-sm text-slate-300">
                      {
                        selectedItems.length
                      }{" "}
                      categories
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Duration
                    </span>

                    <span className="text-sm text-slate-300">
                      {
                        getDurationLabel(
                          duration,
                        )
                      }
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

                  <p className="text-xs leading-5 text-slate-400">
                    Your consent is recorded in the HealthPassport
                    privacy audit. You can revoke access at any time.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={handleContinue}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Review & Share
                  <ChevronRight className="h-4 w-4" />
                </button>
              </section>
            </div>
          </div>
        )}

        {/* Success */}
        {showSuccess && (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-6 text-center sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
                <CheckCircle2 className="h-9 w-9 text-emerald-300" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Health information shared securely
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                {recipientName} can now access the selected
                HealthPassport information using the secure access
                code below.
              </p>

              <div className="mx-auto mt-7 max-w-md rounded-3xl border border-white/10 bg-black/20 p-6">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Secure Access Code
                </div>

                <div className="mt-3 text-3xl font-bold tracking-[0.18em] text-cyan-300">
                  {accessCode}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy code
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div className="text-xs text-slate-500">
                    Recipient
                  </div>

                  <div className="mt-1 text-sm font-medium">
                    {recipientName}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div className="text-xs text-slate-500">
                    Access expires
                  </div>

                  <div className="mt-1 text-sm font-medium">
                    {getExpiryDate(
                      duration,
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    setShowQr(true)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium"
                >
                  <QrCode className="h-4 w-4" />
                  Show QR
                </button>

                <button
                  type="button"
                  onClick={handleNewShare}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  <Share2 className="h-4 w-4" />
                  Share With Someone Else
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review modal */}
        {showReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold">
                    Review sharing consent
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Confirm what you are about to share.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowReview(false)
                  }
                  className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                      <RecipientIcon className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        Sharing with
                      </div>

                      <div className="font-medium">
                        {recipientName}
                      </div>

                      <div className="text-xs text-slate-500">
                        {
                          selectedRecipient.label
                        }{" "}
                        · {recipientContact}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Information included
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedItems.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />

                          <span className="text-sm text-slate-300">
                            {item.label}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                    <div className="text-xs text-slate-500">
                      Duration
                    </div>

                    <div className="mt-1 text-sm font-medium">
                      {
                        getDurationLabel(
                          duration,
                        )
                      }
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                    <div className="text-xs text-slate-500">
                      Expiration
                    </div>

                    <div className="mt-1 text-sm font-medium">
                      {
                        getExpiryDate(
                          duration,
                        )
                      }
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

                  <p className="text-xs leading-5 text-slate-400">
                    By continuing, you consent to sharing only the
                    information listed above. This action will be
                    recorded in your privacy audit.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() =>
                    setShowReview(false)
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300"
                >
                  Go Back
                </button>

                <button
                  type="button"
                  onClick={
                    handleCreateShare
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Confirm & Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR modal */}
        {showQr && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">
                  Secure Access QR
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowQr(false)
                  }
                  className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-3xl border border-white/10 bg-white p-5">
                <div className="grid h-full w-full grid-cols-7 gap-1">
                  {Array.from({
                    length: 49,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={`rounded-[2px] ${
                          (index * 17 + 11) %
                            5 <
                          2
                            ? "bg-slate-950"
                            : "bg-white"
                        }`}
                      />
                    ),
                  )}
                </div>
              </div>

              <div className="mt-5 text-2xl font-bold tracking-[0.15em] text-cyan-300">
                {accessCode}
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Demo QR representation for the HealthPassport
                investor experience.
              </p>

              <button
                type="button"
                onClick={handleCopyCode}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium"
              >
                <Copy className="h-4 w-4" />
                {copied
                  ? "Copied"
                  : "Copy access code"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}