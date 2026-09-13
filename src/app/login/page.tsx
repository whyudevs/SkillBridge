"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

type RoleType = "student" | "industry" | "academician";

interface RolePreset {
  id: RoleType;
  title: string;
  name: string;
  email: string;
  pass: string;
  redirectUrl: string;
}

const PRESETS: Record<RoleType, RolePreset> = {
  student: {
    id: "student",
    title: "Student",
    name: "Alex Vance",
    email: "alex.vance@mit.edu",
    pass: "studentpass123",
    redirectUrl: "/dashboard?role=student",
  },
  industry: {
    id: "industry",
    title: "Industry",
    name: "Sarah Jenkins (Recruiter)",
    email: "recruiter@nexusdynamics.io",
    pass: "industrypass99",
    redirectUrl: "/dashboard?role=industry",
  },
  academician: {
    id: "academician",
    title: "Academician",
    name: "Prof. Radhika",
    email: "prof.radhika@iitm.ac.in",
    pass: "facultysecure782",
    redirectUrl: "/dashboard?role=academician",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType>("student");
  const [email, setEmail] = useState<string>(PRESETS.student.email);
  const [password, setPassword] = useState<string>(PRESETS.student.pass);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    setEmail(PRESETS[role].email);
    setPassword(PRESETS[role].pass);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const preset = PRESETS[selectedRole];

    // Explicitly persist role & persona to all storage keys read by Dashboard
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem("sb_user_role", selectedRole);
      sessionStorage.setItem("userRole", selectedRole);
      localStorage.setItem("sb_user_name", preset.name);
      localStorage.setItem("sb_user_email", email);
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push(preset.redirectUrl);
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
      
      {/* Left Column: Branding */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md font-bold font-mono text-sm">
            SB
          </div>
          <span className="text-base font-black tracking-tight">Skill Bridge</span>
        </div>

        <div className="space-y-6 relative z-10 my-auto py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Bridge the gap to your future.
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            The uncompromised evaluation and deployment platform uniting high-performing candidates, corporate engineering teams, and academic mentors.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
              <span>Rigorous AI-driven proctoring & objective vetting</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
              <span>Live production bounty rankings directly tied to placement</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono relative z-10">
          © 2026 Skill Bridge Inc. Distraction-Free SaaS Platform.
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your profile context to test the flow
            </p>
          </div>

          {/* Persona Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            {(["student", "industry", "academician"] as RoleType[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                  selectedRole === r
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                {r === "academician" ? "Academician" : r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <span>{isLoading ? "Authenticating..." : "Continue to Dashboard"}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}