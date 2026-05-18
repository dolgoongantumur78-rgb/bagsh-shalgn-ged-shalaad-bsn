"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, SearchIcon, TrashIcon } from "lucide-react";

interface Job {
  id: string;
  title: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  jobType: string;
  category: string;
  employer: { name: string | null; email: string; profile: { companyName: string | null } | null };
  _count: { applications: number };
}

interface JobsData {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminJobsPage() {
  const [data, setData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) p.set("search", search);
    if (activeFilter) p.set("active", activeFilter);
    fetch(`/api/admin/jobs?${p}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json() as Promise<JobsData>;
      })
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [page, search, activeFilter]);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(job: Job) {
    setToggling(job.id);
    try {
      const r = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !job.isActive }),
      });
      if (!r.ok) throw new Error("Failed");
      setData((prev) =>
        prev ? { ...prev, jobs: prev.jobs.map((j) => (j.id === job.id ? { ...j, isActive: !j.isActive } : j)) } : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update job");
    } finally {
      setToggling(null);
    }
  }

  async function deleteJob(jobId: string) {
    setDeleting(jobId);
    try {
      const r = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Failed");
      setData((prev) =>
        prev ? { ...prev, jobs: prev.jobs.filter((j) => j.id !== jobId), total: prev.total - 1 } : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete job");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#111827" }}>Jobs</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {data ? `${data.total.toLocaleString()} total jobs` : "Manage all job listings"}
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm" style={{ background: "#FEF2F2", color: "#B91C1C" }}>{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-blue-300"
            style={{ borderColor: "#D1D5DB", background: "#FFFFFF" }}
          />
        </div>
        <select
          value={activeFilter}
          onChange={(e) => { setActiveFilter(e.target.value as "" | "true" | "false"); setPage(1); }}
          className="px-3 py-2.5 text-sm rounded-xl border outline-none"
          style={{ borderColor: "#D1D5DB", background: "#FFFFFF" }}
        >
          <option value="">All statuses</option>
          <option value="true">Active only</option>
          <option value="false">Inactive only</option>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Job</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Employer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Apps</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Posted</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#F3F4F6" }}>
                  {data?.jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold truncate max-w-[200px]" style={{ color: "#111827" }}>{job.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{job.location} · {job.jobType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium truncate max-w-[140px]" style={{ color: "#374151" }}>
                          {job.employer.profile?.companyName ?? job.employer.name ?? "Unknown"}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: "#9CA3AF" }}>{job.employer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: "#374151" }}>
                        {job._count.applications}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[11px] font-semibold px-2 py-1 rounded-full"
                          style={{ background: job.isActive ? "#ECFDF3" : "#F3F4F6", color: job.isActive ? "#16A34A" : "#6B7280" }}
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#9CA3AF" }}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleActive(job)}
                            disabled={toggling === job.id}
                            title={job.isActive ? "Deactivate" : "Activate"}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            style={{ color: job.isActive ? "#EA580C" : "#059669" }}
                          >
                            {job.isActive ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                          <Link
                            href={`/jobs/${job.id}`}
                            target="_blank"
                            title="View job"
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ color: "#9CA3AF" }}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Link>
                          {confirmDelete === job.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteJob(job.id)}
                                disabled={deleting === job.id}
                                className="text-xs px-2 py-1.5 rounded-lg font-bold text-white disabled:opacity-50"
                                style={{ background: "#EF4444" }}
                              >
                                {deleting === job.id ? "..." : "Delete"}
                              </button>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs px-1.5 py-1.5 rounded-lg" style={{ color: "#6B7280" }}>
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(job.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              style={{ color: "#D1D5DB" }}
                              title="Delete job"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data?.jobs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: "#9CA3AF" }}>
                        No jobs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Page {data.page} of {data.totalPages} · {data.total} jobs
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
