"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Terminal,
  TrendingUp,
  Video,
  X,
  FileCode,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { 
  getStudentData, 
  removeApplication, 
  StudentProfileData, 
  TestHistoryItem 
} from "@/lib/studentDataStore";

export interface StudentOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

const initialDefaultData: StudentProfileData = {
  modulesCompleted: 0,
  testsTaken: 0,
  averageScore: 0,
  bountyPoints: 0,
  testHistory: [],
  applications: [],
};

export default function StudentOverview({ onNavigateTab }: StudentOverviewProps) {
  const [data, setData] = useState<StudentProfileData>(initialDefaultData);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestHistoryItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setData(getStudentData());

    const handleUpdate = () => setData(getStudentData());
    window.addEventListener("student_telemetry_updated", handleUpdate);
    return () => window.removeEventListener("student_telemetry_updated", handleUpdate);
  }, []);

  const handleWithdraw = (appId: string, role: string, company: string) => {
    if (confirm(`Withdraw application for ${role} at ${company}?`)) {
      removeApplication(appId);
    }
  };

  if (!isMounted) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading real-time student telemetry...
      </div>
    );
  }

  const upcomingInterviews = (data.applications || []).filter(
    (app) => app.status === "Interview Scheduled" && app.interviewDate
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Dynamic Academic & Exam Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Courses Taken</span>
            <GraduationCap size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {data.modulesCompleted} Modules
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} /> Real-time Course Telemetry
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Tests Evaluated</span>
            <Terminal size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {data.testsTaken} Completed
          </div>
          <p className="text-[11px] text-slate-500">Click test below to view scorecard</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Avg Exam Score</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {data.averageScore}%
          </div>
          <p className="text-[11px] text-slate-500">Calculated over all attempts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Bounty Points</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {data.bountyPoints} Pts
          </div>
          <p className="text-[11px] text-slate-500">Earned from Code Submissions</p>
        </div>
      </div>

      {/* LIVE INTERVIEW RADAR & GOOGLE MEET CALLOUT */}
      {upcomingInterviews.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent border border-blue-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Scheduled Live Interviews</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                Action Required
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingInterviews.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-blue-500/30 shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {app.company}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {app.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app.id, app.role, app.company)}
                        title="Withdraw Application"
                        className="text-slate-400 hover:text-rose-500 transition p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{app.role}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {app.interviewDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {app.interviewTime}
                    </span>
                  </div>
                </div>

                {app.meetLink ? (
                  <a
                    href={app.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Video size={16} />
                    <span>Join Google Meet Interview</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400 font-mono text-center">
                    Awaiting Recruiter Meet Room Provisioning
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT APPLICATIONS TRACKER WITH REMOVE ACTION */}
      <div className="bg-white dark:bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-blue-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Applied Jobs & Internships Pipeline
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("jobs")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Explore More Postings
          </button>
        </div>

        <div className="overflow-x-auto">
          {data.applications && data.applications.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Company & Role</th>
                  <th className="pb-3 font-semibold">Track</th>
                  <th className="pb-3 font-semibold">Date Applied</th>
                  <th className="pb-3 font-semibold">Pipeline Status</th>
                  <th className="pb-3 font-semibold text-right">Meeting & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {data.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                    <td className="py-3.5 pr-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{app.role}</span>
                      <span className="text-slate-400 text-[11px]">{app.company}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {app.type}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-500 font-mono text-[11px]">{app.appliedDate}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`font-mono text-[10px] px-2.5 py-1 rounded-full font-bold inline-block ${
                          app.status === "Interview Scheduled"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : app.status === "Reviewing"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {app.meetLink && (
                          <a
                            href={app.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] shadow-xs"
                          >
                            <Video size={12} />
                            <span>Join Meet</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleWithdraw(app.id, app.role, app.company)}
                          title="Withdraw Application"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-slate-400 font-mono text-xs">
              No active applications. Explore available positions in the Jobs tab.
            </div>
          )}
        </div>
      </div>

      {/* CLICKABLE TEST RECORD HISTORY */}
      <div className="bg-white dark:bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal size={18} className="text-indigo-500" />
            <span>Completed Diagnostic Test Log</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Click any entry to view full report
          </span>
        </div>

        <div className="space-y-2">
          {(data.testHistory || []).map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => setSelectedTest(th)}
              className="w-full p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition cursor-pointer flex items-center justify-between text-left group active:scale-[0.99]"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {th.topic}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    +{th.pointsEarned || th.score} Pts
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>Completed: {th.date}</span>
                  <span>•</span>
                  <span>{th.efficiencyRating || "Standard Production Efficiency"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                  {th.score}%
                </span>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 transition group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* HISTORICAL TEST RESULT SCORECARD MODAL */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold uppercase">
                      Proctored Diagnostic Scorecard
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedTest.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedTest.topic}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Composite Score</span>
                  <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                    {selectedTest.score}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Points Earned</span>
                  <span className="text-2xl font-black font-mono text-amber-500">
                    +{selectedTest.pointsEarned || selectedTest.score} Pts
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px]">
                  Evaluator Verdict
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedTest.verdict}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block uppercase tracking-wider text-[10px]">
                    Validated Competencies
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {(selectedTest.strengths || ["Core conceptual accuracy"]).map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                    Identified Bottlenecks
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {(selectedTest.weaknesses || ["Edge-case boundary testing"]).map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedTest.studyRecommendation && (
                <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">Recommended Whitepaper / Study Path:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedTest.studyRecommendation}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(selectedTest.studyRecommendation)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shrink-0"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}