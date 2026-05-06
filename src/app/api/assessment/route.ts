import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deriveInsights } from "@/lib/psychology";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  try {
    const scores = await req.json();
    const insights = deriveInsights(scores);

    const assessment = await prisma.assessment.upsert({
      where: { userId: session.user.id },
      update: { ...scores, ...insights, completedAt: new Date() },
      create: { userId: session.user.id, ...scores, ...insights },
    });

    return NextResponse.json(assessment);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  try {
    const assessment = await prisma.assessment.findUnique({
      where: { userId: session.user.id },
    });
    return NextResponse.json(assessment);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
