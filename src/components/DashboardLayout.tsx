"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Coins, 
  Briefcase, 
  Award, 
  Terminal, 
  LogOut, 
  Moon, 
  Sun,
  TrendingUp,
  Sparkles,
  Loader2,
  RefreshCw,
  Flame,
  GraduationCap,
  ArrowRight,
  Compass,
  CheckCircle,
  X,
  Check,
  CheckCircle2,
  Medal
} from "lucide-react";

export type StudentTier = "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze";

export function calculateTier(points: number, avgScore: number = 0): {
  tier: StudentTier;
  colorClass: string;
  badgeBg: string;
  borderClass: string;
  nextTier: string;
  pointsNeeded: number;
} {
  if (points >= 1200 || avgScore >= 95) {
    return {
      tier: "Diamond",
      colorClass: "text-cyan-400",
      badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
      borderClass: "border-cyan-500/30",
      nextTier: "Max Tier Reached",
      pointsNeeded: 0,
    };
  }
  if (points >= 800 || avgScore >= 85) {
    return {
      tier: "Platinum",
      colorClass: "text-indigo-400",
      badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
      borderClass: "border-indigo-500/30",
      nextTier: "Diamond",
      pointsNeeded: 1200 - points,
    };
  }
  if (points >= 500 || avgScore >= 75) {
    return {
      tier: "Gold",
      colorClass: "text-amber-400",
      badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
      borderClass: "border-amber-500/30",
      nextTier: "Platinum",
      pointsNeeded: 800 - points,
    };
  }
  if (points >= 250 || avgScore >= 60) {
    return {
      tier: "Silver",
      colorClass: "text-slate-400",
      badgeBg: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
      borderClass: "border-slate-500/30",
      nextTier: "Gold",
      pointsNeeded: 500 - points,
    };
  }
  return {
    tier: "Bronze",
    colorClass: "text-amber-700",
    badgeBg: "bg-amber-900/10 text-amber-800 dark:text-amber-600",
    borderClass: "border-amber-700/30",
    nextTier: "Silver",
    pointsNeeded: 250 - points,
  };
}

export interface DashboardLayoutProps {
  userRole: "student" | "industry" | "academician";
  userName: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  headerMeta?: React.ReactNode;
  onRoleClick?: () => void;
  children: React.ReactNode;
}

interface BountyItem {
  id: string;
  title: string;
  company: string;
  reward: number;
  difficulty: string;
  tags: string[];
  description: string;
  starterCode: string;
}

export default function DashboardLayout({
  userRole,
  userName,
  activeTab,
  onTabChange,
  headerMeta,
  onRoleClick,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const [trendsDomain, setTrendsDomain] = useState<string>("Distributed AI & Systems Architecture");
  const [customDomainQuery, setCustomDomainQuery] = useState<string>("");
  const [trendsData, setTrendsData] = useState<any>(null);
  const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(false);

  const [activeBountyWorkspace, setActiveBountyWorkspace] = useState<BountyItem | null>(null);
  const [bountyCode, setBountyCode] = useState<string>("");
  const [isSubmittingBounty, setIsSubmittingBounty] = useState<boolean>(false);
  const [bountyFeedback, setBountyFeedback] = useState<any | null>(null);
  const [bountyPoints, setBountyPoints] = useState<number>(340);

  const defaultBounties: BountyItem[] = [
    {
      id: "bounty-1",
      title: "Implement Lock-Free Single-Producer Single-Consumer Ring Buffer",
      company: "Distributed Systems Lab",
      reward: 250,
      difficulty: "Advanced",
      tags: ["Concurrency", "Memory Ordering", "C++ / TS"],
      description: `Design a bounded Ring Buffer queue that allows one thread to push and another thread to pop without acquiring mutex locks. Ensure correct atomic index updates and memory barriers.`,
      starterCode: `// Implement lock-free bounded ring buffer
class SPSCQueue<T> {
  private buffer: (T | null)[];
  private capacity: number;
  private head: number = 0;
  private tail: number = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Array(capacity).fill(null);
  }

  enqueue(item: T): boolean {
    const nextTail = (this.tail + 1) % this.capacity;
    if (nextTail === this.head) return false;
    this.buffer[this.tail] = item;
    this.tail = nextTail;
    return true;
  }

  dequeue(): T | null {
    if (this.head === this.tail) return null;
    const item = this.buffer[this.head];
    this.buffer[this.head] = null;
    this.head = (this.head + 1) % this.capacity;
    return item;
  }
}`,
    },
    {
      id: "bounty-2",
      title: "Optimized Token Bucket Rate Limiter with Redis Lua Scripts",
      company: "Edge Cloud Infrastructure",
      reward: 180,
      difficulty: "Intermediate",
      tags: ["Distributed Systems", "Redis", "Rate Limiting"],
      description: `Write a high-throughput atomic sliding window or token-bucket rate limiter. It must handle burst traffic up to 500 req/s while preventing race conditions across clustered workers.`,
      starterCode: `export async function checkRateLimit(clientId: string, limit: number, intervalMs: number) {
  const now = Date.now();
  return { 
    allowed: true, 
    remainingTokens: limit - 1, 
    resetTimeMs: now + intervalMs 
  };
}`,
    },
    {
      id: "bounty-3",
      title: "Vector Cosine Similarity Kernel Optimization",
      company: "NeuroSearch Inc.",
      reward: 320,
      difficulty: "Advanced",
      tags: ["Vector Search", "Linear Algebra", "SIMD"],
      description: `Implement an optimized batch cosine similarity calculator between a query embedding and 10,000 document vectors.`,
      starterCode: `export function cosineSimilarityBatch(queryVector: number[], matrix: number[][]): number[] {
  return matrix.map(row => {
    let dot = 0;
    for (let i = 0; i < queryVector.length; i++) {
      dot += queryVector[i] * row[i];
    }
    return dot;
  });
}`,
    }
  ];

  const defaultDomains = [
    "Distributed AI & Systems Architecture",
    "Cloud Native & Kubernetes Infrastructure",
    "Full-Stack Next.js & Edge Runtime",
    "Cybersecurity & Zero Trust Architecture",
    "Real-Time Stream Processing & Kafka",
  ];

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sb-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved === "dark" || (!saved && prefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("sb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("sb-theme", "light");
    }
  };

  const fetchMarketTrends = async (domainToSearch?: string) => {
    const targetDomain = domainToSearch || trendsDomain;
    setIsLoadingTrends(true);
    try {
      const res = await fetch("/api/ai/update-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: targetDomain,
          audience: userRole === "academician" ? "academician" : "student",
        }),
      });
      const data = await res.json();
      setTrendsData(data);
    } catch (err) {
      console.error("Failed to fetch market trends:", err);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  useEffect(() => {
    if (activeTab === "trends" && !trendsData) {
      fetchMarketTrends();
    }
  }, [activeTab, userRole]);

  const handleCustomDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainQuery.trim()) return;
    setTrendsDomain(customDomainQuery);
    fetchMarketTrends(customDomainQuery);
    setCustomDomainQuery("");
  };

  const handleOpenWorkspace = (bounty: BountyItem) => {
    setActiveBountyWorkspace(bounty);
    setBountyCode(bounty.starterCode);
    setBountyFeedback(null);
  };

  const handleSubmitBountySolution = async () => {
    if (!activeBountyWorkspace) return;
    setIsSubmittingBounty(true);

    try {
      const res = await fetch("/api/ai/grade-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeBountyWorkspace.title,
          difficulty: activeBountyWorkspace.difficulty,
          codingSubmission: bountyCode,
          codingProblem: {
            title: activeBountyWorkspace.title,
            problemStatement: activeBountyWorkspace.description,
          },
        }),
      });

      const data = await res.json();
      setBountyFeedback(data);

      if (data.compositeScore >= 70) {
        setBountyPoints((prev) => prev + activeBountyWorkspace.reward);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("Network error evaluating bounty solution.");
    } finally {
      setIsSubmittingBounty(false);
    }
  };

  const studentTabs = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "test", label: "Test", icon: Terminal },
    { id: "learn", label: "Learn Portal", icon: BookOpen },
    { id: "bounties", label: "Live Bounties", icon: Coins },
    { id: "jobs", label: "Jobs & Internships", icon: Briefcase },
    { id: "trends", label: "Market Trends", icon: TrendingUp },
    { id: "rankings", label: "Leaderboard", icon: Award },
  ];

  const industryTabs = [
    { id: "dashboard", label: "Recruiter Hub", icon: LayoutDashboard },
    { id: "postings", label: "Manage Jobs", icon: Briefcase },
    { id: "create-bounty", label: "Deploy Bounties", icon: Coins },
  ];

  const academicianTabs = [
    { id: "dashboard", label: "Faculty Dashboard", icon: LayoutDashboard },
    { id: "trends", label: "Market Trends", icon: TrendingUp },
    { id: "learn", label: "Course Modules", icon: BookOpen },
    { id: "planner", label: "Syllabus Architect", icon: Sparkles },
  ];

  const tabs = 
    userRole === "student" 
      ? studentTabs 
      : userRole === "industry" 
      ? industryTabs 
      : academicianTabs;

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
      sessionStorage.clear();
    }
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 dark:bg-[#0c1220]/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-30 transition-colors duration-200">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-mono font-black text-sm tracking-tight shadow-md shadow-blue-500/25 ring-1 ring-white/20">
              SB
            </div>
            <div>
              <span className="text-sm font-black tracking-tight block bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
                SkillBridge Pro
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">
                {userRole} Portal
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon size={16} className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition duration-150 cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Surface Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-3.5 flex items-center justify-between gap-4 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black capitalize tracking-tight text-slate-800 dark:text-slate-100">
              {userRole} Workspace
            </h2>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
              v2.6 Prod
            </span>
          </div>

          <div className="flex items-center gap-3">
            {headerMeta}

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Night Mode"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs active:scale-95"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            <button 
              type="button"
              onClick={onRoleClick}
              title="Click to edit profile details"
              aria-label="Edit profile details"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/80 transition cursor-pointer active:scale-98"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                {userName ? userName.charAt(0) : "U"}
              </div>
              <span className="text-xs font-semibold truncate max-w-[130px] text-slate-700 dark:text-slate-200">
                {userName || "User"}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto min-w-0">
          {activeTab === "bounties" ? (
            <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold uppercase tracking-wider">
                      Verified Engineering Bounties
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Live Production Bounties
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Solve real distributed systems bugs and algorithmic tasks to earn bounty points and fast-track interviews.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center min-w-[130px]">
                  <span className="text-[10px] text-slate-400 font-mono block">Your Balance</span>
                  <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                    {bountyPoints} Pts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {defaultBounties.map((bounty) => (
                  <div
                    key={bounty.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition duration-150"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                          {bounty.difficulty}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          +{bounty.reward} Pts
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {bounty.title}
                        </h3>
                        <span className="text-xs text-slate-400 font-mono block mt-0.5">
                          {bounty.company}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {bounty.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {bounty.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenWorkspace(bounty)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {activeBountyWorkspace && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
                  <div className="bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold uppercase">
                            Active Bounty Workspace
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-600">
                            +{activeBountyWorkspace.reward} Pts
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {activeBountyWorkspace.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveBountyWorkspace(null)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        <strong>Engineering Specification:</strong> {activeBountyWorkspace.description}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Terminal size={14} /> Solution Implementation
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">TypeScript / Node.js Engine</span>
                        </div>
                        <textarea
                          value={bountyCode}
                          onChange={(e) => setBountyCode(e.target.value)}
                          rows={12}
                          spellCheck={false}
                          className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed resize-y"
                        />
                      </div>

                      {bountyFeedback && (
                        <div className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Automated Verification Score:{" "}
                              <span className="font-mono text-blue-600 font-extrabold text-sm">
                                {bountyFeedback.compositeScore}%
                              </span>
                            </span>
                            {bountyFeedback.compositeScore >= 70 ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <Check size={14} /> Solution Verified & Bounty Awarded!
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                                <X size={14} /> Below 70% Threshold - Check Invariants
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {bountyFeedback.codeAnalysis?.feedback || bountyFeedback.performanceVerdict}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Scored automatically via AI code analysis suite
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveBountyWorkspace(null)}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingBounty}
                          onClick={handleSubmitBountySolution}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          {isSubmittingBounty ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          <span>{isSubmittingBounty ? "Running Tests..." : "Run Tests & Submit"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "trends" ? (
            <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
              <div className="bg-white/80 dark:bg-[#0e1726]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
                      <TrendingUp size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Real-Time Market & Curriculum Telemetry</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase font-semibold">
                          {userRole === "academician" ? "Academician View" : "Student Career Radar"}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {userRole === "academician"
                          ? "AI-synthesized gap analysis comparing university syllabi against live production hiring mandates."
                          : "Live hiring velocity, compensation premiums, and instant learning pathway generators."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoadingTrends}
                    onClick={() => fetchMarketTrends()}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center gap-1.5 self-start cursor-pointer"
                  >
                    <RefreshCw size={13} className={isLoadingTrends ? "animate-spin" : ""} />
                    <span>Refresh Signals</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {defaultDomains.map((dom) => (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => {
                        setTrendsDomain(dom);
                        fetchMarketTrends(dom);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                        trendsDomain === dom
                          ? "bg-blue-600 text-white font-semibold shadow-xs"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {dom}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCustomDomainSubmit} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customDomainQuery}
                    onChange={(e) => setCustomDomainQuery(e.target.value)}
                    placeholder="Search custom domain (e.g. LLM Inference, Firmware Engineering, Web3 Security)..."
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    type="submit"
                    disabled={isLoadingTrends}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Analyze</span>
                  </button>
                </form>
              </div>

              {isLoadingTrends && (
                <div className="p-12 text-center bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Loader2 size={32} className="animate-spin text-blue-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Synthesizing live internet telemetry for {trendsDomain}...
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Querying hiring velocity, public job requisitions, and curriculum delta
                  </p>
                </div>
              )}

              {trendsData && !isLoadingTrends && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                          Live Telemetry
                        </span>
                        {trendsData.livePostingsSampled !== undefined && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                            {trendsData.livePostingsSampled} Live Postings Indexed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {trendsData.domain}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {trendsData.summary}
                      </p>

                      {trendsData.realKeywordsFound?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-2">
                          <span className="text-[11px] font-mono text-slate-400">Live Tags:</span>
                          {trendsData.realKeywordsFound.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center min-w-[140px] shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono block">Dynamic Demand Score</span>
                      <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {trendsData.marketHealthScore}/100
                      </span>
                      <span className="text-[10px] text-emerald-500 font-semibold block mt-0.5">Calculated from Live Feeds</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Flame size={16} className="text-amber-500" />
                      <span>Emerging Technologies & Breakthrough Skills</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trendsData.emergingTrends?.map((t: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t.trendName}</h5>
                            <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                              {t.velocity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {t.relevance}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {userRole === "academician" && trendsData.curriculumSkillGaps && (
                    <div className="bg-white dark:bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={18} className="text-blue-600" />
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            Curriculum Modernization & Obsolete Module Radar
                          </h4>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">Academic Gap Audit</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {trendsData.curriculumSkillGaps.map((gap: any, i: number) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold line-through">
                                Legacy: {gap.legacyTopic}
                              </span>
                              <ArrowRight size={14} className="text-slate-400 shrink-0" />
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                                Modern: {gap.replacementModernTopic}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                                Urgency: {gap.urgency}
                              </span>
                              <button
                                type="button"
                                onClick={() => onTabChange("planner")}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <span>Adopt into Syllabus</span>
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {trendsData.accreditationRecommendations && (
                        <div className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2 mt-4">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                            <CheckCircle size={15} /> Accreditation Board Recommendations
                          </h5>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {trendsData.accreditationRecommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {userRole !== "academician" && trendsData.studentActionableSkills && (
                    <>
                      <div className="bg-white dark:bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <Briefcase size={18} className="text-blue-600" />
                            <h4 className="font-bold text-base text-slate-900 dark:text-white">
                              High-ROI Hiring Competencies in {trendsData.domain}
                            </h4>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">Salary Velocity</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {trendsData.studentActionableSkills.map((skill: any, i: number) => (
                            <div
                              key={i}
                              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between space-y-3"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">{skill.skill}</h5>
                                  <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                                    {skill.estimatedSalaryBoost}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {skill.recommendedFocus}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                                  Level: {skill.difficulty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onTabChange("learn")}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                                >
                                  <span>Learn in Portal</span>
                                  <ArrowRight size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {trendsData.recommendedEntryPath && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Compass size={15} className="text-blue-600" /> Recommended Portfolio Milestones
                          </h5>
                          <div className="space-y-2 pt-1">
                            {trendsData.recommendedEntryPath.map((step: string, i: number) => (
                              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}