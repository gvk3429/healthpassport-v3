import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
  Crosshair,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";

import type { Page } from "../components/AppSidebar";

interface EmergencyLocationProps {
  onNavigate: (page: Page) => void;
}

type Duration = "30 minutes" | "1 hour" | "4 hours";

interface Contact {
  name: string;
  relationship: string;
  phone: string;
}

const contacts: Contact[] = [
  {
    name: "Priya Rao",
    relationship: "Spouse",
    phone: "+91 98XXXXXX21",
  },
  {
    name: "Ramesh Rao",
    relationship: "Parent",
    phone: "+91 97XXXXXX48",
  },
];

const simulatedLocations = [
  {
    place: "Bengaluru, Karnataka",
    detail: "Koramangala · Near Forum Mall",
  },
  {
    place: "Bengaluru, Karnataka",
    detail: "Indiranagar · 100 Feet Road",
  },
  {
    place: "Bengaluru, Karnataka",
    detail: "HSR Layout · Sector 2",
  },
];

export default function EmergencyLocation({
  onNavigate,
}: EmergencyLocationProps) {
  const [selectedContact, setSelectedContact] =
    useState(contacts[0]);

  const [duration, setDuration] =
    useState<Duration>("1 hour");

  const [sharing, setSharing] = useState(false);

  const [copied, setCopied] = useState(false);

  const [locationIndex, setLocationIndex] = useState(0);

  const [secondsRemaining, setSecondsRemaining] =
    useState(60 * 60);

  const currentLocation =
    simulatedLocations[locationIndex];

  useEffect(() => {
    if (!sharing) return;

    const timer = window.setInterval(() => {
      setSecondsRemaining((value) => {
        if (value <= 1) {
          setSharing(false);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sharing]);

  useEffect(() => {
    if (!sharing) return;

    const refreshTimer = window.setInterval(() => {
      setLocationIndex((value) =>
        (value + 1) % simulatedLocations.length,
      );
    }, 12000);

    return () => window.clearInterval(refreshTimer);
  }, [sharing]);

  const getDurationSeconds = (value: Duration) => {
    if (value === "30 minutes") return 30 * 60;
    if (value === "4 hours") return 4 * 60 * 60;

    return 60 * 60;
  };

  const startSharing = () => {
    setSecondsRemaining(
      getDurationSeconds(duration),
    );

    setSharing(true);
  };

  const stopSharing = () => {
    setSharing(false);
    setSecondsRemaining(0);
    setCopied(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(
      (seconds % 3600) / 60,
    );
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes
        .toString()
        .padStart(2, "0")}m`;
    }

    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const locationLink =
    "https://healthpassport.demo/location/HP-2026-00128";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        locationLink,
      );
    } catch {
      // Clipboard may not be available in the POC environment.
    }

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="hp-page-enter mx-auto max-w-[1400px] space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onNavigate("emergency")}
          className="flex w-fit items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-blue-600"
        >
          <ChevronLeft size={15} />
          Emergency Passport
        </button>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Navigation size={16} />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Emergency Location
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-blue-950">
              Share My Location
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Temporarily share your location with a trusted emergency
              contact when you need help.
            </p>
          </div>
        </div>
      </div>

      {/* Active state */}
      {sharing && (
        <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 shadow-card">
          <div className="flex flex-col gap-5 p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                <CheckCircle2 size={23} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-emerald-900">
                    Location sharing is active
                  </span>

                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700">
                    LIVE
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  {selectedContact.name} can currently access your
                  temporary emergency location.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white px-4 py-2.5 text-center shadow-sm">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Expires in
                </div>

                <div className="mt-0.5 text-lg font-bold text-emerald-700">
                  {formatTime(secondsRemaining)}
                </div>
              </div>

              <button
                onClick={stopSharing}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-700"
              >
                <X size={14} />
                Stop Sharing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="grid gap-5 xl:grid-cols-12">

        {/* Map / location */}
        <div className="xl:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-card">

            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current location
                </div>

                <h2 className="mt-1 text-lg font-bold text-blue-950">
                  {currentLocation.place}
                </h2>

                <div className="mt-0.5 text-[10px] text-slate-400">
                  {currentLocation.detail}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    sharing
                      ? "animate-pulse bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                />

                <span className="text-[10px] font-bold text-slate-500">
                  {sharing
                    ? "Location updating"
                    : "Location sharing off"}
                </span>
              </div>
            </div>

            {/* Simulated map */}
            <div className="relative h-[430px] overflow-hidden bg-[#eaf1f5]">
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(148,163,184,.22) 1px, transparent 1px),
                    linear-gradient(rgba(148,163,184,.22) 1px, transparent 1px)
                  `,
                  backgroundSize: "55px 55px",
                }}
              />

              <div className="absolute left-[12%] top-[20%] h-[60%] w-[15%] rotate-[22deg] rounded-full bg-white/80" />
              <div className="absolute left-[42%] top-[-10%] h-[125%] w-[10%] rotate-[63deg] rounded-full bg-white/80" />
              <div className="absolute right-[13%] top-[25%] h-[55%] w-[17%] -rotate-[32deg] rounded-full bg-white/80" />

              <div className="absolute left-[25%] top-[30%] h-32 w-32 rounded-full bg-emerald-100/60" />
              <div className="absolute right-[20%] bottom-[18%] h-40 w-40 rounded-full bg-sky-100/70" />

              <div className="absolute left-[50%] top-[48%] -translate-x-1/2 -translate-y-1/2">
                <div className="absolute -inset-8 animate-ping rounded-full bg-sky-400/20" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                    <MapPin size={21} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Crosshair size={17} />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-700">
                      Location precision
                    </div>

                    <div className="mt-0.5 text-[10px] text-slate-400">
                      Approximate location · Updated just now
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 p-4">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Smartphone size={13} />
                Location from mobile device
              </div>

              <span className="text-[10px] font-bold text-slate-500">
                POC
              </span>
            </div>
          </div>
        </div>

        {/* Sharing controls */}
        <div className="space-y-5 xl:col-span-5">

          {/* Contact */}
          <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card">
            <div>
              <h2 className="text-lg font-bold text-blue-950">
                Who should receive your location?
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Choose a trusted emergency contact.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {contacts.map((contact) => {
                const active =
                  selectedContact.phone === contact.phone;

                return (
                  <button
                    key={contact.phone}
                    onClick={() =>
                      setSelectedContact(contact)
                    }
                    disabled={sharing}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-sky-200 bg-sky-50"
                        : "border-slate-100 bg-slate-50 hover:bg-white"
                    } ${
                      sharing
                        ? "cursor-default"
                        : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active
                          ? "bg-white text-sky-600"
                          : "bg-white text-slate-400"
                      } shadow-sm`}
                    >
                      <UserRound size={17} />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-700">
                        {contact.name}
                      </div>

                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {contact.relationship} · {contact.phone}
                      </div>
                    </div>

                    {active && (
                      <CheckCircle2
                        size={18}
                        className="text-sky-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Duration */}
          <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Clock3 size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-blue-950">
                  Sharing duration
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Access automatically expires.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {(
                [
                  "30 minutes",
                  "1 hour",
                  "4 hours",
                ] as Duration[]
              ).map((item) => (
                <button
                  key={item}
                  onClick={() => setDuration(item)}
                  disabled={sharing}
                  className={`rounded-xl px-2 py-3 text-[10px] font-bold transition ${
                    duration === item
                      ? "bg-blue-950 text-white"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* Action */}
          <section className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 p-6 text-white shadow-card">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold">
                  Temporary & controlled
                </h2>

                <p className="mt-1 text-[10px] leading-5 text-blue-100">
                  Your contact receives access only for the selected
                  duration. You can stop sharing at any time.
                </p>
              </div>
            </div>

            {!sharing ? (
              <button
                onClick={startSharing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-xs font-bold text-blue-900 transition hover:bg-blue-50"
              >
                <Navigation size={15} />
                Start Location Sharing
              </button>
            ) : (
              <div className="mt-5 space-y-2">
                <button
                  onClick={copyLink}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold transition hover:bg-white/20"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Link Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Location Link
                    </>
                  )}
                </button>

                <button
                  onClick={stopSharing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 py-3 text-xs font-bold transition hover:bg-red-500"
                >
                  <X size={14} />
                  Stop Sharing
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Emergency contact call */}
      <section className="rounded-3xl border border-red-100 bg-red-50/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <Phone size={18} />
            </div>

            <div>
              <div className="text-xs font-bold text-red-900">
                Need immediate help?
              </div>

              <div className="mt-1 text-[10px] text-red-700">
                Call your selected emergency contact directly.
              </div>
            </div>
          </div>

          <a
            href={`tel:${selectedContact.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-700"
          >
            <Phone size={14} />
            Call {selectedContact.name}
          </a>
        </div>
      </section>

      {/* Privacy */}
      <section className="rounded-3xl border border-sky-100 bg-sky-50/60 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-sky-600"
          />

          <div>
            <div className="text-xs font-bold text-slate-800">
              Location sharing does not expose your complete passport.
            </div>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              The recipient receives temporary location access only.
              Your medical records, documents and private health information
              remain protected unless separately shared.
            </p>
          </div>
        </div>
      </section>

      {/* POC note */}
      <div className="flex items-center justify-center gap-2 text-[9px] font-semibold text-slate-400">
        <AlertTriangle size={11} />
        Frontend POC — live GPS and secure backend location links will be
        connected in the production integration phase.
      </div>
    </div>
  );
}