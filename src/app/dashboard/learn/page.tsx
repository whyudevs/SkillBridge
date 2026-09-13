"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ProctoringSimulator } from "@/components/ProctoringSimulator";
import { CandidateRankingTable } from "@/components/CandidateRankingTable";
import { INITIAL_STUDENTS, INITIAL_INDUSTRY, INITIAL_ACADEMICIAN, INITIAL_BOUNTIES } from "@/lib/mock-data";

function DashboardContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "student" | "industry" | "academician") || "student";
  const tab = searchParams.get("tab") || "proctor";

  const userName =
    role === "student"
      ? INITIAL_STUDENTS[0].name
      : role === "industry"
      ? INITIAL_INDUSTRY.company
      : INITIAL_ACADEMICIAN.name;

  return (
   <DashboardLayout 
  userRole={role} 
  userName={userName}
  activeTab="learn"
  onTabChange={(tabId) => {
    // optional navigation if someone clicks a sidebar tab from this standalone route
    window.location.href = `/dashboard?role=${role}&tab=${tabId}`;
  }}
>
      {role === "student" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]">
              <span className="text-xs text-slate-500">Tier Status</span>
              <p className="text-2xl font-bold text-amber-500 mt-1">Gold Candidate</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]">
              <span className="text-xs text-slate-500">Composite Score</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">542 Pts</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]">
              <span className="text-xs text-slate-500">Active Technical Bounties</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">2 Available</p>
            </div>
          </div>

          {/* Tab 1: Proctored Exam Simulator */}
          {tab === "proctor" && <ProctoringSimulator />}

          {/* Tab 2: Learn Modules */}
          {tab === "learn" && (
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Curated Technical Modules</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Inline playlists from NPTEL & YouTube with end-of-unit diagnostic drills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-semibold">
                    Distributed Systems
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Raft Consensus & Log Replication
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Explore leader election, term numbering, and split-brain resolution protocols.
                  </p>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">
                    Start Lecture & Quiz
                  </button>
                </div>

                <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-semibold">
                    Database Internals
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    PostgreSQL Indexing & Cost-Based Optimizer
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    B-Trees, GiST, WAL internals, and query execution plans analysis.
                  </p>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">
                    Start Lecture & Quiz
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bounties */}
          {tab === "bounties" && (
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] space-y-4">
              <div>
                <h3 className="text-lg font-bold">Active Technical Bounties</h3>
                <p className="text-xs text-slate-500">Solve production engineering issues to boost your tier rank.</p>
              </div>
              <div className="space-y-3">
                {INITIAL_BOUNTIES.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm">{b.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {b.company} • Prize: {b.prize} • Reward: +{b.points} pts
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">
                      Submit Solution
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Rankings */}
          {tab === "rankings" && <CandidateRankingTable />}

          {/* Tab 5: Jobs */}
          {tab === "jobs" && (
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] space-y-3">
              <h3 className="text-lg font-bold">Verified Role Openings</h3>
              <p className="text-xs text-slate-500">Full-time and internship listings with one-click applications.</p>
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">Systems Software Engineer (L3)</h4>
                  <p className="text-xs text-slate-500">Nexus Dynamics • $120,000 - $140,000 • Remote / Bengaluru</p>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold">
                  Easy Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {role === "industry" && <CandidateRankingTable />}

      {role === "academician" && (
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] space-y-4">
          <h3 className="font-semibold text-base">Curriculum Alignment Console</h3>
          <p className="text-xs text-slate-500">
            Generate updated syllabus modules aligned with trending industry bounties.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm">Loading workspace...</div>}>
      <DashboardContent />
    </Suspense>
  );
}