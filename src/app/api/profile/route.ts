import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Буруу хүсэлтийн формат" }, { status: 400 });
  }

  const { name, bio, phone, location, skills, experience, companyName, industry } = body as {
    name?: string; bio?: string; phone?: string; location?: string;
    skills?: string; experience?: string; companyName?: string; industry?: string;
  };

  try {
    const [user] = await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name: name || undefined },
        select: { name: true, email: true, role: true, createdAt: true },
      }),
      prisma.profile.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, bio, phone, location, skills, experience, companyName, industry },
        update: { bio, phone, location, skills, experience, companyName, industry },
      }),
    ]);
    return NextResponse.json({ ok: true, name: user.name });
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
