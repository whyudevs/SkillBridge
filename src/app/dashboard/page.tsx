"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout, { calculateTier, StudentTier } from "@/components/DashboardLayout";
import StudentOverview from "@/components/StudentOverview";
import { ProctoringSimulator } from "@/components/ProctoringSimulator";
import LearnPortal from "@/components/LearnPortal";
import { 
  getStudentData, 
  saveStudentData, 
  scheduleInterview,
  type StudentProfileData,
  type ApplicationItem 
} from "@/lib/studentDataStore";
import { 
  Award, 
  Coins, 
  Video, 
  X, 
  User, 
  CheckCircle2, 
  Medal, 
  Sparkles, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  GraduationCap, 
  ExternalLink,
  Code,
  ChevronLeft,
  ChevronRight,
  Plus,
  Briefcase,
  Building2,
  BookOpen,
  Terminal
} from "lucide-react";

export interface JobRequisition {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-Time" | "Internship";
  stipend: string;
  matchScore: number;
  skills: string[];
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<"student" | "industry" | "academician">("student");
  const [userName, setUserName] = useState<string>("Alex Vance");
  const [userEmail, setUserEmail] = useState<string>("alex.vance@mit.edu");
  const [userBio, setUserBio] = useState<string>("Distributed Systems & Systems Engineering Specialist");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Recruiter Company Context
  const [recruiterCompany, setRecruiterCompany] = useState<string>("Nexus Dynamics");

  // Recruiter Postings State
  const [postedJobs, setPostedJobs] = useState<JobRequisition[]>([
    {
      id: "job-recruiter-1",
      title: "Core Infrastructure Distributed Systems Engineer",
      company: "Nexus Dynamics",
      location: "Remote / Bengaluru",
      type: "Full-Time",
      stipend: "$145,000 / yr",
      matchScore: 94,
      skills: ["Rust", "Raft", "Distributed Systems", "Linux Kernels"]
    },
    {
      id: "job-recruiter-2",
      title: "Backend Storage Systems Intern",
      company: "Nexus Dynamics",
      location: "Hybrid / Pune",
      type: "Internship",
      stipend: "$6,500 / mo",
      matchScore: 88,
      skills: ["Go", "PostgreSQL", "gRPC", "Docker"]
    }
  ]);

  // Modal to deploy a new job posting
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newLocation, setNewLocation] = useState<string>("Remote");
  const [newType, setNewType] = useState<"Full-Time" | "Internship">("Full-Time");
  const [newStipend, setNewStipend] = useState<string>("$130,000 / yr");
  const [newSkills, setNewSkills] = useState<string>("Go, Kubernetes, Redis");

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [tempBio, setTempBio] = useState<string>("");

  // Recruiter Candidate Details Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<ApplicationItem | null>(null);

  // Header Hover Cards State (Student Only)
  const [isTierHovered, setIsTierHovered] = useState<boolean>(false);
  const [isPointsHovered, setIsPointsHovered] = useState<boolean>(false);

  // Student telemetry
  const [claimedMcq, setClaimedMcq] = useState<string[]>([]);
  const [bountyBalance, setBountyBalance] = useState<number>(340);
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);

  // Industry recruitment scheduling state
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [meetDate, setMeetDate] = useState<string>("");
  const [meetTime, setMeetTime] = useState<string>("");
  const [meetUrl, setMeetUrl] = useState<string>("");

  // Date & Time Validation Helpers
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isClockOpen, setIsClockOpen] = useState<boolean>(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));

  const [selectedHour, setSelectedHour] = useState<string>("04");
  const [selectedMinute, setSelectedMinute] = useState<string>("30");
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("PM");

  const calendarRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (clockRef.current && !clockRef.current.contains(event.target as Node)) {
        setIsClockOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDateBeforeToday = (year: number, month: number, day: number) => {
    const target = new Date(year, month, day).getTime();
    return target < todayStart;
  };

  const isPastMonth = 
    calendarMonth.getFullYear() < now.getFullYear() ||
    (calendarMonth.getFullYear() === now.getFullYear() && calendarMonth.getMonth() <= now.getMonth());

  const isDateToday = (dateStr: string) => {
    if (!dateStr) return false;
    const selected = new Date(dateStr);
    return (
      selected.getFullYear() === now.getFullYear() &&
      selected.getMonth() === now.getMonth() &&
      selected.getDate() === now.getDate()
    );
  };

  const get24Hour = (hour12: number, period: "AM" | "PM") => {
    if (period === "AM") return hour12 === 12 ? 0 : hour12;
    return hour12 === 12 ? 12 : hour12 + 12;
  };

  const tierHierarchy: {
    tier: StudentTier;
    ptsRequirement: string;
    scoreRequirement: string;
    colorClass: string;
    badgeBg: string;
    borderClass: string;
  }[] = [
    {
      tier: "Diamond",
      ptsRequirement: "1200+ Pts",
      scoreRequirement: "≥ 95% Avg",
      colorClass: "text-cyan-400",
      badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
      borderClass: "border-cyan-500/30",
    },
    {
      tier: "Platinum",
      ptsRequirement: "800 - 1199 Pts",
      scoreRequirement: "≥ 85% Avg",
      colorClass: "text-indigo-400",
      badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
      borderClass: "border-indigo-500/30",
    },
    {
      tier: "Gold",
      ptsRequirement: "500 - 799 Pts",
      scoreRequirement: "≥ 75% Avg",
      colorClass: "text-amber-400",
      badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
      borderClass: "border-amber-500/30",
    },
    {
      tier: "Silver",
      ptsRequirement: "250 - 499 Pts",
      scoreRequirement: "≥ 60% Avg",
      colorClass: "text-slate-400",
      badgeBg: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
      borderClass: "border-slate-500/30",
    },
    {
      tier: "Bronze",
      ptsRequirement: "< 250 Pts",
      scoreRequirement: "< 60% Avg",
      colorClass: "text-amber-700",
      badgeBg: "bg-amber-900/10 text-amber-800 dark:text-amber-600",
      borderClass: "border-amber-700/30",
    },
  ];

  useEffect(() => {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const queryRole = params?.get("role");
    
    const storedRole = 
      queryRole || 
      localStorage.getItem("userRole") || 
      localStorage.getItem("sb_user_role") || 
      sessionStorage.getItem("userRole");

    if (storedRole) {
      const normalized = storedRole.toLowerCase().trim();
      if (normalized === "industry" || normalized === "recruiter") {
        setUserRole("industry");
        setUserName((prev) => (prev === "Alex Vance" ? "Sarah Jenkins (Recruiter)" : prev));
        setRecruiterCompany("Nexus Dynamics");
      } else if (normalized === "academician" || normalized === "faculty") {
        setUserRole("academician");
        setUserName((prev) => (prev === "Alex Vance" ? "Prof. Radhika" : prev));
      } else {
        setUserRole("student");
      }
    }

    const data = getStudentData();
    setStudentData(data);
    setBountyBalance(data.bountyPoints);

    const savedName = localStorage.getItem("sb_user_name");
    if (savedName) setUserName(savedName);

    const savedEmail = localStorage.getItem("sb_user_email");
    if (savedEmail) setUserEmail(savedEmail);

    const savedBio = localStorage.getItem("sb_user_bio");
    if (savedBio) setUserBio(savedBio);

    const savedCustomJobs = localStorage.getItem("sb_recruiter_custom_jobs");
    if (savedCustomJobs) {
      try {
        setPostedJobs(JSON.parse(savedCustomJobs));
      } catch {
        // Fallback to initial defaults
      }
    }

    const handleTelemetryUpdate = () => {
      const updated = getStudentData();
      setStudentData(updated);
      setBountyBalance(updated.bountyPoints);
    };

    window.addEventListener("student_telemetry_updated", handleTelemetryUpdate);
    return () => window.removeEventListener("student_telemetry_updated", handleTelemetryUpdate);
  }, []);

  const currentTier = calculateTier(bountyBalance, studentData?.averageScore || 84);

  const handleOpenEditProfile = () => {
    setTempName(userName);
    setTempEmail(userEmail);
    setTempBio(userBio);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return alert("Name cannot be empty");

    setUserName(tempName);
    setUserEmail(tempEmail);
    setUserBio(tempBio);

    localStorage.setItem("sb_user_name", tempName);
    localStorage.setItem("sb_user_email", tempEmail);
    localStorage.setItem("sb_user_bio", tempBio);

    setIsEditProfileOpen(false);
  };

  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !meetDate || !meetTime || !meetUrl) {
      return alert("Please select a candidate, date from the calendar, time from the clock, and provide a Google Meet link.");
    }

    scheduleInterview(selectedAppId, meetDate, meetTime, meetUrl);
    alert("Interview scheduled successfully! Meeting link dispatched to student overview.");
    setSelectedAppId("");
    setMeetDate("");
    setMeetTime("");
    setMeetUrl("");
  };

  const handleCreateNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("Job title is required.");

    const newJob: JobRequisition = {
      id: "job-recruiter-" + Date.now(),
      title: newTitle,
      company: recruiterCompany,
      location: newLocation,
      type: newType,
      stipend: newStipend,
      matchScore: 90,
      skills: newSkills.split(",").map((s) => s.trim()).filter(Boolean)
    };

    const updated = [newJob, ...postedJobs];
    setPostedJobs(updated);
    localStorage.setItem("sb_recruiter_custom_jobs", JSON.stringify(updated));

    setIsNewJobModalOpen(false);
    setNewTitle("");
    setNewLocation("Remote");
    setNewStipend("$130,000 / yr");
    setNewSkills("Go, Kubernetes, Redis");
  };

  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();

  const handleSelectCalendarDay = (day: number) => {
    if (isDateBeforeToday(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)) return;
    const selected = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const formatted = selected.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    setMeetDate(formatted);
    setIsCalendarOpen(false);
  };

  const handleApplyClockTime = () => {
    if (isDateToday(meetDate)) {
      const h24 = get24Hour(parseInt(selectedHour, 10), selectedPeriod);
      const min = parseInt(selectedMinute, 10);
      if (h24 < now.getHours() || (h24 === now.getHours() && min <= now.getMinutes())) {
        return alert("The selected time has already passed today. Please pick an upcoming time.");
      }
    }

    const formatted = `${selectedHour}:${selectedMinute} ${selectedPeriod} IST`;
    setMeetTime(formatted);
    setIsClockOpen(false);
  };

  const ecosystemJobs: JobRequisition[] = [
    {
      id: "job-1",
      title: "Distributed Systems Software Engineer",
      company: "Cloudflare",
      location: "Remote / Bengaluru",
      type: "Full-Time",
      stipend: "$140,000 / yr",
      matchScore: 94,
      skills: ["Rust", "Raft", "Distributed Systems", "Linux Kernels"]
    },
    {
      id: "job-2",
      title: "Backend Core Infrastructure Intern",
      company: "Stripe",
      location: "Hybrid / Dublin",
      type: "Internship",
      stipend: "$8,000 / mo",
      matchScore: 89,
      skills: ["Go", "PostgreSQL", "gRPC", "Docker"]
    },
    ...postedJobs
  ];

  const availableJobs = ecosystemJobs.filter((job) => {
    const isApplied = (studentData?.applications || []).some(
      (app) => app.company.toLowerCase() === job.company.toLowerCase() && 
               app.role.toLowerCase() === job.title.toLowerCase()
    );
    return !isApplied;
  });

  return (
    <>
      <DashboardLayout
        userRole={userRole}
        userName={userName}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onRoleClick={handleOpenEditProfile}
        headerMeta={
          <div className="flex items-center gap-2">
            {/* STUDENT ROLE: TIER & BOUNTY POINTS BADGES */}
            {userRole === "student" && (
              <>
                <div 
                  className="relative inline-block"
                  onMouseEnter={() => setIsTierHovered(true)}
                  onMouseLeave={() => setIsTierHovered(false)}
                >
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-bold text-xs border cursor-help transition active:scale-95 ${currentTier.badgeBg} ${currentTier.borderClass}`}
                  >
                    <Medal size={13} className={currentTier.colorClass} />
                    <span>{currentTier.tier} Tier</span>
                  </button>

                  {isTierHovered && (
                    <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-80 z-50 p-4 rounded-3xl bg-white/95 dark:bg-[#0c1220]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150 pointer-events-none text-left">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck size={16} className={currentTier.colorClass} />
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                              Platform Tier Thresholds
                            </h5>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Based on Points & Exam Accuracy
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${currentTier.badgeBg} ${currentTier.borderClass}`}>
                          Active: {currentTier.tier}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {tierHierarchy.map((lvl) => {
                          const isUserTier = currentTier.tier === lvl.tier;
                          return (
                            <div
                              key={lvl.tier}
                              className={`p-2 rounded-xl flex items-center justify-between text-xs border transition ${
                                isUserTier
                                  ? "bg-blue-500/10 border-blue-500/40 font-bold shadow-xs"
                                  : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Medal size={13} className={lvl.colorClass} />
                                <span className="font-semibold text-slate-900 dark:text-white text-[11px]">
                                  {lvl.tier}
                                </span>
                                {isUserTier && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">
                                    You
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                <span>{lvl.ptsRequirement}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span>{lvl.scoreRequirement}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500 dark:text-slate-400">Your Current Metrics:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {bountyBalance} Pts ({studentData?.averageScore || 0}% Avg)
                          </span>
                        </div>

                        {currentTier.pointsNeeded > 0 ? (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                            Need <strong>{currentTier.pointsNeeded} more points</strong> to reach <strong>{currentTier.nextTier}</strong> tier.
                          </p>
                        ) : (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            Maximum Tier Achieved! Verified top 5% rank.
                          </p>
                        )}
                      </div>

                      <div className="absolute right-6 sm:left-1/2 sm:-translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-white dark:border-b-[#0c1220]" />
                    </div>
                  )}
                </div>

                <div 
                  className="relative inline-block"
                  onMouseEnter={() => setIsPointsHovered(true)}
                  onMouseLeave={() => setIsPointsHovered(false)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs border border-amber-500/20 cursor-help transition active:scale-95"
                  >
                    <Coins size={13} />
                    <span>{bountyBalance} Pts</span>
                  </button>

                  {isPointsHovered && (
                    <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-72 z-50 p-4 rounded-3xl bg-white/95 dark:bg-[#0c1220]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 pointer-events-none text-left">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                            <Coins size={16} />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white">Bounty Points Ledger</h5>
                            <span className="text-[10px] text-slate-400 font-mono">Skill Currency Breakdown</span>
                          </div>
                        </div>
                        <span className="text-sm font-mono font-black text-amber-600 dark:text-amber-400">
                          {bountyBalance}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Diagnostic Tests:</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            +{(studentData?.testHistory || []).reduce((acc, t) => acc + (t.pointsEarned || t.score), 0)} Pts
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Course Completions:</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            +{(studentData?.modulesCompleted || 0) * 50} Pts
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Production Bounties:</span>
                          <span className="font-mono font-bold text-amber-500">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-[10px] font-mono text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles size={12} className="shrink-0" />
                        <span>Top 8% candidate percentile on recruiter radar</span>
                      </div>

                      <div className="absolute right-6 sm:left-1/2 sm:-translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-white dark:border-b-[#0c1220]" />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* INDUSTRY ROLE: COMPANY & IDENTITY META */}
            {userRole === "industry" && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs border border-indigo-500/20">
                  <Building2 size={13} /> {recruiterCompany}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                  Verified Employer
                </span>
              </div>
            )}

            {/* ACADEMICIAN ROLE: FACULTY & INSTITUTION META */}
            {userRole === "academician" && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs border border-blue-500/20">
                  <GraduationCap size={13} /> IIT Madras Faculty
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                  Curriculum Board
                </span>
              </div>
            )}
          </div>
        }
      >
        {/* ========================================================================= */}
        {/* STUDENT PORTAL TABS                                                       */}
        {/* ========================================================================= */}
        {userRole === "student" && (
          <>
            {activeTab === "dashboard" && (
              <StudentOverview onNavigateTab={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === "test" && (
              <ProctoringSimulator
                onBountyAwarded={(pts, topic) => {
                  const current = getStudentData();
                  setBountyBalance(current.bountyPoints);
                }}
              />
            )}

            {activeTab === "learn" && <LearnPortal />}

            {/* TAB: JOBS & INTERNSHIPS */}
            {activeTab === "jobs" && (
              <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold uppercase tracking-wider">
                      Verified Opportunities
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      Jobs & Engineering Internships
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Roles matched to your diagnostic assessment percentiles and verified bounty completions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("dashboard")}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    View Active Pipeline ({studentData?.applications?.length || 0})
                  </button>
                </div>

                {availableJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {availableJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/50 transition"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                              {job.company}
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs text-slate-500">{job.location}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {job.type}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                              {job.stipend}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {job.matchScore}% Skill Alignment
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const data = getStudentData();
                              data.applications.unshift({
                                id: "app-" + Date.now(),
                                candidateName: userName,
                                candidateEmail: userEmail,
                                company: job.company,
                                role: job.title,
                                type: job.type.includes("Intern") ? "Internship" : "Job",
                                appliedDate: "Just now",
                                status: "Applied",
                                matchScore: job.matchScore,
                                tier: currentTier.tier,
                                skills: job.skills,
                                education: "B.S. Computer Science & Systems Engineering",
                              });
                              saveStudentData(data);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">All Active Roles Applied</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      You have submitted applications for all currently indexed openings. Track status and Google Meet links on your Overview tab.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("dashboard")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                    >
                      Go to Application Pipeline
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: LEADERBOARD */}
            {activeTab === "rankings" && (
              <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Award className="text-amber-500" size={24} />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Global Talent Leaderboard</h2>
                      <p className="text-xs text-slate-500">Tier standings classified across Diamond, Platinum, Gold, Silver & Bronze.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tierHierarchy.map((t) => (
                      <span key={t.tier} className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${t.badgeBg} ${t.borderClass}`}>
                        {t.tier}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 space-y-3">
                  {[
                    { rank: 1, name: "Elena Rostova", score: 98, pts: 1420, spec: "Distributed Consensus" },
                    { rank: 2, name: `${userName} (You)`, score: studentData?.averageScore || 92, pts: bountyBalance, spec: "Systems & Edge" },
                    { rank: 3, name: "Devon Marcus", score: 89, pts: 980, spec: "Cloud Native" },
                    { rank: 4, name: "Priya Sharma", score: 88, pts: 910, spec: "Inference Kernels" },
                    { rank: 5, name: "Lucas Vance", score: 82, pts: 640, spec: "Postgres Storage Engines" },
                    { rank: 6, name: "Sophia Chen", score: 76, pts: 430, spec: "Next.js Edge Microservices" },
                    { rank: 7, name: "Arjun Verma", score: 68, pts: 210, spec: "Kafka Stream Pipelines" },
                  ].map((row) => {
                    const rowTier = calculateTier(row.pts, row.score);
                    const isCurrentUser = row.name.includes("You");

                    return (
                      <div
                        key={row.rank}
                        className={`p-4 rounded-2xl flex items-center justify-between text-xs border transition ${
                          isCurrentUser
                            ? "bg-blue-500/10 border-blue-500/40 text-blue-900 dark:text-blue-100 font-bold shadow-xs"
                            : "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-[11px]">
                            #{row.rank}
                          </span>
                          
                          <span className="font-semibold">{row.name}</span>

                          <span className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {row.spec}
                          </span>

                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${rowTier.badgeBg} ${rowTier.borderClass}`}
                          >
                            {rowTier.tier}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 font-mono">
                          <span>{row.score}% Avg</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">{row.pts} Pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* INDUSTRY / RECRUITER PORTAL TABS (NO STUDENT TIERS OR POINTS)             */}
        {/* ========================================================================= */}
        {userRole === "industry" && (
          <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
            {/* TAB: RECRUITER HUB (dashboard) */}
            {activeTab === "dashboard" && (
              <>
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 font-bold uppercase tracking-wider">
                      Recruiter Command Hub
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      Candidate Submissions & Interview Scheduler
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select upcoming dates and times to publish real-time interview links to candidates.
                    </p>
                  </div>
                </div>

                {/* Candidate Applications Roster */}
                <div className="bg-white dark:bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase size={16} className="text-indigo-500" />
                      <span>Received Job & Internship Applications ({studentData?.applications?.length || 0})</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">Click card to open candidate dossier</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {(studentData?.applications || []).map((app) => {
                      const studentDisplayName = app.candidateName || (app.role.includes("Edge") ? "Alex Vance" : "Elena Rostova");
                      const match = app.matchScore || 92;

                      return (
                        <div
                          key={app.id}
                          onClick={() => setSelectedCandidate(app)}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-blue-500/60 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                {studentDisplayName}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {app.type}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                                {match}% Skill Match
                              </span>
                            </div>

                            <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                              <span>Applied for: <strong>{app.role}</strong></span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-400 font-mono text-[11px]">Applied {app.appliedDate}</span>
                            </div>
                          </div>

                          <div 
                            className="flex items-center gap-2 shrink-0" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            {app.meetLink ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                                  <Video size={13} /> {app.interviewDate || "Scheduled"}
                                </span>
                                <a
                                  href={app.meetLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                                >
                                  <span>Join</span>
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppId(app.id);
                                  const formElement = document.getElementById("schedule-interview-form");
                                  formElement?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <Video size={13} />
                                <span>Schedule Meeting</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SCHEDULE LIVE INTERVIEW FORM */}
                <div id="schedule-interview-form" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <Video size={16} className="text-emerald-500" />
                    <span>Schedule Live Interview (Google Meet)</span>
                  </h3>

                  <form onSubmit={handleScheduleInterviewSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Target Applicant / Role</label>
                      <select
                        value={selectedAppId}
                        onChange={(e) => setSelectedAppId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="">Select Candidate Application...</option>
                        {(studentData?.applications || []).map((app) => (
                          <option key={app.id} value={app.id}>
                            {app.candidateName || "Candidate"} — {app.role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative" ref={calendarRef}>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Select Interview Date</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCalendarOpen(!isCalendarOpen);
                          setIsClockOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-between outline-none focus:ring-2 focus:ring-blue-500 text-left cursor-pointer"
                      >
                        <span className={meetDate ? "font-semibold text-slate-900 dark:text-white" : "text-slate-400"}>
                          {meetDate || "Pick upcoming date..."}
                        </span>
                        <CalendarIcon size={14} className="text-blue-500 shrink-0" />
                      </button>

                      {isCalendarOpen && (
                        <div className="absolute left-0 top-full mt-2 z-50 p-4 w-72 rounded-3xl bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                              {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={isPastMonth}
                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                                className={`p-1 rounded-lg transition ${
                                  isPastMonth
                                    ? "opacity-25 cursor-not-allowed text-slate-400"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                }`}
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-7 gap-1 pt-3 text-center text-[10px] font-mono text-slate-400 font-semibold mb-1">
                            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {Array.from({ length: firstDayIndex }).map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, idx) => {
                              const day = idx + 1;
                              const isPast = isDateBeforeToday(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                              const targetDateFormatted = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              });
                              const isSelected = meetDate === targetDateFormatted;

                              return (
                                <button
                                  key={day}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => handleSelectCalendarDay(day)}
                                  className={`p-1.5 rounded-xl font-mono text-xs transition ${
                                    isPast
                                      ? "text-slate-300 dark:text-slate-700 opacity-25 cursor-not-allowed line-through pointer-events-none"
                                      : isSelected
                                      ? "bg-blue-600 text-white font-bold shadow-xs cursor-pointer"
                                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative" ref={clockRef}>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Select Interview Time</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsClockOpen(!isClockOpen);
                          setIsCalendarOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-between outline-none focus:ring-2 focus:ring-blue-500 text-left cursor-pointer"
                      >
                        <span className={meetTime ? "font-semibold text-slate-900 dark:text-white" : "text-slate-400"}>
                          {meetTime || "Pick upcoming time..."}
                        </span>
                        <ClockIcon size={14} className="text-emerald-500 shrink-0" />
                      </button>

                      {isClockOpen && (
                        <div className="absolute left-0 top-full mt-2 z-50 p-4 w-64 rounded-3xl bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                              <ClockIcon size={13} className="text-emerald-500" /> Choose Time
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">IST Zone</span>
                          </div>

                          <div className="flex items-center justify-center gap-2 pt-1 font-mono">
                            <select
                              value={selectedHour}
                              onChange={(e) => setSelectedHour(e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold outline-none cursor-pointer"
                            >
                              {["01","02","03","04","05","06","07","08","09","10","11","12"].map((h) => (
                                <option key={h} value={h}>{h}</option>
                              ))}
                            </select>

                            <span className="font-bold text-slate-400">:</span>

                            <select
                              value={selectedMinute}
                              onChange={(e) => setSelectedMinute(e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold outline-none cursor-pointer"
                            >
                              {["00","15","30","45"].map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>

                            <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              {(["AM", "PM"] as const).map((period) => (
                                <button
                                  key={period}
                                  type="button"
                                  onClick={() => setSelectedPeriod(period)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                    selectedPeriod === period 
                                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs" 
                                      : "text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  {period}
                                </button>
                              ))}
                            </div>
                          </div>

                          {isDateToday(meetDate) && (() => {
                            const h24 = get24Hour(parseInt(selectedHour, 10), selectedPeriod);
                            const min = parseInt(selectedMinute, 10);
                            const isPast = h24 < now.getHours() || (h24 === now.getHours() && min <= now.getMinutes());
                            return isPast ? (
                              <p className="text-[10px] text-rose-500 font-mono text-center">
                                ⚠ Time has already passed today
                              </p>
                            ) : null;
                          })()}

                          <button
                            type="button"
                            onClick={handleApplyClockTime}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
                          >
                            Set Time
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Google Meet URL</label>
                      <input
                        type="url"
                        placeholder="https://meet.google.com/xyz-abcd-efg"
                        value={meetUrl}
                        onChange={(e) => setMeetUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video size={14} />
                        <span>Publish Google Meet Link to Candidate</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* TAB: MANAGE POSTINGS */}
            {activeTab === "postings" && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold uppercase tracking-wider">
                      Company Job Portal
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {recruiterCompany} — Active Requisitions ({postedJobs.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Only jobs published by {recruiterCompany} are managed here and broadcast to student applicant pipelines.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNewJobModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Create Requisition</span>
                  </button>
                </div>

                {postedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {postedJobs.map((j) => (
                      <div
                        key={j.id}
                        className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                              {j.company}
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs text-slate-500">{j.location}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {j.type}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{j.title}</h4>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {j.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                              {j.stipend}
                            </span>
                            <span className="text-[10px] text-emerald-500 font-mono font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 size={11} /> Published & Live
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = postedJobs.filter((item) => item.id !== j.id);
                              setPostedJobs(updated);
                              localStorage.setItem("sb_recruiter_custom_jobs", JSON.stringify(updated));
                            }}
                            className="px-3 py-1.5 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            Unpublish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <Briefcase size={28} className="text-slate-400 mx-auto" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">No active jobs published</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click the "Create Requisition" button above to publish your first role to the platform.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: DEPLOY BOUNTIES */}
            {activeTab === "create-bounty" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Coins className="text-amber-500" size={18} />
                  <span>Deploy Engineering Code Bounty</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Publish a real-world coding task with automated unit tests for students to solve.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 font-mono">
                  Bounty deployment sandbox active. Automated test runner connected to <span className="text-blue-500">/api/ai/grade-submission</span>.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ACADEMICIAN / FACULTY HUB (NO STUDENT TIERS OR POINTS)                     */}
        {/* ========================================================================= */}
        {userRole === "academician" && (
          <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold uppercase tracking-wider">
                  Academic Leadership Portal
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Departmental Assessments & Curriculum Review
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor departmental test completions and benchmark syllabi against real-world production engineering requirements.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal size={16} className="text-blue-500" />
                <span>Student Departmental Diagnostic Test Submissions</span>
              </h3>
              <div className="space-y-2">
                {(studentData?.testHistory || []).map((th) => (
                  <div key={th.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{th.topic}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Completed: {th.date}</span>
                    </div>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{th.score}% Benchmark Score</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>

      {/* RECRUITER: CANDIDATE INFO DOSSIER MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {(selectedCandidate.candidateName || "Candidate").charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedCandidate.candidateName || "Candidate"}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedCandidate.candidateEmail || "applicant@university.edu"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Target Role</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedCandidate.role}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Track</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedCandidate.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Match Score</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {selectedCandidate.matchScore || 92}% Match
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Status</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">{selectedCandidate.status}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-blue-500" /> Academic Credentials
                </span>
                <p className="font-semibold text-slate-900 dark:text-white text-xs">
                  {selectedCandidate.education || "Undergraduate Computer Science & Engineering"}
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Verified coursework completed in Distributed Algorithms, Operating Systems, and Concurrent Data Structures.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  <Code size={14} className="text-indigo-500" /> Verified Core Stack & Frameworks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCandidate.skills || ["Go", "Distributed Systems", "PostgreSQL", "Docker"]).map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 font-mono text-[11px] font-semibold border border-blue-500/20"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 uppercase font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Proctoring Assessment Summary
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  Successfully completed comprehensive automated testing with zero proctoring boundary infractions. Demonstrated optimal runtime complexity and clean defensive error handling.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[11px] text-slate-400 font-mono">
                Applied on {selectedCandidate.appliedDate}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const appId = selectedCandidate.id;
                    setSelectedCandidate(null);
                    setSelectedAppId(appId);
                    const formElement = document.getElementById("schedule-interview-form");
                    formElement?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Video size={14} />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECRUITER: CREATE JOB REQUISITION MODAL */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Company Job Requisition</h3>
                  <p className="text-xs text-slate-500">Post new role under {recruiterCompany}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewJobModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewJob} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Job / Internship Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Runtime Infrastructure Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Position Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Remote / Bengaluru"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Stipend / Compensation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $135,000 / yr or $7,000 / mo"
                  value={newStipend}
                  onChange={(e) => setNewStipend(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Go, PostgreSQL, Raft, Docker"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Publish Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Profile Details</h3>
                  <p className="text-xs text-slate-500">Update your verified portfolio credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Alex Vance"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. alex.vance@mit.edu"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Headline / Domain Focus</label>
                <textarea
                  rows={3}
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                  placeholder="e.g. Distributed Systems & Systems Engineering Specialist"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}