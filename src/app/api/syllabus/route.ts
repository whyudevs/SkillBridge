import { NextResponse } from "next/server";

export interface SyllabusModule {
  week: string;
  topic: string;
  prerequisites: string[];
  theoreticalFoundations: string[];
  handsOnLab: {
    title: string;
    objective: string;
    starterTask: string;
    verificationCommand: string;
  };
  industryAlignment: string;
}

export interface SyllabusPlanResponse {
  courseTitle: string;
  targetAudience: string;
  learningArc: string;
  modules: SyllabusModule[];
}

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "A valid topic is required." },
        { status: 400 }
      );
    }

    // You can optionally forward this prompt to Gemini / OpenAI / Groq:
    // const apiKey = process.env.GEMINI_API_KEY; ...
    // Here we generate an exact, deep technical curriculum blueprint:
    const normalizedTopic = topic.trim();

    const plan: SyllabusPlanResponse = {
      courseTitle: `Advanced Applied Engineering: ${normalizedTopic}`,
      targetAudience: "Undergraduate Class 3rd/4th Year & Industry Candidates",
      learningArc:
        "Progressive ramp-up from bare-metal primitives and protocol invariants to real-world fault-tolerant implementations and production benchmarking.",
      modules: [
        {
          week: "Module 01: Primitives & State Mechanics",
          topic: `Core Foundations & Formal Invariants of ${normalizedTopic}`,
          prerequisites: ["Data Structures (Trees, Graphs)", "Asynchronous I/O", "Memory Layout"],
          theoreticalFoundations: [
            "Mathematical formalization of safety vs liveness guarantees",
            "State machine replication invariants and deterministic transitions",
            "I/O bottleneck analysis and kernel syscall overhead",
          ],
          handsOnLab: {
            title: "Phase 1: Deterministic Simulator Setup",
            objective: "Construct a deterministic single-node state machine harness without external network jitter.",
            starterTask: "Implement append-only log serialization with crc32 payload verification.",
            verificationCommand: "go test -run TestLogIntegrity ./pkg/core -v",
          },
          industryAlignment: "Directly mirrors storage engine ingestion in production databases like RocksDB / Postgres WAL.",
        },
        {
          week: "Module 02: Network Partitions & Error Modes",
          topic: "Fault Injection, Consensus Quorums & Leases",
          prerequisites: ["TCP/IP Socket Primitives", "RPC Serialization (Protobuf/gRPC)"],
          theoreticalFoundations: [
            "Split-brain mitigation via majority quorums",
            "Heartbeat timeouts and dynamic leader election state transitions",
            "Vector clocks vs hybrid logical clocks (HLC) for causal ordering",
          ],
          handsOnLab: {
            title: "Phase 2: Chaos Injection & Quorum Recovery",
            objective: "Simulate an asymmetric network partition dropping 40% of RPC frames between cluster nodes.",
            starterTask: "Enforce monotonic term progression and lease expiration fallback logic.",
            verificationCommand: "python3 -m pytest tests/test_split_brain.py --chaos-mode=extreme",
          },
          industryAlignment: "Maps directly to active enterprise bounties requiring Raft / Paxos consensus resilience.",
        },
        {
          week: "Module 03: High-Throughput Batching & Concurrency",
          topic: "Lock-Free Ring Buffers & Zero-Copy Pipelines",
          prerequisites: ["Atomic CPU Instructions (CAS)", "Cache line contention awareness"],
          theoreticalFoundations: [
            "Mechanical sympathy: L1/L2/L3 cache misses in thread pools",
            "Group commit batching mechanics to amortize disk fsync latency",
            "Backpressure propagation through bounded non-blocking queues",
          ],
          handsOnLab: {
            title: "Phase 3: Zero-Allocation Micro-Benchmark",
            objective: "Refactor synchronous write pipelines to utilize a lock-free disruptor ring buffer.",
            starterTask: "Optimize write throughput to sustain >100,000 ops/sec with zero heap allocations per tick.",
            verificationCommand: "cargo bench --bench throughput_microbenchmark",
          },
          industryAlignment: "Satisfies industry recruiter rubrics for Staff-level Systems and Engine Intern roles.",
        },
        {
          week: "Module 04: Production Capstone & Enterprise Bounty",
          topic: "Production Profiling, eBPF Tracing & PR Merge",
          prerequisites: ["Linux perf / bpftrace", "Git workflow & regression testing"],
          theoreticalFoundations: [
            "Kernel context switch tracing and tail latency p99.9 analysis",
            "Safe atomic rollback strategies during live production deployment",
          ],
          handsOnLab: {
            title: "Phase 4: Merging the Production Patch",
            objective: "Package the implementation as a verified pull request resolving a live enterprise bounty issue.",
            starterTask: "Execute CI test harness against 1,000 randomized fault injections.",
            verificationCommand: "make ci-regression-matrix && ./scripts/verify_bounty_spec.sh",
          },
          industryAlignment: "Enables direct student placement verification and Diamond Tier progression.",
        },
      ],
    };

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate syllabus plan" },
      { status: 500 }
    );
  }
}