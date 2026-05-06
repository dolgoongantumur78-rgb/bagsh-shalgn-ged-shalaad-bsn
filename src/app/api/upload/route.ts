import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Файл уншихад алдаа гарлаа" }, { status: 400 });
    }

    const file = formData.get("cv") as File | null;

    if (!file) return NextResponse.json({ error: "Файл олдсонгүй" }, { status: 400 });
    if (file.type !== "application/pdf")
      return NextResponse.json({ error: "Зөвхөн PDF файл зөвшөөрнө" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: "Файлын хэмжээ 5MB-аас их байж болохгүй" }, { status: 400 });
    if (file.size === 0)
      return NextResponse.json({ error: "Файл хоосон байна" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", "cvs");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${session.user.id}-${Date.now()}.pdf`;
    await writeFile(join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/cvs/${filename}` });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json({ error: "Файл байршуулахад алдаа гарлаа" }, { status: 500 });
  }
}
