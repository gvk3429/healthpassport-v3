import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  UserRound,
  Users,
} from "lucide-react";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({
  onMenuClick,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-[64px] w-full shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={17} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="relative w-full max-w-[500px]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search your health records, tests, medications..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell size={16} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <UserRound size={16} />
          </div>

          <div className="hidden text-left sm:block">
            <div className="text-[11px] font-bold text-slate-800">
              Arjun Rao
            </div>

            <div className="text-[9px] font-medium text-slate-400">
              Patient
            </div>
          </div>

          <ChevronDown
            size={14}
            className="hidden text-slate-400 sm:block"
          />
        </button>

        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 md:flex"
          aria-label="Family"
        >
          <Users size={16} />
        </button>
      </div>
    </header>
  );
}