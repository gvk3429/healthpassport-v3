import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  Edit3,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { addAuditEvent } from "../lib/privacyAudit";

const PROFILE_STORAGE_KEY = "healthpassport-patient-profile-v1";

export interface PatientProfileData {
  healthPassportId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  mobile: string;
  email: string;
  location: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const defaultProfile: PatientProfileData = {
  healthPassportId: "HP-IND-2048-7319",
  fullName: "Arjun Rao",
  dateOfBirth: "14 March 1992",
  gender: "Male",
  bloodGroup: "O+",
  mobile: "+91 98765 43210",
  email: "arjun.rao@example.com",
  location: "Bengaluru, Karnataka",
  emergencyContactName: "Priya Rao",
  emergencyContactPhone: "+91 98765 12345",
};

function getProfile(): PatientProfileData {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const stored = window.localStorage.getItem(
      PROFILE_STORAGE_KEY,
    );

    if (!stored) {
      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(defaultProfile),
      );

      return defaultProfile;
    }

    return {
      ...defaultProfile,
      ...(JSON.parse(stored) as Partial<PatientProfileData>),
    };
  } catch {
    return defaultProfile;
  }
}

function saveProfile(profile: PatientProfileData) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );

  window.dispatchEvent(
    new CustomEvent("healthpassport-profile-updated"),
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface PatientProfileProps {
  onNavigate?: (page: string) => void;
}

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}

function ProfileField({
  label,
  value,
  icon: Icon,
}: ProfileFieldProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
          <Icon size={16} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-[12px] font-bold text-slate-800">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PatientProfile({
  onNavigate,
}: PatientProfileProps) {
  const [profile, setProfile] =
    useState<PatientProfileData>(() => getProfile());

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] =
    useState<PatientProfileData>(() => getProfile());

  const [notice, setNotice] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const refresh = () => {
      const nextProfile = getProfile();

      setProfile(nextProfile);
      setDraft(nextProfile);
    };

    window.addEventListener(
      "healthpassport-profile-updated",
      refresh,
    );

    return () => {
      window.removeEventListener(
        "healthpassport-profile-updated",
        refresh,
      );
    };
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const completeness = useMemo(() => {
    const fields: Array<keyof PatientProfileData> = [
      "fullName",
      "dateOfBirth",
      "gender",
      "bloodGroup",
      "mobile",
      "email",
      "location",
      "emergencyContactName",
      "emergencyContactPhone",
    ];

    const completed = fields.filter(
      (field) => profile[field].trim().length > 0,
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const handleEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const handleSave = () => {
    const cleanedProfile: PatientProfileData = {
      ...draft,
      fullName: draft.fullName.trim(),
      dateOfBirth: draft.dateOfBirth.trim(),
      gender: draft.gender.trim(),
      bloodGroup: draft.bloodGroup.trim(),
      mobile: draft.mobile.trim(),
      email: draft.email.trim(),
      location: draft.location.trim(),
      emergencyContactName:
        draft.emergencyContactName.trim(),
      emergencyContactPhone:
        draft.emergencyContactPhone.trim(),
    };

    saveProfile(cleanedProfile);
    setProfile(cleanedProfile);
    setDraft(cleanedProfile);
    setEditing(false);

    addAuditEvent({
      type: "profile_updated",
      title: "Patient profile updated",
      actor: "You",
      scope: "Patient identity and profile",
      purpose: "Keep patient information current",
      timestamp: "Just now",
      status: "success",
    });

    setNotice("Your patient profile has been updated.");
  };

  const updateDraft = (
    field: keyof PatientProfileData,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="mx-auto max-w-[1450px]">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <UserRound size={14} />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">
              Patient Identity
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Patient Profile
          </h1>

          <p className="mt-1 max-w-2xl text-[12px] leading-5 text-slate-500">
            Your identity, contact information and essential
            patient details — securely organized in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-[11px] font-black text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
        >
          <Edit3 size={14} />
          Edit Profile
        </button>
      </div>

      {/* =====================================================
          IDENTITY HERO
          ===================================================== */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-card">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-5 py-6 sm:px-7">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-black text-white ring-1 ring-white/20 backdrop-blur">
                {getInitials(profile.fullName)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-white">
                    {profile.fullName}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white backdrop-blur">
                    <ShieldCheck size={10} />
                    Verified
                  </span>
                </div>

                <p className="mt-1 text-[10px] font-medium text-blue-100">
                  HealthPassport ID
                </p>

                <p className="mt-0.5 font-mono text-[11px] font-bold tracking-wide text-white">
                  {profile.healthPassportId}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-blue-100">
                Identity status
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />

                <span className="text-[11px] font-black text-white">
                  Identity verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            PROFILE BODY
            =================================================== */}
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px] lg:p-7">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-black text-slate-900">
                  Personal information
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Core identity information associated with your
                  HealthPassport.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileField
                label="Full name"
                value={profile.fullName}
                icon={UserRound}
              />

              <ProfileField
                label="Date of birth"
                value={profile.dateOfBirth}
                icon={Activity}
              />

              <ProfileField
                label="Gender"
                value={profile.gender}
                icon={UserRound}
              />

              <ProfileField
                label="Blood group"
                value={profile.bloodGroup}
                icon={Heart}
              />
            </div>

            <div className="mb-4 mt-7">
              <h3 className="text-[13px] font-black text-slate-900">
                Contact information
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                How healthcare providers and trusted contacts can
                reach you.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileField
                label="Mobile"
                value={profile.mobile}
                icon={Phone}
              />

              <ProfileField
                label="Email"
                value={profile.email}
                icon={Mail}
              />

              <ProfileField
                label="Location"
                value={profile.location}
                icon={MapPin}
              />
            </div>

            <div className="mb-4 mt-7">
              <h3 className="text-[13px] font-black text-slate-900">
                Emergency contact
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                The person to contact when urgent assistance is
                required.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileField
                label="Contact name"
                value={profile.emergencyContactName}
                icon={AlertCircle}
              />

              <ProfileField
                label="Contact phone"
                value={profile.emergencyContactPhone}
                icon={Phone}
              />
            </div>
          </div>

          {/* =================================================
              PROFILE COMPLETENESS
              ================================================= */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-blue-500">
                    Profile completeness
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-blue-950">
                    {completeness}%
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Check size={18} strokeWidth={2.5} />
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                  style={{ width: `${completeness}%` }}
                />
              </div>

              <p className="mt-3 text-[10px] leading-4 text-blue-700/70">
                A complete profile helps make your HealthPassport
                more useful during care and emergencies.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-black text-slate-800">
                    Identity protected
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-400">
                    Your identity details are controlled by you.
                    Profile changes are recorded in your privacy
                    audit history.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                Quick access
              </p>

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate?.("records")}
                  className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Medical Records
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate?.("timeline")}
                  className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Health Timeline
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate?.("emergency")}
                  className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Emergency Passport
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUCCESS NOTICE
          ===================================================== */}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[80] flex max-w-[360px] items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-2xl">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Check size={15} strokeWidth={2.5} />
          </div>

          <p className="text-[11px] font-bold text-slate-700">
            {notice}
          </p>
        </div>
      )}

      {/* =====================================================
          EDIT MODAL
          ===================================================== */}
      {editing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-blue-500">
                  Patient Identity
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-900">
                  Edit profile
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Full name
                  </span>

                  <input
                    value={draft.fullName}
                    onChange={(event) =>
                      updateDraft(
                        "fullName",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Date of birth
                  </span>

                  <input
                    value={draft.dateOfBirth}
                    onChange={(event) =>
                      updateDraft(
                        "dateOfBirth",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Gender
                  </span>

                  <select
                    value={draft.gender}
                    onChange={(event) =>
                      updateDraft(
                        "gender",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Blood group
                  </span>

                  <select
                    value={draft.bloodGroup}
                    onChange={(event) =>
                      updateDraft(
                        "bloodGroup",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  >
                    {[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                      "Unknown",
                    ].map((group) => (
                      <option key={group}>{group}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Mobile
                  </span>

                  <input
                    value={draft.mobile}
                    onChange={(event) =>
                      updateDraft(
                        "mobile",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Email
                  </span>

                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) =>
                      updateDraft(
                        "email",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Location
                  </span>

                  <input
                    value={draft.location}
                    onChange={(event) =>
                      updateDraft(
                        "location",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Emergency contact
                  </span>

                  <input
                    value={draft.emergencyContactName}
                    onChange={(event) =>
                      updateDraft(
                        "emergencyContactName",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Emergency phone
                  </span>

                  <input
                    value={draft.emergencyContactPhone}
                    onChange={(event) =>
                      updateDraft(
                        "emergencyContactPhone",
                        event.target.value,
                      )
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <p className="text-[10px] leading-4 text-blue-800">
                    Your HealthPassport ID is a permanent identity
                    identifier and cannot be changed from this
                    demo profile editor.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={handleCancel}
                className="h-10 rounded-xl px-4 text-[10px] font-black text-slate-500 transition hover:bg-white hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[10px] font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Check size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}