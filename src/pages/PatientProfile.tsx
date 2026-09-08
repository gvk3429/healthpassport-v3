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

import type { Page } from "../components/AppSidebar";
import { addAuditEvent } from "../lib/privacyAudit";

const PROFILE_STORAGE_KEY =
  "healthpassport-patient-profile-v1";

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
    const stored =
      window.localStorage.getItem(
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

function saveProfile(
  profile: PatientProfileData,
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );

  window.dispatchEvent(
    new CustomEvent(
      "healthpassport-profile-updated",
    ),
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
  onNavigate?: (page: Page) => void;
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
          <Icon
            size={16}
            strokeWidth={1.8}
          />
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
    useState<PatientProfileData>(() =>
      getProfile(),
    );

  const [editing, setEditing] =
    useState(false);

  const [draft, setDraft] =
    useState<PatientProfileData>(() =>
      getProfile(),
    );

  const [saved, setSaved] =
    useState(false);

  const [showEmergencyInfo, setShowEmergencyInfo] =
    useState(false);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const next = getProfile();

      setProfile(next);
      setDraft(next);
    };

    window.addEventListener(
      "healthpassport-profile-updated",
      handleProfileUpdate,
    );

    return () => {
      window.removeEventListener(
        "healthpassport-profile-updated",
        handleProfileUpdate,
      );
    };
  }, []);

  const initials = useMemo(
    () => getInitials(profile.fullName),
    [profile.fullName],
  );

  const handleEdit = () => {
    setDraft(profile);
    setEditing(true);
    setSaved(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const handleSave = () => {
    saveProfile(draft);
    setProfile(draft);
    setEditing(false);
    setSaved(true);

    addAuditEvent({
  type: "profile_updated",
  title: "Patient profile updated",
  actor: "You",
  scope: "Patient identity and profile",
  purpose: "Keep patient information current",
  timestamp: "Just now",
  status: "success",
});



    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
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
    <div className="hp-page-enter mx-auto w-full max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-7 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-xl font-black text-white shadow-lg shadow-blue-500/20">
                {initials}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-500">
                  Patient profile
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {profile.fullName}
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  HealthPassport ID:{" "}
                  <span className="font-semibold text-slate-700">
                    {profile.healthPassportId}
                  </span>
                </p>
              </div>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <Edit3 size={15} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Check size={15} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-6 py-3 text-xs font-semibold text-emerald-700 md:px-8">
            <Check size={15} />
            Profile changes saved successfully.
          </div>
        )}

        <div className="p-6 md:p-8">
          {!editing ? (
            <div className="grid gap-3 md:grid-cols-2">
              <ProfileField
                label="Date of Birth"
                value={profile.dateOfBirth}
                icon={UserRound}
              />

              <ProfileField
                label="Gender"
                value={profile.gender}
                icon={UserRound}
              />

              <ProfileField
                label="Blood Group"
                value={profile.bloodGroup}
                icon={Heart}
              />

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
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  label: "Full Name",
                  field: "fullName" as const,
                },
                {
                  label: "Date of Birth",
                  field: "dateOfBirth" as const,
                },
                {
                  label: "Gender",
                  field: "gender" as const,
                },
                {
                  label: "Blood Group",
                  field: "bloodGroup" as const,
                },
                {
                  label: "Mobile",
                  field: "mobile" as const,
                },
                {
                  label: "Email",
                  field: "email" as const,
                },
                {
                  label: "Location",
                  field: "location" as const,
                },
              ].map((item) => (
                <label
                  key={item.field}
                  className="block"
                >
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {item.label}
                  </span>

                  <input
                    value={draft[item.field]}
                    onChange={(event) =>
                      updateDraft(
                        item.field,
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                Emergency information
              </p>

              <p className="text-xs text-slate-400">
                Protected patient-controlled information
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Emergency contact
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {profile.emergencyContactName}
            </p>

            <button
              type="button"
              onClick={() =>
                setShowEmergencyInfo(
                  (current) => !current,
                )
              }
              className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {showEmergencyInfo
                ? "Hide protected contact details"
                : "Show protected contact details"}
            </button>

            {showEmergencyInfo && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
                <AlertCircle
                  size={15}
                  className="shrink-0"
                />
                {profile.emergencyContactPhone}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Activity size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-blue-900">
                Your profile controls your health identity
              </p>

              <p className="mt-1 text-xs text-blue-700">
                Emergency and sharing experiences use the
                profile information configured here.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                onNavigate?.("emergency")
              }
              className="rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-100"
            >
              Emergency Passport
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigate?.("sharing")
              }
              className="rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-100"
            >
              Sharing & Consent
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}