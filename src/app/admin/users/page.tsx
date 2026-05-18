"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, TrashIcon } from "lucide-react";

type Role = "JOBSEEKER" | "EMPLOYER" | "ADMIN";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
  _count: { applications: number; jobs: number };
}

interface UsersData {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [page, setPage] = useState(1);
  const [roleDrafts, setRoleDrafts] = useState<Record<string, Role>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) p.set("search", search);
    if (roleFilter) p.set("role", roleFilter);
    fetch(`/api/admin/users?${p}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json() as Promise<UsersData>;
      })
      .then((d) => {
        setData(d);
        setRoleDrafts(Object.fromEntries(d.users.map((u) => [u.id, u.role])));
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  async function saveRole(userId: string) {
    const role = roleDrafts[userId];
    if (!role) return;
    setSaving(userId);
    setError("");
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!r.ok) {
        const p = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(p.error ?? "Failed");
      }
      setData((prev) =>
        prev ? { ...prev, users: prev.users.map((u) => (u.id === userId ? { ...u, role } : u)) } : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setSaving(null);
    }
  }

  async function deleteUser(userId: string) {
    setDeleting(userId);
    setError("");
    try {
      const r = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!r.ok) {
        const p = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(p.error ?? "Failed");
      }
      setData((prev) =>
        prev ? { ...prev, users: prev.users.filter((u) => u.id !== userId), total: prev.total - 1 } : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#111827" }}>Users</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {data ? `${data.total.toLocaleString()} total users` : "Manage all platform users"}
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-blue-300"
            style={{ borderColor: "#D1D5DB", background: "#FFFFFF" }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as Role | ""); setPage(1); }}
          className="px-3 py-2.5 text-sm rounded-xl border outline-none"
          style={{ borderColor: "#D1D5DB", background: "#FFFFFF" }}
        >
          <option value="">All roles</option>
          <option value="JOBSEEKER">Job Seekers</option>
          <option value="EMPLOYER">Employers</option>
          <option value="ADMIN">Admins</option>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Activity</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>Joined</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#F3F4F6" }}>
                  {data?.users.map((user) => {
                    const draft = roleDrafts[user.id] ?? user.role;
                    const changed = draft !== user.role;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#EEF2FE", color: "#4B7BF5" }}>
                              {(user.name?.[0] ?? user.email[0]).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate" style={{ color: "#111827" }}>{user.name ?? "—"}</p>
                              <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={draft}
                              onChange={(e) => setRoleDrafts((p) => ({ ...p, [user.id]: e.target.value as Role }))}
                              className="text-xs rounded-lg px-2 py-1.5 border"
                              style={{ borderColor: "#D1D5DB" }}
                            >
                              <option value="JOBSEEKER">JOBSEEKER</option>
                              <option value="EMPLOYER">EMPLOYER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                            {changed && (
                              <button
                                onClick={() => saveRole(user.id)}
                                disabled={saving === user.id}
                                className="text-xs px-2 py-1.5 rounded-lg font-bold text-white disabled:opacity-50"
                                style={{ background: "#4B7BF5" }}
                              >
                                {saving === user.id ? "..." : "Save"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#6B7280" }}>
                          {user._count.applications > 0 && <span>{user._count.applications} apps</span>}
                          {user._count.jobs > 0 && <span className="ml-2">{user._count.jobs} jobs</span>}
                          {user._count.applications === 0 && user._count.jobs === 0 && <span>—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#9CA3AF" }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {confirmDelete === user.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteUser(user.id)}
                                disabled={deleting === user.id}
                                className="text-xs px-2 py-1.5 rounded-lg font-bold text-white disabled:opacity-50"
                                style={{ background: "#EF4444" }}
                              >
                                {deleting === user.id ? "..." : "Confirm"}
                              </button>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs px-1.5 py-1.5 rounded-lg" style={{ color: "#6B7280" }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(user.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              style={{ color: "#D1D5DB" }}
                              title="Delete user"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {data?.users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: "#9CA3AF" }}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Page {data.page} of {data.totalPages} · {data.total} users
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border disabled:opacity-40"
                    style={{ borderColor: "#E2E7EF" }}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    className="p-1.5 rounded-lg border disabled:opacity-40"
                    style={{ borderColor: "#E2E7EF" }}
                  >
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
