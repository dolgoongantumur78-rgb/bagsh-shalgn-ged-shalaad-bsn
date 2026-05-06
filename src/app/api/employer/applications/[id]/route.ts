import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });
  }

  const { id } = await params;

  let status: string;
  try {
    const body = await req.json();
    status = body.status;
  } catch {
    return NextResponse.json({ error: "Буруу хүсэлтийн формат" }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ error: "Буруу статус" }, { status: 400 });
  }

  try {
    const existing = await prisma.application.findUnique({
      where: { id },
      select: { job: { select: { employerId: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Өргөдөл олдсонгүй" }, { status: 404 });
    }

    if (existing.job.employerId !== session.user.id) {
      return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
