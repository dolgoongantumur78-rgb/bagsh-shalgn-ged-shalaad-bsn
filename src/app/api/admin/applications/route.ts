import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as ApplicationStatus | null;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "15"));
  const skip = (page - 1) * limit;

  const VALID_STATUSES = Object.values(ApplicationStatus);
  const where = status && VALID_STATUSES.includes(status) ? { status } : {};

  try {
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          createdAt: true,
          matchScore: true,
          user: { select: { id: true, name: true, email: true } },
          job: {
            select: {
              id: true,
              title: true,
              employer: {
                select: {
                  name: true,
                  profile: { select: { companyName: true } },
                },
              },
            },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    return NextResponse.json({ applications, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("admin applications list error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
