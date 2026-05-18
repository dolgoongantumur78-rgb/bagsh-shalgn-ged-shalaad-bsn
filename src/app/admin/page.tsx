"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, BriefcaseIcon, BuildingIcon, ClipboardListIcon, UsersIcon } from "lucide-react";

interface OverviewData {
  metrics: { usersCount: number; jobsCount: number; applicationsCount: number };
  roleCounts: Array<{ role: string; _count: { role: number } }>;
  recentUsers: Array<{ id: string; name: string | null; email: string; role: string; createdAt: string }>;
  recentJobs: Array<{
    id: string; title: string; location: string; isActive: boolean; createdAt: string;
    employer: { name: string | null; profile: { companyName: string | null } | null };
    _count: { applications: number };
  }>;
  recentApplications: Array<{
    id: string; status: string; createdAt: string;
    user: { email: string; name: string | null };
    job: { id: string; title: string };
  }>;
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  PENDING:  { bg: "#FEF9C3", text: "#854D0E" },
  REVIEWED: { bg: "#EEF2FE", text: "#4B7BF5" },
  ACCEPTED: { bg: "#ECFDF3", text: "#16A34A" },
  REJECTED: { bg: "#FEF2F2", text: "#B91C1C" },
};

const ROLE_STYLE: Record<string, { bg: string; text: string }> = {
  JOBSEEKER: { bg: "#EEF2FE", text: "#4B7BF5" },
  EMPLOYER:  { bg: "#ECFDF3", text: "#16A34A" },
  ADMIN:     { bg: "#F3E8FF", text: "#7C3AED" },
};

export default function AdminDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json() as Promise<OverviewData>;
      })
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  const roleTotals = useMemo(() => {
    const m: Record<string, number> = { JOBSEEKER: 0, EMPLOYER: 0, ADMIN: 0 };
    if (!data) return m;
    for (const r of data.roleCounts) m[r.role] = r._count.role;
    return m;
  }, [data]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );

  if (error || !data)
    return (
      <div className="rounded-xl p-4 text-sm" style={{ background: "#FEF2F2", color: "#B91C1C" }}>
        {error || "No data"}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#111827" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Platform overview and recent activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard href="/admin/users" label="Total Users" value={data.metrics.usersCount} icon={<UsersIcon className="h-5 w-5" />} color="#4B7BF5" />
        <StatCard href="/admin/users?role=EMPLOYER" label="Employers" value={roleTotals.EMPLOYER} icon={<BuildingIcon className="h-5 w-5" />} color="#059669" />
        <StatCard href="/admin/jobs" label="Jobs" value={data.metrics.jobsCount} icon={<BriefcaseIcon className="h-5 w-5" />} color="#EA580C" />
        <StatCard href="/admin/applications" label="Applications" value={data.metrics.applicationsCount} icon={<ClipboardListIcon className="h-5 w-5" />} color="#7C3AED" />
      </div>

      <div className="rounded-2xl border p-5" style={{ borderColor: "#E2E7EF", background: "#FFFFFF" }}>
        <h2 className="font-bold text-sm mb-4" style={{ color: "#111827" }}>User Breakdown</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Job Seekers", count: roleTotals.JOBSEEKER, color: "#4B7BF5", bg: "#EEF2FE" },
            { label: "Employers",   count: roleTotals.EMPLOYER,  color: "#059669", bg: "#ECFDF3" },
            { label: "Admins",      count: roleTotals.ADMIN,     color: "#7C3AED", bg: "#F3E8FF" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: bg }}>
              <p className="text-2xl font-extrabold" style={{ color }}>{count}</p>
              <p className="text-xs mt-1 font-medium" style={{ color }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E7EF", background: "#FFFFFF" }}>
          <SectionHeader label="Recent Users" href="/admin/users" />
          <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
            {data.recentUsers.slice(0, 6).map((u) => (
              <div key={u.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#EEF2FE", color: "#4B7BF5" }}>
                  {(u.name?.[0] ?? u.email[0]).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>{u.name ?? u.email}</p>
                  <p className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>{u.email}</p>
                </div>
                <Badge style={ROLE_STYLE[u.role] ?? { bg: "#F3F4F6", text: "#6B7280" }} label={u.role} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E7EF", background: "#FFFFFF" }}>
          <SectionHeader label="Recent Jobs" href="/admin/jobs" />
          <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
            {data.recentJobs.slice(0, 6).map((j) => (
              <div key={j.id} className="px-4 py-3">
                <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>{j.title}</p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: "#9CA3AF" }}>
                  {j.employer.profile?.companyName ?? j.employer.name ?? "Unknown"} · {j._count.applications} apps
                </p>
                <span className="mt-1.5 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: j.isActive ? "#ECFDF3" : "#F3F4F6", color: j.isActive ? "#16A34A" : "#6B7280" }}>
                  {j.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E7EF", background: "#FFFFFF" }}>
          <SectionHeader label="Recent Applications" href="/admin/applications" />
          <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
            {data.recentApplications.slice(0, 6).map((a) => (
              <div key={a.id} className="px-4 py-3">
                <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>{a.user.name ?? a.user.email}</p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: "#9CA3AF" }}>{a.job.title}</p>
                <Badge style={STATUS_STYLE[a.status] ?? { bg: "#F3F4F6", text: "#6B7280" }} label={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ href, label, value, icon, color }: { href: string; label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Link href={href} className="rounded-2xl border p-4 flex items-center gap-3 hover:shadow-sm transition-shadow" style={{ borderColor: "#E2E7EF", background: "#FFFFFF" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "1A", color }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-none" style={{ color }}>{value.toLocaleString()}</p>
        <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{label}</p>
      </div>
    </Link>
  );
}

function SectionHeader({ label, href }: { label: string; href: string }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: "#F3F4F6" }}>
      <h2 className="font-bold text-sm" style={{ color: "#111827" }}>{label}</h2>
      <Link href={href} className="text-[11px] font-semibold flex items-center gap-1" style={{ color: "#4B7BF5" }}>
        View all <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  );
}

function Badge({ style, label }: { style: { bg: string; text: string }; label: string }) {
  return (
    <span className="mt-1.5 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: style.bg, color: style.text }}>
      {label}
    </span>
  );
}
