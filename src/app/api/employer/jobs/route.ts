import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });
  }

  try {
    const jobs = await prisma.job.findMany({
      where: { employerId: session.user.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
