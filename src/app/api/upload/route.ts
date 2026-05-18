import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getAvatarExtension(type: string): "jpg" | "png" | "webp" | null {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const formData = await req.formData();
    const avatar = formData.get("avatar") as File | null;
    const cv = formData.get("cv") as File | null;

    if (avatar) {
      if (!ALLOWED_AVATAR_TYPES.has(avatar.type)) {
        return NextResponse.json(
          { error: "Only JPG, PNG, and WEBP images are allowed" },
          { status: 400 }
        );
      }
      if (avatar.size > 3 * 1024 * 1024) {
        return NextResponse.json({ error: "Avatar size must be 3MB or smaller" }, { status: 400 });
      }
      if (avatar.size === 0) {
        return NextResponse.json({ error: "Avatar file is empty" }, { status: 400 });
      }

      const ext = getAvatarExtension(avatar.type);
      if (!ext) {
        return NextResponse.json({ error: "Unsupported avatar type" }, { status: 400 });
      }

      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), "public", "uploads", "avatars");
      await mkdir(uploadDir, { recursive: true });

      const filename = `${session.user.id}-${Date.now()}.${ext}`;
      await writeFile(join(uploadDir, filename), buffer);

      return NextResponse.json({ url: `/uploads/avatars/${filename}` });
    }

    if (cv) {
      if (cv.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
      }
      if (cv.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "CV size must be 5MB or smaller" }, { status: 400 });
      }
      if (cv.size === 0) {
        return NextResponse.json({ error: "CV file is empty" }, { status: 400 });
      }

      const bytes = await cv.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), "public", "uploads", "cvs");
      await mkdir(uploadDir, { recursive: true });

      const filename = `${session.user.id}-${Date.now()}.pdf`;
      await writeFile(join(uploadDir, filename), buffer);

      return NextResponse.json({ url: `/uploads/cvs/${filename}` });
    }

    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  } catch (error) {
    console.error("[upload] error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
