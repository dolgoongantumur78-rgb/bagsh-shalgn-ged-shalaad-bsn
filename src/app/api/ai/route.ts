import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  let messages: unknown[];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return NextResponse.json({ error: "Буруу хүсэлтийн формат" }, { status: 400 });
  }

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are MindMatch AI, a friendly career advisor on a Mongolian hiring platform that uses Big Five (OCEAN) personality psychology to match candidates with jobs. " +
            "Help users with career advice, interview preparation, CV tips, and personality insights. " +
            "Be concise, warm, and practical. Respond in Mongolian when the user writes in Mongolian, in English when they write in English.",
        },
        ...(messages as Parameters<typeof groq.chat.completions.create>[0]["messages"]),
      ],
      stream: true,
      max_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "AI серверт холбогдоход алдаа гарлаа" }, { status: 500 });
  }
}
