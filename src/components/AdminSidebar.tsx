"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/users", label: "Users", icon: UsersIcon, exact: false },
  { href: "/admin/jobs", label: "Jobs", icon: BriefcaseIcon, exact: false },
  { href: "/admin/applications", label: "Applications", icon: ClipboardListIcon, exact: false },
];

export default function AdminSidebar({ email, name }: { email: string; name: string }) {
  const pathname = usePathname();
  const active = (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <div
      className="w-52 flex flex-col h-full"
      style={{ background: "linear-gradient(180deg, #0D1117 0%, #1A2440 100%)" }}
    >
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(75,123,245,0.25)" }}
          >
            <ShieldCheckIcon className="h-4 w-4" style={{ color: "#93B8FC" }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{name || "Admin"}</p>
            <p className="text-[10px] truncate" style={{ color: "#4B5563" }}>{email}</p>
          </div>
        </div>
      </div>

      <nav className="p-3 flex-1 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const on = active(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                color: on ? "#FFFFFF" : "#6B7280",
                background: on ? "rgba(75,123,245,0.20)" : "transparent",
                borderLeft: `2px solid ${on ? "#4B7BF5" : "transparent"}`,
              }}
            >
              <Icon className="h-4 w-4 shrink-0" style={{ color: on ? "#4B7BF5" : "#4B5563" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <p
          className="text-[10px] font-bold tracking-widest px-3 py-2 rounded-lg text-center"
          style={{ background: "rgba(255,255,255,0.04)", color: "#374151" }}
        >
          ADMIN PANEL
        </p>
      </div>
    </div>
  );
}
