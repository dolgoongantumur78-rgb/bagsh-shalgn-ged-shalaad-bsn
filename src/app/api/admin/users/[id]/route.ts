import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = [Role.JOBSEEKER, Role.EMPLOYER, Role.ADMIN] as const;

function isRole(value: unknown): value is Role {
  return typeof value === "string" && ALLOWED_ROLES.includes(value as Role);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let role: Role;
  try {
    const body = await req.json();
    if (!isRole(body?.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    role = body.role;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (id === session.user.id && role !== Role.ADMIN) {
    return NextResponse.json({ error: "You cannot remove your own admin role" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true, email: true, name: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("admin user role update error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin delete user error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
