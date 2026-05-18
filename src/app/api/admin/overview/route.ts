import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [usersCount, jobsCount, applicationsCount, roleCounts, recentUsers, recentJobs, recentApplications] =
      await Promise.all([
        prisma.user.count(),
        prisma.job.count(),
        prisma.application.count(),
        prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          take: 12,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        }),
        prisma.job.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            title: true,
            location: true,
            isActive: true,
            createdAt: true,
            employer: {
              select: {
                name: true,
                profile: { select: { companyName: true } },
              },
            },
            _count: { select: { applications: true } },
          },
        }),
        prisma.application.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            status: true,
            createdAt: true,
            user: { select: { email: true, name: true } },
            job: { select: { id: true, title: true } },
          },
        }),
      ]);

    return NextResponse.json({
      metrics: {
        usersCount,
        jobsCount,
        applicationsCount,
      },
      roleCounts,
      recentUsers,
      recentJobs,
      recentApplications,
    });
  } catch (error) {
    console.error("admin overview error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
