import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyOwner(id: string, employerId: string) {
  const job = await prisma.job.findUnique({ where: { id }, select: { employerId: true } });
  if (!job) return null;
  if (job.employerId !== employerId) return false;
  return true;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: { name: true, profile: { select: { companyName: true, industry: true } } },
        },
      },
    });

    if (!job) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER")
    return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });

  const { id } = await params;

  try {
    const owned = await verifyOwner(id, session.user.id);
    if (owned === null) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
    if (!owned) return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Буруу хүсэлтийн формат" }, { status: 400 });
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        title:             body.title             as string,
        description:       body.description       as string,
        requirements:      body.requirements      as string | undefined,
        location:          body.location          as string,
        salary:            (body.salary as string) || null,
        jobType:           body.jobType           as string,
        category:          body.category          as string,
        openness:          Number(body.openness),
        conscientiousness: Number(body.conscientiousness),
        extraversion:      Number(body.extraversion),
        agreeableness:     Number(body.agreeableness),
        neuroticism:       Number(body.neuroticism),
      },
    });

    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER")
    return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });

  const { id } = await params;

  try {
    const owned = await verifyOwner(id, session.user.id);
    if (owned === null) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
    if (!owned) return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });

    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
