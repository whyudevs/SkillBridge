import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic query is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Dynamic fallback mock generator if API key is not configured locally
      return NextResponse.json({
        topicName: topic,
        courseCredits: 4,
        legacyTopicReplaced: `Legacy ${topic} Abstract Theory & Monolithic Frameworks`,
        industryRelevance: `Production microservice architectures, high-scale infrastructure, and low-latency environments require hands-on mastery of ${topic}.`,
        weeks: [
          {
            week: 1,
            title: `Foundations & Mathematical Underpinnings of ${topic}`,
            lectureTopics: [
              `Core axioms, invariants, and fundamental constraints`,
              `State machine replication and basic correctness proofs`,
            ],
            labActivity: `Simulate core failure modes in isolated sandboxes and verify logs.`,
          },
          {
            week: 2,
            title: `Concurrent Implementation & Memory Layout`,
            lectureTopics: [
              `Lock contention, atomic operations, and memory ordering`,
              `Defensive boundary verification and thread synchronization`,
            ],
            labActivity: `Construct a minimal working prototype with unit test harness.`,
          },
          {
            week: 3,
            title: `Production Edge Cases, Telemetry & Chaos Engineering`,
            lectureTopics: [
              `Partition healing, split-brain mitigation, and quorum recovery`,
              `Metrics collection, p99 latency profiling, and alerting thresholds`,
            ],
            labActivity: `Inject packet loss and node crashes to measure recovery time.`,
          },
          {
            week: 4,
            title: `Capstone System Integration & Benchmarking`,
            lectureTopics: [
              `Integration with production cloud native ecosystems`,
              `Throughput scaling strategies and profiling tools`,
            ],
            labActivity: `Deploy prototype to multi-node cluster and run 100k throughput test.`,
          },
        ],
        diagnosticExam: {
          examTitle: `${topic} Capstone Assessment`,
          durationMinutes: 60,
          passingThreshold: "75%",
          codingProblem: {
            title: `Implement ${topic} Core Invariant Engine`,
            problemStatement: `Construct a production-grade module in TypeScript/Node.js or Python enforcing correctness under concurrent stress. Prevent race conditions and guarantee state consistency.`,
            starterCode: `// ${topic} Implementation Engine\nexport class Engine {\n  private state: Map<string, any> = new Map();\n\n  execute(command: string): boolean {\n    // TODO: implement logic\n    return true;\n  }\n}`,
            evaluationCriteria: [
              "Zero data race conditions under concurrent worker threads",
              "Sub-5ms p95 execution latency",
              "Defensive error handling on network disconnect",
            ],
          },
          conceptualQuestions: [
            {
              question: `What primary invariant distinguishes modern ${topic} from legacy single-node implementations?`,
              expectedAnswer: `Guarantees consistent state transitions across partitioned clusters without centralized single-point-of-failure bottlenecks.`,
            },
            {
              question: `How does the system defend against split-brain scenarios under network degradation?`,
              expectedAnswer: `Enforces strict majority quorum (N/2 + 1) voting before committing any state mutation.`,
            },
          ],
        },
      });
    }

    // Direct Gemini 2.5 flash synthesis
    const prompt = `You are an elite Computer Science Dean and Curriculum Modernization Architect.
A university professor wants to introduce the following topic into the engineering syllabus: "${topic}".

Generate a comprehensive pedagogical roadmap and an assessment test in clean JSON format matching this exact schema:
{
  "topicName": "${topic}",
  "courseCredits": 4,
  "legacyTopicReplaced": "Name of outdated/obsolete syllabus topic this modern topic replaces",
  "industryRelevance": "2-3 sentences explaining why top companies demand this skill",
  "weeks": [
    {
      "week": 1,
      "title": "Week 1 Focus",
      "lectureTopics": ["Topic 1", "Topic 2"],
      "labActivity": "Hands-on lab project description"
    },
    {
      "week": 2,
      "title": "Week 2 Focus",
      "lectureTopics": ["Topic 1", "Topic 2"],
      "labActivity": "Hands-on lab project description"
    },
    {
      "week": 3,
      "title": "Week 3 Focus",
      "lectureTopics": ["Topic 1", "Topic 2"],
      "labActivity": "Hands-on lab project description"
    },
    {
      "week": 4,
      "title": "Week 4 Focus",
      "lectureTopics": ["Topic 1", "Topic 2"],
      "labActivity": "Hands-on lab project description"
    }
  ],
  "diagnosticExam": {
    "examTitle": "${topic} Production Diagnostic Examination",
    "durationMinutes": 60,
    "passingThreshold": "75%",
    "codingProblem": {
      "title": "Coding Problem Title",
      "problemStatement": "Clear, practical specification for the coding task",
      "starterCode": "// Starter code snippet\\nexport function solve() {\\n\\n}",
      "evaluationCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
    },
    "conceptualQuestions": [
      {
        "question": "Question 1",
        "expectedAnswer": "Model solution/rubric"
      },
      {
        "question": "Question 2",
        "expectedAnswer": "Model solution/rubric"
      }
    ]
  }
}

Return ONLY raw JSON, with no markdown code fences.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        }),
      }
    );

    const result = await response.json();
    const textOutput = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = textOutput ? JSON.parse(textOutput) : null;

    return NextResponse.json(cleanJson);
  } catch (error: any) {
    console.error("AI Syllabus Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate syllabus roadmap via AI." },
      { status: 500 }
    );
  }
}