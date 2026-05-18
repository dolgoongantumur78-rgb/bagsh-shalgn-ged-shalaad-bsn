"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";

type AppStatus = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";

interface Application {
  id: string;
  status: AppStatus;
  createdAt: string;
  matchScore: number | null;
  user: { id: string; name: string | null; email: string };
  job: { id: string; title: string; employer: { name: string | null; profile: { companyName: string | null } | null } };
}

interface AppsData {
  applications: Application[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_STYLE: Record<AppStatus, { bg: string; text: string }> = {
  PENDING:  { bg: "#FEF9C3", text: "#854D0E" },
  REVIEWED: { bg: "#EEF2FE", text: "#4B7BF5" },
  ACCEPTED: { bg: "#ECFDF3", text: "#16A34A" },
  REJECTED: { bg: "#FEF2F2", text: "#B91C1C" },
};

export default function AdminApplicationsPage() {
  const [data, setData] = useState<AppsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AppStatus | "">("");
  const [page, setPage] = useState(1);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, AppStatus>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "15" });
    if (statusFilter) p.set("status", statusFilter);
    fetch(`/api/admin/applications?${p}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json() as Promise<AppsData>;
      })
      .then((d) => {
        setData(d);
        setStatusDrafts(Object.fromEntries(d.applications.map((a) => [a.id, a.status])));
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function saveStatus(appId: string) {
    const status = statusDrafts[appId];
    if (!status) return;
    setSaving(appId);
    try {
      const r = await fetch(`/api/admin/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Failed");
      setData((prev) =>
        prev ? { ...prev, applications: prev.applications.map((a) => (a.id === appId ? { ...a, status } : a)) } : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setSaving(null);
    }
  }

  async function deleteApp(appId: string) {
    setDeleting(appId);
    try {
      const r = await fetch(`/api/admin/applications/${appId}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Failed");
      setData((prev) =>
        prev ? { ...prev, applications: prev.applications.filter((a) => a.id !== appId), total: prev.total - 1 } : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete application");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#111827" }}>Applications</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {data ? `${data.total.toLocaleString()} total applications` : "Manage all job applications"}
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm" style={{ background: "#FEF2F2", color: "#B91C1C" }}>{error}</div>
      )}

      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as AppStatus | ""); setPage(1); }}
          className="px-3 py-2.5 text-sm rounded-xl border outline-none"
          style={{ borderColor: "#D1D5DB", background: "#FFFFFF" }}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E7EF", background: "#FFFFFF" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E2E7EF" }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Applicant</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Job</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Match</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Applied</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#F3F4F6" }}>
                  {data?.applications.map((app) => {
                    const draft = statusDrafts[app.id] ?? app.status;
                    const changed = draft !== app.status;
                    const s = STATUS_STYLE[draft];
                    return (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold truncate max-w-[160px]" style={{ color: "#111827" }}>
                            {app.user.name ?? app.user.email}
                          </p>
                          <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{app.user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium truncate max-w-[160px]" style={{ color: "#374151" }}>{app.job.title}</p>
                          <p className="text-[11px] truncate" style={{ color: "#9CA3AF" }}>
                            {app.job.employer.profile?.companyName ?? app.job.employer.name ?? "Unknown"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          {app.matchScore != null ? (
                            <span className="text-xs font-bold" style={{ color: app.matchScore >= 70 ? "#16A34A" : app.matchScore >= 40 ? "#EA580C" : "#EF4444" }}>
                              {Math.round(app.matchScore)}%
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: "#9CA3AF" }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={draft}
                              onChange={(e) => setStatusDrafts((p) => ({ ...p, [app.id]: e.target.value as AppStatus }))}
                              className="text-xs rounded-lg px-2 py-1.5 border font-semibold"
                              style={{ borderColor: "#D1D5DB", background: s.bg, color: s.text }}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="REVIEWED">REVIEWED</option>
                              <option value="ACCEPTED">ACCEPTED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                            {changed && (
                              <button
                                onClick={() => saveStatus(app.id)}
                                disabled={saving === app.id}
                                className="text-xs px-2 py-1.5 rounded-lg font-bold text-white disabled:opacity-50"
                                style={{ background: "#4B7BF5" }}
                              >
                                {saving === app.id ? "..." : "Save"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#9CA3AF" }}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {confirmDelete === app.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteApp(app.id)}
                                disabled={deleting === app.id}
                                className="text-xs px-2 py-1.5 rounded-lg font-bold text-white disabled:opacity-50"
                                style={{ background: "#EF4444" }}
                              >
                                {deleting === app.id ? "..." : "Delete"}
                              </button>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs px-1.5 py-1.5 rounded-lg" style={{ color: "#6B7280" }}>
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(app.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              style={{ color: "#D1D5DB" }}
                              title="Delete application"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {data?.applications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: "#9CA3AF" }}>
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Page {data.page} of {data.totalPages} · {data.total} applications
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: "#E2E7EF" }}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: "#E2E7EF" }}>
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
