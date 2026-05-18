import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") {
    redirect(session.user.role === "EMPLOYER" ? "/employer/dashboard" : "/dashboard");
  }

  return (
    <div className="flex -mx-4 sm:-mx-6 min-h-[calc(100vh-4rem)]">
      <div className="sticky top-16 h-[calc(100vh-4rem)] shrink-0 overflow-y-auto">
        <AdminSidebar email={session.user.email ?? ""} name={session.user.name ?? ""} />
      </div>
      <div className="flex-1 min-w-0 px-6 py-6">
        {children}
      </div>
    </div>
  );
}
