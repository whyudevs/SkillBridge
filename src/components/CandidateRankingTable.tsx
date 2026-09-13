"use client";

import { useState } from "react";
import { INITIAL_STUDENTS, StudentProfile } from "@/lib/mock-data";
import { Award, Search, ArrowUpDown, CheckCircle2, ShieldCheck, Zap, Coins } from "lucide-react";

export function CandidateRankingTable() {
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"composite" | "bounty" | "assessment">("composite");

  const tierOrder: Record<string, number> = {
    Diamond: 5,
    Platinum: 4,
    Gold: 3,
    Silver: 2,
    Bronze: 1,
  };

  const filteredStudents = INITIAL_STUDENTS
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.college.toLowerCase().includes(search.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));
      const matchesTier = selectedTier === "All" || s.tier === selectedTier;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === "composite") return b.compositeScore - a.compositeScore;
      if (sortBy === "bounty") return b.bountyPoints - a.bountyPoints;
      return b.assessmentScore - a.assessmentScore;
    });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Diamond":
        return "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800";
      case "Platinum":
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800";
      case "Gold":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800";
      case "Silver":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
      case "Bronze":
        return "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-800";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            Leaderboard
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Global Candidate Rankings ({INITIAL_STUDENTS.length})
          </h2>
          <p className="text-xs text-slate-500">
            Strictly ranked by Composite Score: 2 in Diamond, 4 in Platinum, 8 in Gold, 8 in Silver, and 6 in Bronze.
          </p>
        </div>

        {/* Tier Summary Pills */}
        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-300">
            2 Diamond (650+)
          </span>
          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-300">
            4 Platinum (580-649)
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300">
            8 Gold (480-579)
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
            8 Silver (350-479)
          </span>
          <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-bold">
            6 Bronze (&lt;350)
          </span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, college, or skill (e.g. Raft, Rust, B+ Trees)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["All", "Diamond", "Platinum", "Gold", "Silver", "Bronze"].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                selectedTier === tier
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
              <th className="p-3 w-12 text-center">Rank</th>
              <th className="p-3">Candidate & Academic Background</th>
              <th className="p-3">Tier</th>
              <th 
                onClick={() => setSortBy("assessment")}
                className="p-3 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Diagnostic Test</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th 
                onClick={() => setSortBy("bounty")}
                className="p-3 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Bounty Pts</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th 
                onClick={() => setSortBy("composite")}
                className="p-3 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1 font-bold text-blue-600">
                  <span>Composite Score</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="p-3">Verified Skills</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredStudents.map((s, idx) => (
              <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                <td className="p-3 text-center font-mono font-bold text-slate-400">
                  #{idx + 1}
                </td>
                <td className="p-3 space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                    <span>{s.name}</span>
                    {idx < 2 && <Award size={13} className="text-cyan-500 fill-cyan-500 shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    {s.college} • {s.degree} (Sem {s.semester})
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTierBadge(s.tier)}`}>
                    {s.tier}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                  {s.assessmentScore}%
                </td>
                <td className="p-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  +{s.bountyPoints}
                </td>
                <td className="p-3 font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                  {s.compositeScore}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {s.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                        {sk}
                      </span>
                    ))}
                    {s.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{s.skills.length - 3}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}