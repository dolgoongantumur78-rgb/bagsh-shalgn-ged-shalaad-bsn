"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserIcon, MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon,
  BuildingIcon, TagIcon, FileTextIcon, SaveIcon, CheckIcon, ArrowLeftIcon,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  profile: {
    bio: string | null;
    phone: string | null;
    location: string | null;
    skills: string | null;
    experience: string | null;
    companyName: string | null;
    industry: string | null;
  } | null;
}

const inputStyle = {
  border: "1.5px solid #E2E7EF",
  background: "#F7F8FA",
  color: "#111827",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s",
};

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>(null);
  const [form, setForm] = useState({
    name: "", bio: "", phone: "", location: "",
    skills: "", experience: "", companyName: "", industry: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d: ProfileData) => {
        setData(d);
        setForm({
          name:        d.name ?? "",
          bio:         d.profile?.bio ?? "",
          phone:       d.profile?.phone ?? "",
          location:    d.profile?.location ?? "",
          skills:      d.profile?.skills ?? "",
          experience:  d.profile?.experience ?? "",
          companyName: d.profile?.companyName ?? "",
          industry:    d.profile?.industry ?? "",
        });
      });
  }, [session]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const json = await res.json();
      await update({ name: json.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (status === "loading" || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isEmployer = data.role === "EMPLOYER";

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={isEmployer ? "/employer/dashboard" : "/dashboard"}
          className="p-2 rounded-xl transition-all hover:opacity-70"
          style={{ background: "#F0FDFA", color: "#4B7BF5" }}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "#111827" }}>Профайл засах</h1>
          <p className="text-xs" style={{ color: "#6B7280" }}>Мэдээллээ шинэчлэх</p>
        </div>
      </div>

      {/* Avatar card */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{ background: "linear-gradient(135deg, #0D1117 0%, #1A2440 100%)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #4B7BF5, #6B94F8)" }}
        >
          {form.name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div>
          <p className="font-extrabold text-white text-lg">{form.name || "—"}</p>
          <p className="text-sm" style={{ color: "#99F6E4" }}>{data.email}</p>
          <span
            className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: "rgba(13,148,136,0.25)", color: "#5EEAD4" }}
          >
            {isEmployer ? "Ажил олгогч" : "Ажил хайгч"}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5">

        {/* Basic info */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ background: "#FFFFFF", borderColor: "#E2E7EF" }}
        >
          <p className="text-sm font-bold" style={{ color: "#111827" }}>Үндсэн мэдээлэл</p>

          <Field label="Нэр" icon={<UserIcon className="h-4 w-4" />}>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Таны бүтэн нэр"
            />
          </Field>

          <Field label="Имэйл" icon={<MailIcon className="h-4 w-4" />}>
            <input
              style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
              value={data.email}
              disabled
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Утас" icon={<PhoneIcon className="h-4 w-4" />}>
              <input
                style={inputStyle}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="99xxxxxx"
              />
            </Field>
            <Field label="Байршил" icon={<MapPinIcon className="h-4 w-4" />}>
              <input
                style={inputStyle}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Улаанбаатар"
              />
            </Field>
          </div>

          <Field label="Товч танилцуулга" icon={<FileTextIcon className="h-4 w-4" />}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Өөрийгөө товчхон танилцуулна уу..."
            />
          </Field>
        </div>

        {/* Role-specific fields */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ background: "#FFFFFF", borderColor: "#E2E7EF" }}
        >
          {isEmployer ? (
            <>
              <p className="text-sm font-bold" style={{ color: "#111827" }}>Байгууллагын мэдээлэл</p>
              <Field label="Компанийн нэр" icon={<BuildingIcon className="h-4 w-4" />}>
                <input
                  style={inputStyle}
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="ХХК нэр"
                />
              </Field>
              <Field label="Салбар / Чиглэл" icon={<BriefcaseIcon className="h-4 w-4" />}>
                <input
                  style={inputStyle}
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  placeholder="Мэдээллийн технологи, Санхүү..."
                />
              </Field>
            </>
          ) : (
            <>
              <p className="text-sm font-bold" style={{ color: "#111827" }}>Мэргэжлийн мэдээлэл</p>
              <Field label="Ур чадвар" icon={<TagIcon className="h-4 w-4" />}>
                <input
                  style={inputStyle}
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js..."
                />
              </Field>
              <Field label="Туршлага" icon={<BriefcaseIcon className="h-4 w-4" />}>
                <textarea
                  rows={4}
                  style={{ ...inputStyle, resize: "none" }}
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="Өмнөх ажлын туршлагаа бичнэ үү..."
                />
              </Field>
            </>
          )}
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background: saved
              ? "linear-gradient(135deg, #3B6AE8, #111827)"
              : "linear-gradient(135deg, #4B7BF5, #0F766E)",
            boxShadow: "0 4px 16px rgba(13,148,136,0.30)",
          }}
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Хадгалж байна...</>
          ) : saved ? (
            <><CheckIcon className="h-4 w-4" /> Хадгалагдлаа</>
          ) : (
            <><SaveIcon className="h-4 w-4" /> Хадгалах</>
          )}
        </button>
      </form>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
        <span style={{ color: "#4B7BF5" }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
