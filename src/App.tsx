import { useState } from "react";

import AppSidebar, {
  type Page,
} from "./components/AppSidebar";

import TopBar from "./components/TopBar";

import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import HealthOverview from "./pages/HealthOverview";
import HealthTimeline from "./pages/HealthTimeline";
import HealthTrends from "./pages/HealthTrends";
import AskHealthPassport from "./pages/AskHealthPassport";
import EmergencyPassport from "./pages/EmergencyPassport";
import EmergencyLocation from "./pages/EmergencyLocation";
import FamilyHealth from "./pages/FamilyHealth";
import SharingConsent from "./pages/SharingConsent";
import PrivacyAccess from "./pages/PrivacyAccess";
import Integrations from "./pages/Integrations";
import PatientProfile from "./pages/PatientProfile";
import PatientHealthSummary from "./pages/PatientHealthSummary";
import Settings from "./pages/Settings";

import LandingPage from "./pages/LandingPage";
import DemoLogin from "./pages/DemoLogin";

type EntryScreen = "landing" | "login" | "app";

function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="hp-page-enter mx-auto max-w-[1200px]">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-card md:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          ✦
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-blue-950">
          {title}
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            HealthPassport V3
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-700">
            This feature is part of the next implementation phase.
          </div>

          <div className="mt-1 text-xs text-slate-500">
            The navigation and product architecture are already connected.
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [entryScreen, setEntryScreen] =
    useState<EntryScreen>("landing");

  const [activePage, setActivePage] =
    useState<Page>("dashboard");

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    setMobileSidebarOpen(false);
  };

  const handleEnterDemo = () => {
    setEntryScreen("login");
  };

  const handleContinueToApp = () => {
    setEntryScreen("app");
    setActivePage("dashboard");
    setMobileSidebarOpen(false);
  };

  const handleBackToLanding = () => {
    setEntryScreen("landing");
    setMobileSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={handleNavigate}
          />
        );

      case "summary":
        return (
          <PatientHealthSummary
            onNavigate={handleNavigate}
          />
        );

      case "overview":
        return (
          <HealthOverview
            onNavigate={handleNavigate}
          />
        );

      case "timeline":
        return (
          <HealthTimeline
            onNavigate={handleNavigate}
          />
        );

      case "trends":
        return (
          <HealthTrends
            onNavigate={handleNavigate}
          />
        );

      case "records":
        return (
          <MedicalRecords
            onNavigate={handleNavigate}
          />
        );

      case "family":
        return (
          <FamilyHealth
            onNavigate={handleNavigate}
          />
        );

      case "emergency":
        return (
          <EmergencyPassport
            onNavigate={handleNavigate}
          />
        );

      case "emergency-location":
        return (
          <EmergencyLocation
            onNavigate={handleNavigate}
          />
        );

      case "sharing":
        return (
          <SharingConsent
            onNavigate={handleNavigate}
          />
        );

      case "ask":
        return (
          <AskHealthPassport
            onNavigate={handleNavigate}
          />
        );

      case "privacy":
        return (
          <PrivacyAccess
            onNavigate={handleNavigate}
          />
        );

      case "integrations":
        return (
          <Integrations
            onNavigate={handleNavigate}
          />
        );

      case "settings":
        return (
          <Settings
            onNavigate={handleNavigate}
          />
        );

      case "profile":
        return (
          <PatientProfile
            onNavigate={(page) => {
              handleNavigate(page as Page);
            }}
          />
        );

      default:
        return (
          <PlaceholderPage
            title="HealthPassport"
            description="Your unified health passport."
          />
        );
    }
  };

  if (entryScreen === "landing") {
    return (
      <LandingPage
        onEnterDemo={handleEnterDemo}
      />
    );
  }

  if (entryScreen === "login") {
    return (
      <DemoLogin
        onBack={handleBackToLanding}
        onContinue={handleContinueToApp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AppSidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() =>
            setMobileSidebarOpen(false)
          }
        />

        <div className="min-w-0 flex-1 lg:ml-[250px]">
          <TopBar
            onMenuClick={() =>
              setMobileSidebarOpen(true)
            }
          />

          <main className="px-4 py-5 sm:px-6 lg:px-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;