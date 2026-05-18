import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            avatarUrl: true,
            bio: true,
            phone: true,
            location: true,
            skills: true,
            experience: true,
            companyName: true,
            industry: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("profile GET error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = toOptionalString(body.name);
  const avatarUrl = toOptionalString(body.avatarUrl);
  const bio = toOptionalString(body.bio);
  const phone = toOptionalString(body.phone);
  const location = toOptionalString(body.location);
  const skills = toOptionalString(body.skills);
  const experience = toOptionalString(body.experience);
  const companyName = toOptionalString(body.companyName);
  const industry = toOptionalString(body.industry);

  try {
    const [user] = await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name },
        select: { name: true, email: true, role: true, createdAt: true },
      }),
      prisma.profile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          avatarUrl,
          bio,
          phone,
          location,
          skills,
          experience,
          companyName,
          industry,
        },
        update: {
          avatarUrl,
          bio,
          phone,
          location,
          skills,
          experience,
          companyName,
          industry,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, name: user.name });
  } catch (error) {
    console.error("profile PATCH error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
