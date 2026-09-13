import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq"; // <-- Use Groq
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { roleTarget = "Machine Learning Systems", experienceLevel = "Intermediate" } = await req.json();

    const { object } = await generateObject({
     model: groq("openai/gpt-oss-120b"),

      schema: z.object({
        title: z.string(),
        description: z.string(),
        lessons: z.array(
          z.object({
            unit: z.number(),
            title: z.string(),
            duration: z.string(),
            searchKeyword: z.string(),
            lectureContent: z.string(),
            keyTakeaways: z.array(z.string()),
            quiz: z.array(
              z.object({
                question: z.string(),
                options: z.array(z.string()),
                correctAnswerIndex: z.number().min(0).max(3),
                explanation: z.string(),
              })
            ),
            bountyReward: z.number(),
          })
        ),
      }),
      prompt: `Generate an in-depth university syllabus for "${roleTarget}" at level "${experienceLevel}".
For each lesson, provide:
1. "searchKeyword": specific technical keyword for this lesson's video.
2. "lectureContent": textbook-quality academic explanations.
3. "keyTakeaways": 3 concise summary takeaways.
4. "quiz": 2-3 conceptual multiple-choice questions with 4 options and correct answer index (0-3).
5. "bountyReward": points between 50 and 150.`,
    });

    // YouTube search resolution
    const lessonsWithVideos = await Promise.all(
      object.lessons.map(async (lesson) => {
        let videoId = "";
        try {
          const query = `${roleTarget} ${lesson.title}`;
          const res = await fetch(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " tutorial lecture")}`,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            }
          );
          const html = await res.text();
          const match = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
          if (match && match[1]) {
            videoId = match[1];
          }
        } catch (e) {
          console.warn("Could not resolve video ID for lesson:", lesson.title);
        }

        return {
          ...lesson,
          youtubeVideoId: videoId || "kCc8FmEb1nY",
        };
      })
    );

    try {
      if ((prisma as any)?.courseModule?.create) {
        await (prisma as any).courseModule.create({
          data: {
            roleTarget,
            title: object.title,
            description: object.description,
            lessonsJson: JSON.stringify(lessonsWithVideos),
          },
        });
      }
    } catch (dbErr: any) {
      console.warn("DB save skipped:", dbErr?.message);
    }

    return NextResponse.json({
      title: object.title,
      description: object.description,
      lessons: lessonsWithVideos,
      roleTarget,
    });
  } catch (error: any) {
    console.error("AI Course Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate course" }, { status: 500 });
  }
}