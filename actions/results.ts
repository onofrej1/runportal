'use server'

import { prisma } from "@/db/prisma";
import { RunResult } from "@/generated/prisma";
import { CreateRunResult } from "@/validation";

export async function getResults() {
  return prisma.runResult.findMany({
    include: {
      run: true,
      /*_count: {
        select: {
            registrations: true,
            runResults: true,
        }
      }*/
    },    
  });
}

export async function getResultsByRunId(runId: number) {
  return prisma.runResult.findMany({
    where: {
      runId,
    },
  });
}

export async function getRegistrations(runId: number) {
  return prisma.registration.findMany({
    include: {
      category: true,
    },
    where: {
      runId,
    },
  });
}

export async function createResults(data: RunResult[]) {
  const validateResult = CreateRunResult.parse(data);
  
  const runResults = prisma.runResult.createMany({
    data: validateResult,
  });

  return runResults;
}
