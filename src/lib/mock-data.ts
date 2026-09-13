export interface StudentProfile {
  id: string;
  name: string;
  college: string;
  degree: string;
  semester: number;
  tier: "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze";
  assessmentScore: number;
  bountyPoints: number;
  compositeScore: number;
  skills: string[];
}

export interface IndustryProfile {
  id: string;
  company: string;
  recruiterName: string;
  activePostingsCount: number;
}

export interface AcademicianProfile {
  id: string;
  name: string;
  institution: string;
  department: string;
}

export interface BountyItem {
  id: string;
  company: string;
  title: string;
  prize: string;
  points: number;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  isOpenable: boolean;
  repoUrl: string;
  starterFile: string;
  starterCode: string;
  issueSpec: {
    summary: string;
    reproduction: string;
    acceptanceCriteria: string[];
  };
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  compensation: string;
  type: "Full-Time" | "Internship" | "Contract";
  deadline: string;
  minTier: "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze";
  tags: string[];
}

// 2 Diamond, 4 Platinum, 8 Gold, 8 Silver, 6 Bronze
export const INITIAL_STUDENTS: StudentProfile[] = [
  // --- DIAMOND TIER (650+ Pts) ---
  {
    id: "stu-1",
    name: "Aarav Sharma",
    college: "Indian Institute of Technology, Bombay",
    degree: "B.Tech Computer Science",
    semester: 7,
    tier: "Diamond",
    assessmentScore: 98,
    bountyPoints: 590,
    compositeScore: 688,
    skills: ["Distributed Systems", "Raft", "Rust", "Linux Kernel", "PostgreSQL", "eBPF"],
  },
  {
    id: "stu-2",
    name: "Tanya Singhal",
    college: "Indian Institute of Technology, Delhi",
    degree: "B.Tech Computer Science",
    semester: 8,
    tier: "Diamond",
    assessmentScore: 96,
    bountyPoints: 560,
    compositeScore: 656,
    skills: ["LSM-Trees", "C++", "Storage Engines", "CUDA", "SIMD"],
  },

  // --- PLATINUM TIER (580 - 649 Pts) ---
  {
    id: "stu-3",
    name: "Ananya Iyer",
    college: "Birla Institute of Technology and Science, Pilani",
    degree: "B.E. Computer Science",
    semester: 7,
    tier: "Platinum",
    assessmentScore: 95,
    bountyPoints: 540,
    compositeScore: 635,
    skills: ["Database Internals", "C++", "Rust", "LevelDB", "Distributed Tracing"],
  },
  {
    id: "stu-4",
    name: "Vikramaditya Roy",
    college: "Indian Institute of Technology, Madras",
    degree: "B.Tech Electrical & CS",
    semester: 8,
    tier: "Platinum",
    assessmentScore: 93,
    bountyPoints: 520,
    compositeScore: 613,
    skills: ["Go", "Kubernetes Internals", "Envoy", "gRPC", "Prometheus"],
  },
  {
    id: "stu-5",
    name: "Ishaan Mehta",
    college: "Indian Institute of Technology, Kharagpur",
    degree: "B.Tech Computer Science",
    semester: 7,
    tier: "Platinum",
    assessmentScore: 92,
    bountyPoints: 500,
    compositeScore: 592,
    skills: ["Kafka", "Stream Processing", "Java", "Cassandra", "Netty"],
  },
  {
    id: "stu-6",
    name: "Sneha Mukherjee",
    college: "International Institute of Information Technology, Bangalore",
    degree: "Integrated M.Tech CS",
    semester: 8,
    tier: "Platinum",
    assessmentScore: 94,
    bountyPoints: 490,
    compositeScore: 584,
    skills: ["Zero-Copy Networking", "C", "DPDK", "eBPF", "Packet Routing"],
  },

  // --- GOLD TIER (480 - 579 Pts) ---
  {
    id: "stu-7",
    name: "Rohan Kulkarni",
    college: "National Institute of Technology, Surathkal",
    degree: "B.Tech Information Technology",
    semester: 6,
    tier: "Gold",
    assessmentScore: 90,
    bountyPoints: 470,
    compositeScore: 560,
    skills: ["Kubernetes", "Golang", "Microservices", "Docker", "Terraform"],
  },
  {
    id: "stu-8",
    name: "Diya Nambiar",
    college: "International Institute of Information Technology, Hyderabad",
    degree: "B.Tech Computer Science",
    semester: 6,
    tier: "Gold",
    assessmentScore: 89,
    bountyPoints: 450,
    compositeScore: 539,
    skills: ["Full-Stack Engineering", "TypeScript", "Next.js", "Redis", "Kafka"],
  },
  {
    id: "stu-9",
    name: "Aditya Chawla",
    college: "National Institute of Technology, Trichy",
    degree: "B.Tech Computer Science",
    semester: 6,
    tier: "Gold",
    assessmentScore: 88,
    bountyPoints: 440,
    compositeScore: 528,
    skills: ["Go", "Raft", "Consul", "High Availability", "Vault"],
  },
  {
    id: "stu-10",
    name: "Shruti Banerjee",
    college: "Delhi Technological University",
    degree: "B.Tech Software Engineering",
    semester: 7,
    tier: "Gold",
    assessmentScore: 91,
    bountyPoints: 420,
    compositeScore: 511,
    skills: ["PostgreSQL", "Query Optimization", "Python", "FastAPI"],
  },
  {
    id: "stu-11",
    name: "Manish Reddy",
    college: "Osmania University College of Engineering",
    degree: "B.E. Computer Science",
    semester: 7,
    tier: "Gold",
    assessmentScore: 87,
    bountyPoints: 420,
    compositeScore: 507,
    skills: ["Rust", "WebAssembly", "Compilers", "LLVM"],
  },
  {
    id: "stu-12",
    name: "Zoya Akhtar",
    college: "Aligarh Muslim University",
    degree: "B.Tech Computer Engineering",
    semester: 6,
    tier: "Gold",
    assessmentScore: 86,
    bountyPoints: 410,
    compositeScore: 496,
    skills: ["Linux Systems", "C", "POSIX Threads", "Async IO"],
  },
  {
    id: "stu-13",
    name: "Pranav Joshi",
    college: "College of Engineering, Pune (COEP)",
    degree: "B.Tech Computer Engineering",
    semester: 7,
    tier: "Gold",
    assessmentScore: 85,
    bountyPoints: 405,
    compositeScore: 490,
    skills: ["Distributed Locking", "Redis Cluster", "Java", "Spring Boot"],
  },
  {
    id: "stu-14",
    name: "Kritika Rawat",
    college: "Netaji Subhas University of Technology",
    degree: "B.Tech Information Technology",
    semester: 6,
    tier: "Gold",
    assessmentScore: 88,
    bountyPoints: 395,
    compositeScore: 483,
    skills: ["Next.js", "Node.js", "GraphQL", "PostgreSQL", "Docker"],
  },

  // --- SILVER TIER (350 - 479 Pts) ---
  {
    id: "stu-15",
    name: "Kabir Verma",
    college: "Delhi Technological University",
    degree: "B.Tech Software Engineering",
    semester: 5,
    tier: "Silver",
    assessmentScore: 82,
    bountyPoints: 380,
    compositeScore: 462,
    skills: ["Python", "FastAPI", "MongoDB", "gRPC", "Docker"],
  },
  {
    id: "stu-16",
    name: "Pooja Hegde",
    college: "Vellore Institute of Technology",
    degree: "B.Tech Computer Science",
    semester: 5,
    tier: "Silver",
    assessmentScore: 81,
    bountyPoints: 360,
    compositeScore: 441,
    skills: ["React", "TypeScript", "PostgreSQL", "Express", "Tailwind CSS"],
  },
  {
    id: "stu-17",
    name: "Gaurav Tripathi",
    college: "Motilal Nehru National Institute of Technology, Allahabad",
    degree: "B.Tech Computer Science",
    semester: 5,
    tier: "Silver",
    assessmentScore: 83,
    bountyPoints: 340,
    compositeScore: 423,
    skills: ["Java", "Spring Cloud", "MySQL", "Kafka Basics"],
  },
  {
    id: "stu-18",
    name: "Anwesha Roy",
    college: "Jadavpur University",
    degree: "B.E. Information Technology",
    semester: 5,
    tier: "Silver",
    assessmentScore: 79,
    bountyPoints: 330,
    compositeScore: 409,
    skills: ["Go", "REST APIs", "SQLite", "Unit Testing", "Git"],
  },
  {
    id: "stu-19",
    name: "Harshil Patel",
    college: "Nirma University",
    degree: "B.Tech Computer Science",
    semester: 6,
    tier: "Silver",
    assessmentScore: 78,
    bountyPoints: 310,
    compositeScore: 388,
    skills: ["C++", "STL", "Socket Programming", "Linux Scripting"],
  },
  {
    id: "stu-20",
    name: "Ritika Sen",
    college: "Thapar Institute of Engineering and Technology",
    degree: "B.E. Computer Engineering",
    semester: 5,
    tier: "Silver",
    assessmentScore: 77,
    bountyPoints: 300,
    compositeScore: 377,
    skills: ["Node.js", "MongoDB", "Jest", "Microservices"],
  },
  {
    id: "stu-21",
    name: "Naveen Swaminathan",
    college: "PSG College of Technology, Coimbatore",
    degree: "B.E. Computer Science",
    semester: 6,
    tier: "Silver",
    assessmentScore: 76,
    bountyPoints: 290,
    compositeScore: 366,
    skills: ["Python", "Flask", "PostgreSQL", "Pandas"],
  },
  {
    id: "stu-22",
    name: "Bhavna Jain",
    college: "Manipal Institute of Technology",
    degree: "B.Tech Information Technology",
    semester: 5,
    tier: "Silver",
    assessmentScore: 75,
    bountyPoints: 280,
    compositeScore: 355,
    skills: ["JavaScript", "HTML/CSS", "React", "Firebase"],
  },

  // --- BRONZE TIER (0 - 349 Pts) ---
  {
    id: "stu-23",
    name: "Siddharth Sen",
    college: "Jadavpur University",
    degree: "B.E. Information Technology",
    semester: 4,
    tier: "Bronze",
    assessmentScore: 74,
    bountyPoints: 250,
    compositeScore: 324,
    skills: ["Java", "Spring Boot", "MySQL", "Git", "REST APIs"],
  },
  {
    id: "stu-24",
    name: "Meera Deshmukh",
    college: "College of Engineering, Pune (COEP)",
    degree: "B.Tech Computer Engineering",
    semester: 4,
    tier: "Bronze",
    assessmentScore: 71,
    bountyPoints: 220,
    compositeScore: 291,
    skills: ["C++", "Data Structures", "Algorithms", "Bash"],
  },
  {
    id: "stu-25",
    name: "Rahul Nair",
    college: "Cochin University of Science and Technology",
    degree: "B.Tech Computer Science",
    semester: 3,
    tier: "Bronze",
    assessmentScore: 68,
    bountyPoints: 200,
    compositeScore: 268,
    skills: ["Python", "Data Structures", "Git", "SQL"],
  },
  {
    id: "stu-26",
    name: "Kavya Murthy",
    college: "PES University, Bengaluru",
    degree: "B.Tech Computer Science",
    semester: 3,
    tier: "Bronze",
    assessmentScore: 65,
    bountyPoints: 170,
    compositeScore: 235,
    skills: ["JavaScript", "React Basics", "CSS", "Git"],
  },
  {
    id: "stu-27",
    name: "Aakash Varma",
    college: "SRM Institute of Science and Technology",
    degree: "B.Tech Software Engineering",
    semester: 4,
    tier: "Bronze",
    assessmentScore: 63,
    bountyPoints: 150,
    compositeScore: 213,
    skills: ["Java", "OOP", "DBMS Basics", "Linux"],
  },
  {
    id: "stu-28",
    name: "Simran Kaur",
    college: "Guru Nanak Dev University",
    degree: "B.Tech Computer Science",
    semester: 3,
    tier: "Bronze",
    assessmentScore: 60,
    bountyPoints: 120,
    compositeScore: 180,
    skills: ["C", "Basic Algorithms", "HTML", "Git"],
  },
];

export const INITIAL_INDUSTRY: IndustryProfile = {
  id: "ind-1",
  company: "Nexus Dynamics Labs",
  recruiterName: "Vikram Malhotra",
  activePostingsCount: 8,
};

export const INITIAL_ACADEMICIAN: AcademicianProfile = {
  id: "acad-1",
  name: "Dr. Radhika Srinivasan",
  institution: "IIT Madras - School of Computing",
  department: "Systems Architecture & Parallel Processing",
};

export const INITIAL_BOUNTIES: BountyItem[] = [
  {
    id: "bounty-1",
    company: "Nexus Dynamics",
    title: "Optimize PostgreSQL WAL Group Commit Batching Pipeline",
    prize: "₹55,000",
    points: 250,
    tags: ["C", "PostgreSQL", "Concurrency", "Storage Engines"],
    difficulty: "Hard",
    isOpenable: true,
    repoUrl: "https://github.com/nexus-dynamics/postgres-wal-optim",
    starterFile: "src/backend/access/transam/xlog.c",
    starterCode: `/* PostgreSQL WAL Group Commit Accelerator */
#include "postgres.h"
#include "access/xlog.h"
#include "storage/spin.h"

int WAL_Group_Commit_Batch(int pending_tx_count) {
    // TODO: Implement dynamic microsecond lock-free batching
    // Current bottleneck: SpinLock contention on WALWriteLock
    if (pending_tx_count <= 0) return 0;
    
    // Hint: Group writes into 64KB pages and issue a single synchronized fsync
    return pending_tx_count;
}`,
    issueSpec: {
      summary: "Under high concurrency bursts (>12,000 tx/sec), the fsync queue triggers severe spinlock contention on wal_buffers. Implement dynamic microsecond lock-free batching for WAL group commits without risking durability on power drops.",
      reproduction: "Run `pgbench -c 128 -j 16 -T 60 -M prepared`. Observe WALWriteLock wait events exceeding 45% of total query latency.",
      acceptanceCriteria: [
        "Reduce p99 commit latency by at least 25% under 128 concurrent connections.",
        "Pass all ACID test suites in isolation/wal_regression.",
        "Ensure fsync guarantees zero lost writes on simulated crash-restart."
      ]
    }
  },
  {
    id: "bounty-2",
    company: "CloudScale Infra",
    title: "Implement Zero-Copy gRPC Stream Interceptor for Go Microservices",
    prize: "₹35,000",
    points: 150,
    tags: ["Go", "gRPC", "Protobuf", "Zero-Copy"],
    difficulty: "Medium",
    isOpenable: true,
    repoUrl: "https://github.com/cloudscale-infra/grpc-zero-copy-interceptor",
    starterFile: "interceptor/stream_zerocopy.go",
    starterCode: `package interceptor

import (
	"context"
	"google.golang.org/grpc"
	"io"
)

// ZeroCopyStreamServerInterceptor minimizes heap allocations for large telemetry payloads
func ZeroCopyStreamServerInterceptor() grpc.StreamServerInterceptor {
	return func(srv interface{}, ss grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) error {
		// TODO: Wrap ss with a custom ServerStream implementing io.ReaderFrom
		// Reuse shared byte buffers to eliminate 6 allocations per 64KB chunk
		return handler(srv, ss)
	}
}`,
    issueSpec: {
      summary: "High volume audio and telemetry streams incur excessive garbage collection allocations due to intermediary buffer copying in default gRPC stream handlers. Build an interceptor utilizing `io.ReaderFrom` and slice reuse.",
      reproduction: "Run benchmark `go test -bench=BenchmarkStreamingRPC -benchmem`. Notice 6 allocations per 64KB message.",
      acceptanceCriteria: [
        "Zero heap allocations per stream packet (>32KB).",
        "Support bi-directional streaming with context deadline propagation.",
        "Provide 100% unit test coverage for edge error conditions."
      ]
    }
  },
  {
    id: "bounty-3",
    company: "VectorCore AI",
    title: "Accelerate HNSW Vector Index Traversal with AVX-512 SIMD",
    prize: "₹70,000",
    points: 300,
    tags: ["Rust", "SIMD", "Vector Search", "Machine Learning Infra"],
    difficulty: "Hard",
    isOpenable: true,
    repoUrl: "https://github.com/vectorcore-ai/hnsw-simd-accelerate",
    starterFile: "src/simd_distance.rs",
    starterCode: `#[cfg(target_arch = "x86_64")]
use std::arch::x86_64::*;

pub unsafe fn euclidean_distance_avx512(a: &[f32], b: &[f32]) -> f32 {
    // TODO: Vectorize 512-bit registers (_mm512_loadu_ps, _mm512_sub_ps, _mm512_fmadd_ps)
    let mut sum = 0.0;
    for i in 0..a.len() {
        let diff = a[i] - b[i];
        sum += diff * diff;
    }
    sum.sqrt()
}`,
    issueSpec: {
      summary: "Nearest-neighbor cosine and Euclidean distances consume 78% of vector database CPU time. Vectorize distance kernels using 512-bit AVX-512 registers.",
      reproduction: "Run `cargo bench --bench hnsw_search`. Throughput throttles at 4,200 QPS on 1536-dim embeddings.",
      acceptanceCriteria: [
        "Reach >= 18,000 QPS on 1536-dimensional embeddings.",
        "Include AVX2 fallback for non-AVX-512 hardware.",
        "Zero precision degradation (epsilon < 1e-5)."
      ]
    }
  },
  {
    id: "bounty-4",
    company: "Aether Data Systems",
    title: "Resolve LSM-Tree Compaction IO Stall in LevelDB Fork",
    prize: "₹45,000",
    points: 200,
    tags: ["C++", "LSM-Tree", "Disk IO", "Memory Allocation"],
    difficulty: "Hard",
    isOpenable: false,
    repoUrl: "https://github.com/aether-data/leveldb-compaction-patch",
    starterFile: "db/version_set.cc",
    starterCode: "// LevelDB Compaction",
    issueSpec: {
      summary: "IO stalls block write requests during Level 0 to Level 1 compactions.",
      reproduction: "Run db_bench with random write workload.",
      acceptanceCriteria: ["Eliminate write stalls > 50ms."]
    }
  },
  {
    id: "bounty-5",
    company: "Sentinel Security",
    title: "Build eBPF Socket Packet Filter for Layer 7 Anomaly Rejection",
    prize: "₹40,000",
    points: 180,
    tags: ["eBPF", "Linux Kernel", "C", "Networking"],
    difficulty: "Medium",
    isOpenable: false,
    repoUrl: "https://github.com/sentinel-sec/ebpf-l7-filter",
    starterFile: "filter.bpf.c",
    starterCode: "// eBPF socket filter",
    issueSpec: {
      summary: "Reject malicious HTTP payloads at kernel boundary before socket buffers.",
      reproduction: "Simulate SYN/L7 flood using wrk.",
      acceptanceCriteria: ["Zero packet drops on verified legitimate traffic."]
    }
  },
  {
    id: "bounty-6",
    company: "KubeMesh Labs",
    title: "Patch Raft Heartbeat Split-Brain Race in Custom Service Registry",
    prize: "₹30,000",
    points: 140,
    tags: ["Distributed Systems", "Raft", "Go", "Consensus"],
    difficulty: "Medium",
    isOpenable: false,
    repoUrl: "https://github.com/kubemesh/raft-registry",
    starterFile: "raft/node.go",
    starterCode: "// Raft election timer",
    issueSpec: {
      summary: "Split-vote deadlocks during asymmetric network partitions.",
      reproduction: "Simulate Jepsen network partition test.",
      acceptanceCriteria: ["Consistent single leader election within 350ms."]
    }
  },
  {
    id: "bounty-7",
    company: "HyperCache Inc.",
    title: "Implement Lock-Free Concurrent Skip List with Tagged Pointer CAS",
    prize: "₹25,000",
    points: 120,
    tags: ["Java", "Lock-Free", "Concurrency", "Data Structures"],
    difficulty: "Medium",
    isOpenable: false,
    repoUrl: "https://github.com/hypercache/skiplist-lockfree",
    starterFile: "ConcurrentSkipList.java",
    starterCode: "// Lock-free Skip List",
    issueSpec: {
      summary: "Eliminate ABA problem using AtomicMarkableReference.",
      reproduction: "Run jcstress multi-threaded test.",
      acceptanceCriteria: ["Linearizable under 64 concurrency threads."]
    }
  },
  {
    id: "bounty-8",
    company: "OpenTelemetry Project",
    title: "Add Distributed Trace Context Propagation for Kafka Headers",
    prize: "₹20,000",
    points: 100,
    tags: ["TypeScript", "Kafka", "Observability", "Open Source"],
    difficulty: "Easy",
    isOpenable: false,
    repoUrl: "https://github.com/open-telemetry/opentelemetry-kafka-ts",
    starterFile: "src/propagator.ts",
    starterCode: "// W3C trace context propagator",
    issueSpec: {
      summary: "Inject and extract W3C traceparent headers across Kafka consumer batches.",
      reproduction: "Run mocha test suite.",
      acceptanceCriteria: ["Pass W3C trace context compliance suite."]
    }
  },
];

// All in clean Indian Rupees (₹)
export const INITIAL_JOBS: JobPosting[] = [
  {
    id: "job-1",
    title: "Staff Distributed Systems Engineer",
    company: "Nexus Dynamics",
    location: "Bengaluru, Karnataka (Hybrid)",
    compensation: "₹45,00,000 - ₹60,00,000 / year",
    type: "Full-Time",
    deadline: "In 10 days",
    minTier: "Diamond",
    tags: ["Raft", "Go", "High-Throughput", "Distributed Storage"],
  },
  {
    id: "job-2",
    title: "Systems Infrastructure Engineer (Kernel & eBPF)",
    company: "Sentinel Security",
    location: "Hyderabad, Telangana (Hybrid)",
    compensation: "₹35,00,000 - ₹48,00,000 / year",
    type: "Full-Time",
    deadline: "In 14 days",
    minTier: "Platinum",
    tags: ["Linux", "eBPF", "C", "Performance Profiling"],
  },
  {
    id: "job-3",
    title: "Distributed Backend Engineering Intern",
    company: "CloudScale Infra",
    location: "Bengaluru, Karnataka / Remote",
    compensation: "₹65,000 / month + Pre-Placement Offer",
    type: "Internship",
    deadline: "In 5 days",
    minTier: "Gold",
    tags: ["Go", "Kubernetes", "gRPC", "Docker"],
  },
  {
    id: "job-4",
    title: "Database Engine & Storage Intern",
    company: "Aether Data Systems",
    location: "Pune, Maharashtra (On-site)",
    compensation: "₹55,00,000 - ₹70,000 / month + Equity Grant",
    type: "Internship",
    deadline: "In 8 days",
    minTier: "Gold",
    tags: ["C++", "B+ Trees", "LSM-Trees", "Linux IO"],
  },
  {
    id: "job-5",
    title: "Platform Cloud Reliability Engineer",
    company: "KubeMesh Labs",
    location: "Gurugram, Haryana / Remote",
    compensation: "₹24,00,000 - ₹32,00,000 / year",
    type: "Full-Time",
    deadline: "In 18 days",
    minTier: "Silver",
    tags: ["Terraform", "AWS", "Prometheus", "CI/CD"],
  },
  {
    id: "job-6",
    title: "Junior Backend Developer",
    company: "HyperCache Inc.",
    location: "Chennai, Tamil Nadu (Hybrid)",
    compensation: "₹14,00,000 - ₹18,00,000 / year",
    type: "Full-Time",
    deadline: "In 22 days",
    minTier: "Bronze",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
  },
  {
    id: "job-7",
    title: "Full-Stack Web Engineering Intern",
    company: "VectorCore AI",
    location: "Bengaluru, Karnataka (Hybrid)",
    compensation: "₹40,000 / month",
    type: "Internship",
    deadline: "In 12 days",
    minTier: "Bronze",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "REST"],
  },
];
// Add these dynamic management helpers to src/lib/mock-data.ts

let customBounties: BountyItem[] = [];
let customJobs: JobPosting[] = [];

export function getDynamicBounties(): BountyItem[] {
  return [...INITIAL_BOUNTIES, ...customBounties];
}

export function addDynamicBounty(bounty: BountyItem) {
  customBounties.unshift(bounty);
}

export function getDynamicJobs(): JobPosting[] {
  return [...INITIAL_JOBS, ...customJobs];
}

export function addDynamicJob(job: JobPosting) {
  customJobs.unshift(job);
}