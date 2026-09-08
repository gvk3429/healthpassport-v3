import {
  Activity,
  FileText,
  Heart,
  Home,
  KeyRound,
  Link2,
  Settings,
  Shield,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export type Page =
  | "dashboard"
  | "summary"
  | "overview"
  | "timeline"
  | "trends"
  | "records"
  | "family"
  | "emergency"
  | "emergency-location"
  | "sharing"
  | "ask"
  | "privacy"
  | "integrations"
  | "settings"
  | "profile";

interface AppSidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  badge?: boolean;
}

const mainNavigation: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    id: "summary",
    label: "Health Summary",
    icon: Heart,
  },
  {
    id: "overview",
    label: "Health Overview",
    icon: Activity,
  },
  {
    id: "timeline",
    label: "Health Timeline",
    icon: Activity,
  },
  {
    id: "trends",
    label: "Health Trends",
    icon: TrendingUp,
  },
  {
    id: "records",
    label: "Medical Records",
    icon: FileText,
  },
  {
    id: "family",
    label: "Family Health",
    icon: Users,
  },
  {
    id: "emergency",
    label: "Emergency Passport",
    icon: Shield,
    badge: true,
  },
  {
    id: "sharing",
    label: "Sharing & Consent",
    icon: Share2,
  },
  {
    id: "ask",
    label: "Ask HealthPassport",
    icon: Sparkles,
  },
  {
    id: "privacy",
    label: "Privacy & Access",
    icon: KeyRound,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Link2,
  },
];

export default function AppSidebar({
  activePage,
  onNavigate,
  mobileOpen = false,
  onMobileClose,
}: AppSidebarProps) {
  const handleNavigate = (page: Page) => {
    onNavigate(page);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[250px]
          flex-col
          overflow-hidden
          border-r
          border-slate-200
          bg-white
          shadow-xl
          shadow-slate-900/5
          transition-transform
          duration-300
          lg:translate-x-0
          lg:shadow-none
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ===================================================
            BRAND
            =================================================== */}
        <div className="flex h-[88px] shrink-0 items-center border-b border-slate-100 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <Heart
                size={20}
                fill="currentColor"
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[14px] font-black tracking-tight text-slate-900">
                HealthPassport
              </div>

              <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                V3 POC
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            NAVIGATION
            =================================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
          <div className="mb-3 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            My Health
          </div>

          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                activePage === item.id ||
                (item.id === "emergency" &&
                  activePage === "emergency-location");

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition
                      ${
                        isActive
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    `}
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-sm" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Patient profile */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="mb-3 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
              Account
            </div>

            <button
              type="button"
              onClick={() => handleNavigate("profile")}
              className={`
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-left
                transition
                ${
                  activePage === "profile"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              <span
                className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  ${
                    activePage === "profile"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 group-hover:text-slate-600"
                  }
                `}
              >
                <Heart
                  size={15}
                  strokeWidth={1.8}
                />
              </span>

              <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">
                Patient Profile
              </span>
            </button>
          </div>
        </div>

        {/* ===================================================
            HEALTHPASSPORT MESSAGE
            =================================================== */}
        <div className="shrink-0 px-2 pb-3">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-3">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-500 shadow-sm">
              <Heart
                size={15}
                fill="currentColor"
              />
            </div>

            <p className="text-[10px] font-bold leading-4 text-blue-800">
              Your health.
              <br />
              Your records.
              <br />
              Your control.
            </p>
          </div>
        </div>

        {/* ===================================================
            SETTINGS
            =================================================== */}
        <div className="shrink-0 border-t border-slate-100 p-2">
          <button
            type="button"
            onClick={() => handleNavigate("settings")}
            className={`
              group
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              transition
              ${
                activePage === "settings"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 group-hover:text-slate-600">
              <Settings size={15} />
            </span>

            <span className="text-[11px] font-semibold">
              Settings
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}