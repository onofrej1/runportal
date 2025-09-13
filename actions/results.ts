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

type Filter = {
  runId: number;
  search?: string;
  categoryId?: number;
  status?: boolean;
  page?: number;
}

export async function getRegistrations(filter: Filter) {
  const { runId, search, categoryId, status, page = 1 } = filter;
  console.log('get reg', filter);
  //const [firstName, lastName] = search?.split(' ');

  const rowCount = await prisma.registration.count({    
    where: {      
      runId,
      paid: status,
      categoryId,      
    },    
  });

  const registrations = await prisma.registration.findMany({
    include: {
      category: true,
    },
    where: {
      /*OR: [
        { 
          firstName: {
            contains: 
          }
        }
      ],*/
      runId,
      paid: status,
      categoryId,      
    },
    take: 10,
    skip: (page -1 ) * 10,
    orderBy: {
      createdAt: 'asc',
    }
  });

  const count = Math.ceil(rowCount / 10);

  return { data: registrations, count };
}

export async function createResults(data: RunResult[]) {
  const validateResult = CreateRunResult.parse(data);
  
  const runResults = prisma.runResult.createMany({
    data: validateResult,
  });

  return runResults;
}
