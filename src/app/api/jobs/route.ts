import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const search = searchParams.get("search");

  try {
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
        ...(location && { location: { contains: location } }),
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      },
      include: {
        employer: { select: { name: true, profile: { select: { companyName: true } } } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Зөвшөөрөл байхгүй" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const job = await prisma.job.create({
      data: {
        ...body,
        employerId: session.user.id,
        openness:          body.openness          != null ? Number(body.openness)          : 50,
        conscientiousness: body.conscientiousness != null ? Number(body.conscientiousness) : 50,
        extraversion:      body.extraversion      != null ? Number(body.extraversion)      : 50,
        agreeableness:     body.agreeableness     != null ? Number(body.agreeableness)     : 50,
        neuroticism:       body.neuroticism       != null ? Number(body.neuroticism)       : 50,
      },
    });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
