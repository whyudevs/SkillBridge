import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

export async function POST(req: Request) {
  let reqTopic = "Distributed Systems & Raft";
  let reqDifficulty = "Intermediate";

  try {
    const body = await req.json();
    reqTopic = body.topic || reqTopic;
    reqDifficulty = body.difficulty || reqDifficulty;

    const { object } = await generateObject({
  model: groq("openai/gpt-oss-120b"),
  // Remove maxTokens line or use maxOutputTokens if needed by your SDK version
  schema: z.object({
    examTitle: z.string(),
    topic: z.string(),
    difficulty: z.string(),
    estimatedMinutes: z.number(),
    mcqQuestions: z.array(
      z.object({
        id: z.number(),
        question: z.string(),
        options: z.array(z.string()),
        correctIndex: z.number().min(0).max(3),
        conceptTag: z.string(),
      })
    ),
    codingChallenge: z.object({
      title: z.string(),
      problemStatement: z.string(),
      starterCode: z.string(),
      expectedComplexity: z.string(),
    }),
  }),
  prompt: `Create a concise diagnostic test on "${reqTopic}" (${reqDifficulty}). Provide 3 MCQs and 1 coding challenge.`,
});

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("Exam generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate exam" }, { status: 500 });
  }
}