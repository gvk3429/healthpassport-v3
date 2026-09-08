import { useMemo, useState } from "react";
import type { Page } from "../components/AppSidebar";
import {
  allergies as demoAllergies,
  conditions as demoConditions,
  medications as demoMedications,
  patient as demoPatient,
} from "../data/mockHealthData";
import {
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  HeartPulse,
  Info,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  RefreshCw,
  Shield,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";

interface EmergencyPassportProps {
  onNavigate: (page: Page) => void;
}

type DemoStep =
  | "passport"
  | "scanned"
  | "location"
  | "contact"
  | "protected"
  | "otp"
  | "unlocked";

interface EmergencyItem {
  label: string;
  value: string;
  critical?: boolean;
}

const patient = {
  name: demoPatient.name,
  age: `${demoPatient.age} years`,
  bloodGroup: demoPatient.bloodGroup,
  allergy: demoAllergies[0]?.name ?? "Penicillin",
  condition: demoConditions[0]?.name ?? "Type 2 Diabetes",
  medication: demoMedications[0]
    ? `${demoMedications[0].name} ${demoMedications[0].dosage}`
    : "Metformin 500 mg",
  instruction:
    "Keep prescribed medication accessible. Follow your emergency care plan.",
  contactName: "Emergency contact",
  contactRelationship: "Protected contact",
};

const permittedInformation: EmergencyItem[] = [
  {
    label: "Blood group",
    value: patient.bloodGroup,
    critical: true,
  },
  {
    label: "Critical allergy",
    value: patient.allergy,
    critical: true,
  },
  {
    label: "Medical condition",
    value: patient.condition,
    critical: true,
  },
  {
    label: "Critical medication",
    value: patient.medication,
  },
];

const protectedRecords = [
  {
    title: "Latest laboratory report",
    description: "Recent blood work and observations",
  },
  {
    title: "Medication history",
    description: "Current and historical prescriptions",
  },
  {
    title: "Clinical documents",
    description: "Hospital, consultation and diagnostic records",
  },
];

const qrPattern = [
  "111111101001101111111",
  "100000100110101000001",
  "101110101011101011101",
  "101110100101001011101",
  "101110101111101011101",
  "100000101010101000001",
  "111111101010101111111",
  "000000001101100000000",
  "110101111011011010111",
  "001110010110101100100",
  "111001101011110011011",
  "010110010101001110100",
  "101101111010111001101",
  "000000001011001010010",
  "111111101101111010101",
  "100000101011001101110",
  "101110100110111001001",
  "101110101001010111010",
  "101110101110101001101",
  "100000101001011110010",
  "111111101110100101101",
];

function getStepLabel(step: DemoStep) {
  switch (step) {
    case "passport":
      return "Emergency Passport";
    case "scanned":
      return "QR scanned";
    case "location":
      return "Location shared";
    case "contact":
      return "Contact notified";
    case "protected":
      return "Protected access requested";
    case "otp":
      return "Consent verification";
    case "unlocked":
      return "Protected records unlocked";
    default:
      return "Emergency Passport";
  }
}

function QRVisual() {
  return (
    <div className="relative flex aspect-square w-full max-w-[260px] items-center justify-center rounded-[28px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
      <div
        className="grid aspect-square w-full gap-[2px]"
        style={{
          gridTemplateColumns: "repeat(21, minmax(0, 1fr))",
          gridTemplateRows: "repeat(21, minmax(0, 1fr))",
        }}
        aria-label="HealthPassport Emergency QR"
      >
        {qrPattern.flatMap((row, rowIndex) =>
          row.split("").map((cell, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              className={`aspect-square rounded-[1px] ${
                cell === "1" ? "bg-slate-950" : "bg-white"
              }`}
            />
          )),
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-slate-950 text-white shadow-lg">
          <HeartPulse size={22} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? <Check size={13} /> : <Clock3 size={13} />}
      {children}
    </span>
  );
}

function EmergencyInfoCard({ item }: { item: EmergencyItem }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {item.label}
          </p>

          <p className="mt-1.5 text-sm font-semibold text-slate-800">
            {item.value}
          </p>
        </div>

        {item.critical && (
          <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600">
            Critical
          </span>
        )}
      </div>
    </div>
  );
}

export default function EmergencyPassport({
  onNavigate,
}: EmergencyPassportProps) {
  const [step, setStep] = useState<DemoStep>("passport");
  const [locationShared, setLocationShared] = useState(false);
  const [contactNotified, setContactNotified] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScanPreview, setShowScanPreview] = useState(false);

  const progress = useMemo(() => {
    switch (step) {
      case "scanned":
        return 25;

      case "location":
        return 50;

      case "contact":
      case "protected":
      case "otp":
        return 75;

      case "unlocked":
        return 100;

      case "passport":
      default:
        return 0;
    }
  }, [step]);

  const simulateScan = () => {
    setShowScanPreview(false);
    setStep("scanned");
  };

  const shareLocation = () => {
    setLocationShared(true);
    setStep("location");
  };

  const notifyContact = () => {
    setContactNotified(true);
    setStep("contact");
  };

  const requestProtectedAccess = () => {
    setAccessRequested(true);
    setStep("protected");
  };

  const beginOtp = () => {
    setOtp("");
    setOtpError(false);
    setStep("otp");
  };

  const verifyOtp = () => {
    if (otp === "2048") {
      setOtpError(false);
      setStep("unlocked");
      return;
    }

    setOtpError(true);
  };

  const resetDemo = () => {
    setStep("passport");
    setLocationShared(false);
    setContactNotified(false);
    setAccessRequested(false);
    setOtp("");
    setOtpError(false);
    setCopied(false);
    setShowScanPreview(false);
  };

  const copyDemoLink = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://demo.healthpassport.app/emergency/HP-2026-00128",
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-500">
            <ShieldCheck size={15} />
            Emergency response
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Emergency Passport
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Critical information when it matters most — with protected health
            records kept behind explicit consent.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Reset demo
          </button>

          <button
            type="button"
            onClick={() => onNavigate("sharing")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Sharing & Consent
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Emergency response demo
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {getStepLabel(step)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-xs font-semibold text-slate-500">
              {progress}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 divide-x divide-slate-100 sm:grid-cols-4">
          <div className="p-4">
            <StatusBadge active={step !== "passport"}>
              QR scanned
            </StatusBadge>
          </div>

          <div className="p-4">
            <StatusBadge active={locationShared}>
              Location shared
            </StatusBadge>
          </div>

          <div className="p-4">
            <StatusBadge active={contactNotified}>
              Contact notified
            </StatusBadge>
          </div>

          <div className="p-4">
            <StatusBadge active={step === "unlocked"}>
              Records unlocked
            </StatusBadge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="overflow-hidden rounded-[28px] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-orange-50 shadow-sm">
          <div className="flex items-start justify-between gap-4 p-6 sm:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm">
                <QrCode size={14} />
                Emergency QR
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Scan to access critical information
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                A finder or clinician can see only the emergency information
                permitted by the patient. Full medical records remain
                protected.
              </p>
            </div>

            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm sm:flex">
              <Shield size={22} />
            </div>
          </div>

          <div className="grid gap-6 px-6 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-[260px_1fr] lg:items-center">
            <div className="flex justify-center">
              <QRVisual />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Patient
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {patient.name}
                    </p>

                    <p className="mt-0.5 text-sm text-slate-500">
                      {patient.age} · HealthPassport ID HP-2026-00128
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Privacy boundary active
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      Emergency QR does not expose the patient's full medical
                      record.
                    </p>
                  </div>
                </div>
              </div>

              {step === "passport" ? (
                <button
                  type="button"
                  onClick={() => setShowScanPreview(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
                >
                  <Smartphone size={17} />
                  Simulate QR Scan
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        QR successfully scanned
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Emergency profile is available without exposing
                        protected records.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                QR-visible information
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Emergency profile
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <HeartPulse size={20} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {permittedInformation.map((item) => (
              <EmergencyInfoCard key={item.label} item={item} />
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Important instruction
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  {patient.instruction}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <LockKeyhole size={14} />
            Only explicitly permitted emergency data is shown.
          </div>
        </section>
      </div>

      {step !== "passport" && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                Emergency response
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Act without exposing private records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The responder can coordinate help while protected data remains
                behind patient consent.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={shareLocation}
                disabled={locationShared}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  locationShared
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {locationShared ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <MapPin size={16} />
                )}

                {locationShared ? "Location Shared" : "Share Location"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("contact");
                  setContactNotified(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                <Ambulance size={16} />
                Call Ambulance
              </button>

              <button
                type="button"
                onClick={notifyContact}
                disabled={contactNotified}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  contactNotified
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {contactNotified ? (
                  <Check size={16} />
                ) : (
                  <MessageCircle size={16} />
                )}

                {contactNotified
                  ? "Contact Notified"
                  : "Notify Emergency Contact"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <MapPin size={18} className="text-slate-500" />

              <p className="mt-3 text-sm font-semibold text-slate-800">
                Location
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {locationShared
                  ? "Current location shared with emergency responders."
                  : "Not shared yet."}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <Phone size={18} className="text-slate-500" />

              <p className="mt-3 text-sm font-semibold text-slate-800">
                Emergency contact
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {contactNotified
                  ? `${patient.contactName} notified securely. Phone number hidden.`
                  : `${patient.contactName} · ${patient.contactRelationship}`}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <Ambulance size={18} className="text-slate-500" />

              <p className="mt-3 text-sm font-semibold text-slate-800">
                Ambulance
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Demo action represents the emergency-call workflow.
              </p>
            </div>
          </div>
        </section>
      )}

      {step !== "passport" && (
        <section className="rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
                <LockKeyhole size={14} />
                Protected medical records
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Need more clinical information?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                The emergency QR intentionally stops at critical information.
                A responder can request protected records, but access requires
                explicit patient consent and verification.
              </p>

              {step === "protected" ||
              step === "otp" ||
              step === "unlocked" ? (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                  <CheckCircle2 size={15} />
                  Protected access request created
                </div>
              ) : null}
            </div>

            <div className="w-full max-w-sm">
              {step === "unlocked" ? (
                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Access approved
                      </p>

                      <p className="text-xs text-slate-500">
                        Protected records are temporarily available.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {protectedRecords.map((record) => (
                      <div
                        key={record.title}
                        className="rounded-xl bg-slate-50 p-3"
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {record.title}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {record.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate("records")}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    View Medical Records
                    <ArrowRight size={15} />
                  </button>
                </div>
              ) : step === "otp" ? (
                <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Verify patient consent
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Enter the demo OTP sent to the patient's verified
                        contact.
                      </p>
                    </div>

                    <LockKeyhole size={18} className="text-indigo-500" />
                  </div>

                  <input
                    value={otp}
                    onChange={(event) => {
                      setOtp(
                        event.target.value.replace(/\D/g, "").slice(0, 4),
                      );
                      setOtpError(false);
                    }}
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    className={`mt-4 w-full rounded-xl border bg-white px-4 py-3 text-center text-lg font-bold tracking-[0.35em] text-slate-800 outline-none transition focus:ring-2 ${
                      otpError
                        ? "border-rose-300 focus:ring-rose-100"
                        : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100"
                    }`}
                  />

                  {otpError && (
                    <p className="mt-2 text-center text-xs font-semibold text-rose-600">
                      Demo OTP is 2048.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otp.length !== 4}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ShieldCheck size={16} />
                    Verify & Unlock
                  </button>

                  <p className="mt-3 text-center text-[11px] text-slate-400">
                    Demo only · no real patient data is being transmitted.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <LockKeyhole size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Protected records are locked
                      </p>

                      <p className="text-xs text-slate-500">
                        Consent is required before access.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      accessRequested ? beginOtp : requestProtectedAccess
                    }
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    {accessRequested ? (
                      <>
                        Verify Patient Consent
                        <ArrowRight size={15} />
                      </>
                    ) : (
                      <>
                        Request Protected Access
                        <Eye size={15} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Info size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Demo privacy boundary
              </p>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                Emergency access is intentionally layered: critical
                information first, protected medical records only after
                explicit consent. This prototype simulates the workflow
                entirely in the frontend.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyDemoLink}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy demo link"}
          </button>
        </div>
      </section>

      {showScanPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-rose-500">
                  QR scanner
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Emergency QR detected
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowScanPreview(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                aria-label="Close QR scanner"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-5">
                <QRVisual />

                <div className="absolute left-5 right-5 top-1/2 h-0.5 bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.9)]" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-center">
              <p className="text-sm font-semibold text-emerald-800">
                HealthPassport QR verified
              </p>

              <p className="mt-1 text-xs text-emerald-700">
                Limited emergency information can now be viewed.
              </p>
            </div>

            <button
              type="button"
              onClick={simulateScan}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
            >
              Open Emergency Profile
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}