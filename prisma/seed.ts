import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.bountySubmission.deleteMany();
  await prisma.applicant.deleteMany();
  await prisma.bounty.deleteMany();
  await prisma.job.deleteMany();

  await prisma.job.create({
    data: {
      title: "Staff Distributed Systems Engineer",
      company: "Nexus Dynamics Labs",
      location: "Bengaluru, India (Hybrid)",
      compensation: "₹45,00,000 - ₹60,00,000 / yr",
      type: "Full-Time",
      deadline: "In 25 days",
      tags: "Raft, Go, Distributed Systems",
      applicants: {
        create: [
          {
            name: "Aarav Sharma",
            college: "IIT Bombay",
            degree: "B.Tech Computer Science (Sem 8)",
            tier: "Diamond",
            compositeScore: 688,
            status: "Pending Review",
          },
          {
            name: "Ananya Iyer",
            college: "BITS Pilani",
            degree: "B.E. Computer Science (Sem 8)",
            tier: "Platinum",
            compositeScore: 635,
            status: "Pending Review",
          },
        ],
      },
    },
  });

  await prisma.bounty.create({
    data: {
      title: "Optimize Postgres WAL Flush Pipeline Under High Concurrency",
      company: "Nexus Dynamics Labs",
      prize: "₹65,000",
      points: 250,
      tags: "Postgres, WAL, Zero-Copy, C",
      submissions: {
        create: [
          {
            authorName: "Aarav Sharma",
            authorTier: "Diamond",
            prUrl: "https://github.com/nexus-dynamics/storage-engine/pull/142",
            testPassed: true,
            benchmarkScore: "0 allocs/op • 118,000 writes/sec (+38% throughput)",
            solutionSnippet: `func (w *WALPipeline) SyncRecord(rec []byte) error {
    w.mu.Lock()
    w.batch = append(w.batch, rec)
    if len(w.batch) >= GroupCommitThreshold {
        return w.flushLockedBatch()
    }
    w.mu.Unlock()
}`,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });