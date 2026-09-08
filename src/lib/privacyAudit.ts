// src/lib/privacyAudit.ts

export type ConsentStatus = "active" | "expired" | "revoked";

export type AuditEventType =
  | "document_uploaded"
  | "document_viewed"
  | "document_deleted"
  | "document_shared"
  | "qr_accessed"
  | "doctor_granted"
  | "doctor_revoked"
  | "health_exported"
  | "health_deleted"
  | "ai_analysis"
   | "profile_updated";

export interface ConsentRecord {
  id: string;
  recipientName: string;
  recipientRole: string;
  organization: string;
  purpose: string;
  scope: string[];
  method: string;
  grantedAt: string;
  expiresAt: string;
  status: ConsentStatus;
  revokedAt?: string;
}

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  title: string;
  actor: string;
  scope: string;
  purpose: string;
  timestamp: string;
  status?: "success" | "info" | "warning";
}

export interface PrivacyState {
  consents: ConsentRecord[];
  audit: AuditEvent[];
  exportCount: number;
  lastExportAt?: string;
  deletionRequested: boolean;
}

const STORAGE_KEY = "healthpassport-privacy-state-v1";

const initialState: PrivacyState = {
  consents: [
    {
      id: "consent-anil-active",
      recipientName: "Dr. Anil Rao",
      recipientRole: "Diabetologist",
      organization: "Apollo Hospitals",
      purpose: "Diabetes consultation",
      scope: ["Medical records", "Laboratory history"],
      method: "Secure link",
      grantedAt: "Today, 11:42 AM",
      expiresAt: "Today, 3:30 PM",
      status: "active",
    },
    {
      id: "consent-meera-expired",
      recipientName: "Dr. Meera Shah",
      recipientRole: "Physician",
      organization: "City Diagnostic Centre",
      purpose: "Review laboratory results",
      scope: ["Laboratory history"],
      method: "OTP",
      grantedAt: "Aug 28, 2:10 PM",
      expiresAt: "Aug 29, 2:10 PM",
      status: "expired",
    },
    {
      id: "consent-anil-revoked",
      recipientName: "Dr. Anil Rao",
      recipientRole: "Diabetologist",
      organization: "Apollo Hospitals",
      purpose: "Previous diabetes consultation",
      scope: ["Medical records", "Laboratory history"],
      method: "Secure link",
      grantedAt: "Aug 20, 10:15 AM",
      expiresAt: "Aug 20, 6:15 PM",
      status: "revoked",
      revokedAt: "Aug 20, 4:05 PM",
    },
  ],

  audit: [
    {
      id: "audit-1",
      type: "doctor_granted",
      title: "Doctor access granted",
      actor: "You",
      scope: "Medical records + Laboratory history",
      purpose: "Diabetes consultation",
      timestamp: "Today, 11:42 AM",
      status: "success",
    },
    {
      id: "audit-2",
      type: "document_viewed",
      title: "Medical record viewed",
      actor: "Dr. Anil Rao",
      scope: "Diabetes records",
      purpose: "Diabetes consultation",
      timestamp: "Today, 11:51 AM",
      status: "info",
    },
    {
      id: "audit-3",
      type: "qr_accessed",
      title: "Emergency QR viewed",
      actor: "Emergency responder",
      scope: "Emergency profile",
      purpose: "Emergency access",
      timestamp: "Yesterday, 8:24 PM",
      status: "warning",
    },
    {
      id: "audit-4",
      type: "ai_analysis",
      title: "AI health analysis performed",
      actor: "HealthPassport AI",
      scope: "Selected health records",
      purpose: "Generate health insights",
      timestamp: "Yesterday, 5:12 PM",
      status: "info",
    },
    {
      id: "audit-5",
      type: "doctor_revoked",
      title: "Doctor access revoked",
      actor: "You",
      scope: "Medical records + Laboratory history",
      purpose: "Previous diabetes consultation",
      timestamp: "Aug 20, 4:05 PM",
      status: "success",
    },
    {
      id: "audit-6",
      type: "document_uploaded",
      title: "Medical record uploaded",
      actor: "You",
      scope: "Laboratory report",
      purpose: "Add health record",
      timestamp: "Aug 18, 9:34 AM",
      status: "success",
    },
  ],

  exportCount: 0,
  deletionRequested: false,
};

function cloneInitialState(): PrivacyState {
  return JSON.parse(JSON.stringify(initialState)) as PrivacyState;
}

export function getPrivacyState(): PrivacyState {
  if (typeof window === "undefined") {
    return cloneInitialState();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      const fresh = cloneInitialState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }

    return JSON.parse(stored) as PrivacyState;
  } catch {
    return cloneInitialState();
  }
}

export function savePrivacyState(state: PrivacyState): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  window.dispatchEvent(
    new CustomEvent("healthpassport-privacy-updated"),
  );
}

export function addAuditEvent(
  event: Omit<AuditEvent, "id">,
): AuditEvent {
  const state = getPrivacyState();

  const newEvent: AuditEvent = {
    ...event,
    id: `audit-${Date.now()}`,
  };

  state.audit = [newEvent, ...state.audit];

  savePrivacyState(state);

  return newEvent;
}

export function recordHealthExport(
  scope: string,
): PrivacyState {
  const state = getPrivacyState();

  const timestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  state.exportCount += 1;
  state.lastExportAt = timestamp;

  state.audit = [
    {
      id: `audit-export-${Date.now()}`,
      type: "health_exported",
      title: "Health data export completed",
      actor: "You",
      scope,
      purpose: "Personal data export",
      timestamp,
      status: "success",
    },
    ...state.audit,
  ];

  savePrivacyState(state);

  return state;
}

export function recordHealthDeletionRequest(): PrivacyState {
  const state = getPrivacyState();

  const timestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  state.deletionRequested = true;

  state.audit = [
    {
      id: `audit-delete-${Date.now()}`,
      type: "health_deleted",
      title: "Health data deletion requested",
      actor: "You",
      scope: "HealthPassport account",
      purpose: "Delete personal health data",
      timestamp,
      status: "warning",
    },
    ...state.audit,
  ];

  savePrivacyState(state);

  return state;
}

export function revokeConsent(consentId: string): PrivacyState {
  const state = getPrivacyState();

  const timestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const consent = state.consents.find(
    (item) => item.id === consentId,
  );

  if (!consent) {
    return state;
  }

  consent.status = "revoked";
  consent.revokedAt = timestamp;

  state.audit = [
    {
      id: `audit-revoke-${Date.now()}`,
      type: "doctor_revoked",
      title: "Doctor access revoked",
      actor: "You",
      scope: consent.scope.join(" + "),
      purpose: consent.purpose,
      timestamp,
      status: "success",
    },
    ...state.audit,
  ];

  savePrivacyState(state);

  return state;
}

export function resetPrivacyDemo(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent("healthpassport-privacy-updated"),
  );
}