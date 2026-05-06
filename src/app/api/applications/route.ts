import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  try {
    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            employer: { select: { profile: { select: { companyName: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
