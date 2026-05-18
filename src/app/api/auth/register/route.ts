import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["JOBSEEKER", "EMPLOYER"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function isAllowedRole(role: unknown): role is AllowedRole {
  return typeof role === "string" && ALLOWED_ROLES.includes(role as AllowedRole);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!isAllowedRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
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

    return NextResponse.json({ message: "Registration successful", userId: user.id });
  } catch (error) {
    console.error("register route error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
