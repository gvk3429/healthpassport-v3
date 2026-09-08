import { useState } from "react";

import AppSidebar, {
  type Page,
} from "./components/AppSidebar";
import TopBar from "./components/TopBar";

import Dashboard from "./pages/Dashboard";
import HealthOverview from "./pages/HealthOverview";
import HealthTimeline from "./pages/HealthTimeline";
import HealthTrends from "./pages/HealthTrends";
import MedicalRecords from "./pages/MedicalRecords";
import FamilyHealth from "./pages/FamilyHealth";
import EmergencyPassport from "./pages/EmergencyPassport";
import EmergencyLocation from "./pages/EmergencyLocation";
import SharingConsent from "./pages/SharingConsent";
import PrivacyAccess from "./pages/PrivacyAccess";
import AskHealthPassport from "./pages/AskHealthPassport";
import PatientProfile from "./pages/PatientProfile";
import PatientHealthSummary from "./pages/PatientHealthSummary";

export default function App() {
  const [page, setPage] =
    useState<Page>("dashboard");

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMobileSidebarOpen(false);
  };

  const navigateFromString = (nextPage: string) => {
    const validPages: Page[] = [
      "dashboard",
      "summary",
      "profile",
      "overview",
      "timeline",
      "trends",
      "records",
      "family",
      "emergency",
      "emergency-location",
      "sharing",
      "ask",
      "privacy",
      "integrations",
      "settings",
    ];

    if (
      validPages.includes(
        nextPage as Page,
      )
    ) {
      navigate(nextPage as Page);
    }
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={navigate}
          />
        );

      case "summary":
        return (
          <PatientHealthSummary
            onNavigate={navigate}
          />
        );

      case "profile":
        return (
          <PatientProfile
            onNavigate={navigateFromString}
          />
        );

      case "overview":
        return (
          <HealthOverview
            onNavigate={navigate}
          />
        );

      case "timeline":
        return (
          <HealthTimeline
            onNavigate={navigate}
          />
        );

      case "trends":
        return (
          <HealthTrends
            onNavigate={navigate}
          />
        );

      case "records":
        return (
          <MedicalRecords
            onNavigate={navigate}
          />
        );

      case "family":
        return (
          <FamilyHealth
            onNavigate={navigate}
          />
        );

      case "emergency":
        return (
          <EmergencyPassport
            onNavigate={navigate}
          />
        );

      case "emergency-location":
        return (
          <EmergencyLocation
            onNavigate={navigate}
          />
        );

      case "sharing":
        return (
          <SharingConsent
            onNavigate={navigate}
          />
        );

      case "ask":
        return (
          <AskHealthPassport
            onNavigate={navigate}
          />
        );

      case "privacy":
        return (
          <PrivacyAccess
            onNavigate={navigate}
          />
        );

      case "integrations":
        return (
          <Dashboard
            onNavigate={navigate}
          />
        );

      case "settings":
        return (
          <PatientProfile
            onNavigate={navigateFromString}
          />
        );

      default:
        return (
          <Dashboard
            onNavigate={navigate}
          />
        );
    }
  };

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-slate-50 text-slate-900">
      {/* =====================================================
          FIXED SIDEBAR
          ===================================================== */}

      <AppSidebar
        activePage={page}
        onNavigate={navigate}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      {/* =====================================================
          APPLICATION WORKSPACE
          ===================================================== */}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:pl-[250px]">
        {/* Fixed/sticky application header */}
        <TopBar
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        {/* ===================================================
            SINGLE DESKTOP SCROLL REGION

            The browser itself no longer needs to scroll the
            entire application. Only this workspace scrolls.
            =================================================== */}

        <main
          className="
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            p-3
            sm:p-4
            lg:p-5
          "
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}