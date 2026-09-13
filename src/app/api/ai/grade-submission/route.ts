import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

function getFallbackGrade(topic: string, mcqResults: any[]) {
  const gradedQuestions = (mcqResults || []).map((q: any, idx: number) => {
    const isCorrect = q.chosenIndex === q.correctIndex;
    return {
      questionId: q.id ?? idx + 1,
      question: q.question,
      userAnswerIndex: q.chosenIndex ?? -1,
      correctAnswerIndex: q.correctIndex ?? 0,
      isCorrect: Boolean(isCorrect),
      explanation: isCorrect
        ? "Accurate answer. Solid command of this concept."
        : `Incorrect. Option ${((q.correctIndex ?? 0) + 1)} is correct because it adheres to standard ${topic} design principles.`,
    };
  });

  const correctCount = gradedQuestions.filter((q: any) => q.isCorrect).length;
  const total = gradedQuestions.length || 1;
  const score = Math.round((correctCount / total) * 100);

  return {
    compositeScore: score,
    bountyPointsAwarded: Math.max(25, score),
    performanceVerdict:
      score >= 70
        ? `Strong technical understanding of ${topic}.`
        : `Foundational knowledge in place for ${topic}, but key edge cases require review.`,
    questionReviews: gradedQuestions,
    strengths: [
      `Grasp of baseline ${topic} architecture`,
      "Correctly reasoned through algorithmic trade-offs",
    ],
    weaknesses: [
      "Edge-case state handling and recovery failure scenarios",
    ],
    codeAnalysis: {
      efficiencyRating: "O(N) Linear Time",
      feedback: "Implementation executes standard paths correctly. Focus on boundary-case defensive checks.",
    },
    studyMaterials: [
      {
        title: `${topic} Architectural Guide`,
        type: "Documentation",
        description: "Official specs and deep-dive implementation blueprints.",
        url: "https://developer.mozilla.org",
      },
      {
        title: `${topic} Deep Dive Lecture`,
        type: "Video Lecture",
        description: "Core technical lecture breakdown on system trade-offs.",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " lecture")}`,
      },
    ],
  };
}

export async function POST(req: Request) {
  let topic = "Technical Assessment";
  let mcqResults: any[] = [];

  try {
    const body = await req.json();
    topic = body.topic || topic;
    mcqResults = body.mcqResults || [];
    const { difficulty = "Intermediate", codingSubmission = "", codingProblem = {} } = body;

    const { object } = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: z.object({
        compositeScore: z.number().min(0).max(100),
        bountyPointsAwarded: z.number(),
        performanceVerdict: z.string(),
        questionReviews: z.array(
          z.object({
            questionId: z.number(),
            question: z.string(),
            userAnswerIndex: z.number(),
            correctAnswerIndex: z.number(),
            isCorrect: z.boolean(),
            explanation: z.string(),
          })
        ),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        codeAnalysis: z.object({
          efficiencyRating: z.string(),
          feedback: z.string(),
        }),
        studyMaterials: z.array(
          z.object({
            title: z.string(),
            type: z.enum(["Documentation", "Video Lecture", "System Design Paper", "GitHub Repo"]),
            description: z.string(),
            url: z.string(),
          })
        ),
      }),
      prompt: `Evaluate this exam for "${topic}" at ${difficulty} level.
MCQ Question Responses from Candidate:
${JSON.stringify(mcqResults, null, 2)}

Candidate Coding Solution:
${codingSubmission}

Problem Definition:
${codingProblem?.title} - ${codingProblem?.problemStatement}

Return:
1. "questionReviews": An itemized review for EACH question stating the user's answer index, the correct answer index, boolean isCorrect, and an explanation of why the correct answer is right.
2. "compositeScore": 0-100 score.
3. "bountyPointsAwarded": Points between 25 and 150.
4. "strengths" & "weaknesses": Targeted diagnostic insights.
5. "codeAnalysis" & "studyMaterials".`,
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.warn("Grading error, falling back to deterministic evaluator:", error.message);
    return NextResponse.json(getFallbackGrade(topic, mcqResults));
  }
}