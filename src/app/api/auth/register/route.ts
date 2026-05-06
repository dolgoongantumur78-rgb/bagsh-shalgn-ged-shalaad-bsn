import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Бүх талбарыг бөглөнө үү" }, { status: 400 });
    }

    if (!["JOBSEEKER", "EMPLOYER"].includes(role)) {
      return NextResponse.json({ error: "Буруу хэрэглэгчийн төрөл" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Энэ имэйл аль хэдийн бүртгэлтэй" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        profile: { create: {} },
      },
    });

    return NextResponse.json({ message: "Бүртгэл амжилттай", userId: user.id });
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
