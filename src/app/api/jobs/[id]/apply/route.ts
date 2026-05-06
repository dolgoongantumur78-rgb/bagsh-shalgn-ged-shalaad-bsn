import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/psychology";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

    const { id: jobId } = await params;

    let coverLetter: string | undefined;
    let cvUrl: string | null = null;
    try {
      const body = await req.json();
      coverLetter = body.coverLetter;
      cvUrl = body.cvUrl ?? null;
    } catch {
      return NextResponse.json({ error: "Буруу хүсэлтийн формат" }, { status: 400 });
    }

    const [job, assessment] = await Promise.all([
      prisma.job.findUnique({ where: { id: jobId } }),
      prisma.assessment.findUnique({ where: { userId: session.user.id } }),
    ]);

    if (!job) return NextResponse.json({ error: "Ажил олдсонгүй" }, { status: 404 });

    const existing = await prisma.application.findUnique({
      where: { jobId_userId: { jobId, userId: session.user.id } },
    });
    if (existing) return NextResponse.json({ error: "Аль хэдийн өргөдөл гаргасан" }, { status: 400 });

    let matchScore: number | null = null;
    if (assessment) {
      matchScore = calculateMatchScore(
        {
          openness: assessment.openness,
          conscientiousness: assessment.conscientiousness,
          extraversion: assessment.extraversion,
          agreeableness: assessment.agreeableness,
          neuroticism: assessment.neuroticism,
        },
        {
          openness: job.openness,
          conscientiousness: job.conscientiousness,
          extraversion: job.extraversion,
          agreeableness: job.agreeableness,
          neuroticism: job.neuroticism,
        }
      );
    }

    const application = await prisma.application.create({
      data: { jobId, userId: session.user.id, coverLetter, cvUrl, matchScore },
    });

    return NextResponse.json(application);
  } catch (err) {
    console.error("[apply] error:", err);
    return NextResponse.json({ error: "Серверийн алдаа гарлаа" }, { status: 500 });
  }
}
