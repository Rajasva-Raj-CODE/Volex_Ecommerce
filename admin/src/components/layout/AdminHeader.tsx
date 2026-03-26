import { useAuth } from "@/lib/auth-context";
import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#0f0f0f]/95 px-6 backdrop-blur-md">
      {/* Search */}
      <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2">
        <Search size={16} className="text-white/40" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition-colors hover:bg-white/5">
          <Bell size={16} className="text-white/60" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#49A5A2] text-[9px] font-bold text-black">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#49A5A2]/20 text-xs font-bold text-[#49A5A2]">
            {user?.name.charAt(0)}
          </div>
          <span className="hidden text-sm font-medium text-white sm:block">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
