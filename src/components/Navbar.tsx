"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BrainCircuitIcon, BriefcaseIcon, LogOutIcon, PlusIcon, LayoutDashboardIcon, SparklesIcon, SettingsIcon, BotIcon } from "lucide-react";
import { useAIDrawer } from "@/context/AIDrawerContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { toggle: toggleAI } = useAIDrawer();
  const pathname  = usePathname();
  const isHome    = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const glass = isHome && !scrolled;
  const isActive = (href: string) => pathname.startsWith(href) && href !== "/";

  const NavLink = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
        style={{
          color:      active ? (glass ? "#93B8FC" : "#4B7BF5") : (glass ? "rgba(255,255,255,0.80)" : "#6B7280"),
          background: active ? (glass ? "rgba(75,123,245,0.15)" : "#EEF2FE") : "transparent",
          fontWeight: active ? 600 : 400,
        }}
      >
        {icon}{label}
      </Link>
    );
  };

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{
        background:         glass ? "transparent" : "rgba(247,248,250,0.90)",
        backdropFilter:     glass ? "none" : "blur(14px)",
        WebkitBackdropFilter: glass ? "none" : "blur(14px)",
        borderBottom:       glass ? "1px solid transparent" : "1px solid #E2E7EF",
        boxShadow:          glass ? "none" : "0 1px 16px rgba(17,24,39,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-base">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: glass ? "rgba(255,255,255,0.15)" : "#111827", border: glass ? "1px solid rgba(255,255,255,0.25)" : "none" }}
            >
              <BrainCircuitIcon className="h-4 w-4 text-white" />
            </div>
            <span style={{ color: glass ? "#FFFFFF" : "#111827" }}>
              Mind<span style={{ color: "#4B7BF5" }}>Match</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <NavLink href="/jobs" label="Ажлын байр" icon={<BriefcaseIcon className="h-4 w-4" />} />

            {session ? (
              <>
                {session.user.role === "JOBSEEKER" && (
                  <>
                    <NavLink href="/assessment" label="Тест"   icon={<SparklesIcon className="h-4 w-4" />} />
                    <button
                      onClick={toggleAI}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                      style={{ color: glass ? "#93B8FC" : "#4B7BF5", background: glass ? "rgba(75,123,245,0.15)" : "#EEF2FE" }}
                    >
                      <BotIcon className="h-4 w-4" />AI
                    </button>
                    <NavLink href="/dashboard" label="Самбар" icon={<LayoutDashboardIcon className="h-4 w-4" />} />
                    <NavLink href="/profile"    label="Профайл" icon={<SettingsIcon className="h-4 w-4" />} />
                  </>
                )}
                {session.user.role === "EMPLOYER" && (
                  <>
                    <Link
                      href="/employer/post-job"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                      style={{ color: glass ? "#93B8FC" : "#4B7BF5", background: glass ? "rgba(75,123,245,0.15)" : "#EEF2FE" }}
                    >
                      <PlusIcon className="h-4 w-4" />Ажил нийтлэх
                    </Link>
                    <button
                      onClick={toggleAI}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                      style={{ color: glass ? "#93B8FC" : "#4B7BF5", background: glass ? "rgba(75,123,245,0.15)" : "#EEF2FE" }}
                    >
                      <BotIcon className="h-4 w-4" />AI
                    </button>
                    <NavLink href="/employer/dashboard" label="Самбар"  icon={<LayoutDashboardIcon className="h-4 w-4" />} />
                    <NavLink href="/profile"            label="Профайл" icon={<SettingsIcon className="h-4 w-4" />} />
                  </>
                )}

                <div className="w-px h-5 mx-1" style={{ background: glass ? "rgba(255,255,255,0.20)" : "#E2E7EF" }} />

                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#4B7BF5", color: "#FFFFFF" }}
                  >
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-1.5 rounded-lg transition-all hover:bg-gray-100"
                    style={{ color: glass ? "rgba(255,255,255,0.70)" : "#9CA3AF" }}
                    title="Гарах"
                  >
                    <LogOutIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{ color: glass ? "rgba(255,255,255,0.80)" : "#6B7280" }}
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                  style={{
                    background: "#4B7BF5",
                    color: "#FFFFFF",
                    boxShadow: "0 2px 8px rgba(75,123,245,0.35)",
                  }}
                >
                  Бүртгүүлэх
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
