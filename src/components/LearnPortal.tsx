"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle,
  Loader2,
  PlayCircle,
  Award,
  ArrowLeft,
  HelpCircle,
  Check,
  X,
  GraduationCap,
  ExternalLink,
  BookOpen,
} from "lucide-react";

import { recordModuleCompletion } from "@/lib/studentDataStore";

// When finishing a topic or quiz:
recordModuleCompletion();

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface Lesson {
  unit: number;
  title: string;
  duration: string;
  youtubeVideoId: string;
  searchKeyword?: string;
  lectureContent: string;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  bountyReward: number;
}

interface LearnPortalProps {
  initialSearch?: string;
  userRole?: "student" | "industry" | "academician";
  onRewardClaim?: (points: number, reason: string) => void;
}

export default function LearnPortal({
  initialSearch = "",
  userRole = "student",
  onRewardClaim,
}: LearnPortalProps) {
  const [targetCareerRole, setTargetCareerRole] = useState(initialSearch || "Machine Learning Systems");
  const [difficultyLevel, setDifficultyLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseData, setCourseData] = useState<{ title: string; description: string; lessons: Lesson[] } | null>(null);

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<"lecture" | "quiz">("lecture");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedUnits, setCompletedUnits] = useState<number[]>([]);

  const handleGenerateAiCurriculum = async () => {
    if (!targetCareerRole.trim()) {
      alert("Please enter a subject or career role.");
      return;
    }

    setIsGenerating(true);
    setActiveLesson(null);

    try {
      const res = await fetch("/api/ai/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTarget: targetCareerRole,
          experienceLevel: difficultyLevel,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        let parsedLessons: Lesson[] = [];
        if (Array.isArray(data.lessons)) {
          parsedLessons = data.lessons;
        } else if (typeof data.lessons === "string") {
          parsedLessons = JSON.parse(data.lessons);
        } else if (data.lessonsJson) {
          parsedLessons = JSON.parse(data.lessonsJson);
        }

        setCourseData({
          title: data.title,
          description: data.description,
          lessons: parsedLessons,
        });
      } else {
        alert(data.error || "Failed to generate course");
      }
    } catch (err) {
      console.error(err);
      alert("Network error connecting to AI engine.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenClassroom = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveTab("lecture");
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleEvaluateQuiz = () => {
    if (!activeLesson) return;

    if (Object.keys(selectedAnswers).length < activeLesson.quiz.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setQuizSubmitted(true);
    const correctCount = activeLesson.quiz.reduce((acc, q, idx) => {
      return selectedAnswers[idx] === q.correctAnswerIndex ? acc + 1 : acc;
    }, 0);

    const isPerfect = correctCount === activeLesson.quiz.length;

    if (isPerfect && !completedUnits.includes(activeLesson.unit)) {
      setCompletedUnits((prev) => [...prev, activeLesson.unit]);
      if (onRewardClaim) {
        onRewardClaim(activeLesson.bountyReward, `Passed Unit ${activeLesson.unit} Exam: ${activeLesson.title}`);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Search & Level Bar (Only shown when not in classroom) */}
      {!activeLesson && (
        <div className="bg-white/80 dark:bg-[#0e1726]/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-blue-600 dark:text-blue-400" size={22} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personalized Course</h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start">
              {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficultyLevel(lvl)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    difficultyLevel === lvl
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
            <input
              type="text"
              value={targetCareerRole}
              onChange={(e) => setTargetCareerRole(e.target.value)}
              placeholder="e.g. Distributed Systems Engineer, PyTorch Internals, Cloud Architect..."
              className="w-full sm:flex-1 px-4 py-2.5 text-sm rounded-xl border border-white/50 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateAiCurriculum}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isGenerating ? "Synthesizing Course..." : `Build ${difficultyLevel} Track`}
            </button>
          </div>
        </div>
      )}

      {/* Module Overview Cards (NO VIDEO HERE - Video only inside Classroom) */}
      {courseData && !activeLesson && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
              {difficultyLevel} Track
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{courseData.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">{courseData.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseData.lessons.map((lesson) => {
              const isDone = completedUnits.includes(lesson.unit);
              return (
                <div
                  key={lesson.unit}
                  className={`p-6 rounded-3xl border transition flex flex-col justify-between space-y-4 ${
                    isDone
                      ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        Unit {lesson.unit} • {lesson.duration}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Award size={13} /> +{lesson.bountyReward} Pts
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{lesson.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {lesson.lectureContent}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      {lesson.quiz?.length || 0} Questions Quiz
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenClassroom(lesson)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <PlayCircle size={14} />
                      <span>{isDone ? "Review Lecture" : "Enter Classroom"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Classroom View (Only ONE single video iframe is rendered here) */}
      {activeLesson && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveLesson(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Syllabus</span>
            </button>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              Exam Bounty: +{activeLesson.bountyReward} Pts
            </span>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Classroom Tab Navigation */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-4 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("lecture")}
                className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === "lecture"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                <BookOpen size={16} /> Lecture Material
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("quiz")}
                className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === "quiz"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                <HelpCircle size={16} /> Unit Exam ({activeLesson.quiz?.length || 0} Qs)
              </button>
            </div>

            {/* SINGLE Video Player & Lecture Section */}
            {activeTab === "lecture" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">
                    Unit {activeLesson.unit} Lecture
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {activeLesson.title}
                  </h3>
                </div>

                {/* THE ONLY IFRAME */}
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-lg">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtubeVideoId}?rel=0&modestbranding=1`}
                      title={activeLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                    <span className="text-slate-500">Duration: <strong>{activeLesson.duration}</strong></span>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        `${targetCareerRole} ${activeLesson.title} lecture`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Search related videos on YouTube</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4 pt-2">
                  {activeLesson.lectureContent}
                </div>

                {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                  <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
                    <h4 className="font-bold text-xs text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                      Key Lecture Takeaways
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {activeLesson.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab("quiz")}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Unit Test</span>
                    <PlayCircle size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === "quiz" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">
                    Assessment
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Checkpoint: {activeLesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Answer all questions correctly to claim +{activeLesson.bountyReward} bounty points.
                  </p>
                </div>

                <div className="space-y-6">
                  {activeLesson.quiz?.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3"
                    >
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Question {qIndex + 1}: {q.question}
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = selectedAnswers[qIndex] === optIndex;
                          const isCorrect = q.correctAnswerIndex === optIndex;

                          let buttonStyle =
                            "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
                          if (isSelected) {
                            buttonStyle =
                              "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-semibold";
                          }
                          if (quizSubmitted) {
                            if (isCorrect) {
                              buttonStyle =
                                "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-semibold";
                            } else if (isSelected && !isCorrect) {
                              buttonStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600";
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectOption(qIndex, optIndex)}
                              className={`p-3 rounded-xl text-left text-xs border transition flex items-center justify-between cursor-pointer ${buttonStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <Check size={14} className="text-emerald-500" />}
                              {quizSubmitted && isSelected && !isCorrect && <X size={14} className="text-rose-500" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-mono">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab("lecture")}
                    className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                  >
                    Review Material
                  </button>

                  {!quizSubmitted ? (
                    <button
                      type="button"
                      onClick={handleEvaluateQuiz}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition"
                    >
                      Submit Exam & Claim Bounty
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      {completedUnits.includes(activeLesson.unit) ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle size={15} /> Verified! +{activeLesson.bountyReward} Pts Awarded
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setQuizSubmitted(false);
                            setSelectedAnswers({});
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
                        >
                          Retake Exam
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}