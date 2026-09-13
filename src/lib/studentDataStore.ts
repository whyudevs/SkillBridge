export interface ApplicationItem {
  id: string;
  candidateName?: string;
  candidateEmail?: string;
  company: string;
  role: string;
  type: "Job" | "Internship" | "Full-Time";
  appliedDate: string;
  status: "Applied" | "Reviewing" | "Interview Scheduled" | "Offered" | "Rejected";
  matchScore?: number;
  tier?: string;
  skills?: string[];
  education?: string;
  interviewDate?: string;
  interviewTime?: string;
  meetLink?: string;
}

export interface TestHistoryItem {
  id: string;
  topic: string;
  score: number;
  date: string;
  pointsEarned: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  efficiencyRating: string;
  studyRecommendation: string;
}

export interface StudentProfileData {
  modulesCompleted: number;
  testsTaken: number;
  averageScore: number;
  bountyPoints: number;
  testHistory: TestHistoryItem[];
  applications: ApplicationItem[];
}

const DEFAULT_DATA: StudentProfileData = {
  modulesCompleted: 3,
  testsTaken: 2,
  averageScore: 84,
  bountyPoints: 340,
  testHistory: [
    {
      id: "th-1",
      topic: "Distributed Systems & Raft Consensus",
      score: 86,
      date: "Yesterday",
      pointsEarned: 86,
      verdict: "Strong comprehension of state machine replication and quorum elections.",
      strengths: ["Leader election timing heuristics", "Log compaction invariants"],
      weaknesses: ["Split-vote recovery under network partition"],
      efficiencyRating: "O(log N) heartbeat serialization",
      studyRecommendation: "The Raft Consensus Algorithm Extended Paper (Ongaro & Ousterhout)",
    },
    {
      id: "th-2",
      topic: "PostgreSQL Indexing & Buffer Pool",
      score: 82,
      date: "3 days ago",
      pointsEarned: 82,
      verdict: "Demonstrated accurate query plan inspection and B-Tree traversal mechanics.",
      strengths: ["Index-Only Scan execution paths", "Write-Ahead Log flushing semantics"],
      weaknesses: ["Buffer cache replacement eviction policies under memory pressure"],
      efficiencyRating: "O(1) buffer pool hash table lookup",
      studyRecommendation: "PostgreSQL Internals through Pictures: Buffer Pool Architecture",
    },
  ],
  applications: [
    {
      id: "app-1",
      candidateName: "Elena Rostova",
      candidateEmail: "elena.r@berkeley.edu",
      company: "Stripe",
      role: "Backend Core Infrastructure Intern",
      type: "Internship",
      appliedDate: "May 10, 2026",
      status: "Interview Scheduled",
      matchScore: 96,
      tier: "Diamond",
      skills: ["Go", "PostgreSQL", "gRPC", "Docker"],
      education: "UC Berkeley — B.S. Computer Science (Grad 2027)",
      interviewDate: "May 22, 2026",
      interviewTime: "04:30 PM IST",
      meetLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "app-2",
      candidateName: "Alex Vance",
      candidateEmail: "alex.vance@mit.edu",
      company: "Vercel",
      role: "Edge Runtime Systems Engineer",
      type: "Job",
      appliedDate: "May 12, 2026",
      status: "Reviewing",
      matchScore: 92,
      tier: "Platinum",
      skills: ["TypeScript", "Next.js", "Node.js", "V8 Engine"],
      education: "MIT — B.S. EECS (Grad 2026)",
    },
    {
      id: "app-3",
      candidateName: "Devon Marcus",
      candidateEmail: "devon.m@cmu.edu",
      company: "Cloudflare",
      role: "Distributed Systems Software Engineer",
      type: "Job",
      appliedDate: "May 14, 2026",
      status: "Applied",
      matchScore: 89,
      tier: "Platinum",
      skills: ["Rust", "Raft", "Distributed Systems", "Linux Kernels"],
      education: "Carnegie Mellon University — M.S. Software Engineering",
    },
  ],
};

const STORAGE_KEY = "sb_student_telemetry";

export function getStudentData(): StudentProfileData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveStudentData(data: StudentProfileData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("student_telemetry_updated"));
}

export function recordTestResult(
  topic: string, 
  score: number, 
  pointsEarned: number,
  details?: {
    verdict?: string;
    strengths?: string[];
    weaknesses?: string[];
    efficiencyRating?: string;
    studyRecommendation?: string;
  }
) {
  const current = getStudentData();
  const totalScoreBefore = current.averageScore * current.testsTaken;
  const newTestsTaken = current.testsTaken + 1;
  const newAverage = Math.round((totalScoreBefore + score) / newTestsTaken);

  current.testsTaken = newTestsTaken;
  current.averageScore = newAverage;
  current.bountyPoints += pointsEarned;
  current.testHistory.unshift({
    id: "th-" + Date.now(),
    topic,
    score,
    date: "Just now",
    pointsEarned,
    verdict: details?.verdict || `Assessment evaluated with verified score of ${score}%.`,
    strengths: details?.strengths || [`Solid fundamentals in ${topic}`],
    weaknesses: details?.weaknesses || ["Review boundary conditions and runtime limits"],
    efficiencyRating: details?.efficiencyRating || "Standard Production Efficiency",
    studyRecommendation: details?.studyRecommendation || `${topic} Technical Whitepaper`,
  });

  saveStudentData(current);
}

export function recordModuleCompletion() {
  const current = getStudentData();
  current.modulesCompleted += 1;
  current.bountyPoints += 50;
  saveStudentData(current);
}

export function removeApplication(appId: string) {
  const current = getStudentData();
  current.applications = current.applications.filter((a) => a.id !== appId);
  saveStudentData(current);
}

export function scheduleInterview(appId: string, date: string, time: string, meetLink: string) {
  const current = getStudentData();
  const app = current.applications.find((a) => a.id === appId);
  if (app) {
    app.status = "Interview Scheduled";
    app.interviewDate = date;
    app.interviewTime = time;
    app.meetLink = meetLink;
    saveStudentData(current);
  }
}