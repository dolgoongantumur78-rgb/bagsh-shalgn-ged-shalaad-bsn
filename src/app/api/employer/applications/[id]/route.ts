import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ApplicationStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  ApplicationStatus.PENDING,
  ApplicationStatus.REVIEWED,
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.REJECTED,
] as const;

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && VALID_STATUSES.includes(value as ApplicationStatus);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Ð—Ó©Ð²ÑˆÓ©Ó©Ñ€Ó©Ð» Ð±Ð°Ð¹Ñ…Ð³Ò¯Ð¹" }, { status: 403 });
  }

  const { id } = await params;

  let status: ApplicationStatus;
  try {
    const body = await req.json();
    if (!isApplicationStatus(body?.status)) {
      return NextResponse.json({ error: "Ð‘ÑƒÑ€ÑƒÑƒ ÑÑ‚Ð°Ñ‚ÑƒÑ" }, { status: 400 });
    }
    status = body.status;
  } catch {
    return NextResponse.json({ error: "Ð‘ÑƒÑ€ÑƒÑƒ Ñ…Ò¯ÑÑÐ»Ñ‚Ð¸Ð¹Ð½ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚" }, { status: 400 });
  }

  try {
    const existing = await prisma.application.findUnique({
      where: { id },
      select: { job: { select: { employerId: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Ó¨Ñ€Ð³Ó©Ð´Ó©Ð» Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹" }, { status: 404 });
    }

    if (existing.job.employerId !== session.user.id) {
      return NextResponse.json({ error: "Ð—Ó©Ð²ÑˆÓ©Ó©Ñ€Ó©Ð» Ð±Ð°Ð¹Ñ…Ð³Ò¯Ð¹" }, { status: 403 });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "Ð¡ÐµÑ€Ð²ÐµÑ€Ð¸Ð¹Ð½ Ð°Ð»Ð´Ð°Ð°" }, { status: 500 });
  }
}
