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
    const applications = await prisma.application.findMany({
      where: { job: { employerId: session.user.id } },
      include: {
        user: { select: { name: true, email: true } },
        job: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
