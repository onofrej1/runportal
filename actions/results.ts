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

type ResultFilter = {
  runId: number;
  search?: string;
  category?: string;  
  page?: number;
};

export async function getResultsByRunId(filter: ResultFilter) {
  const { runId, search, category, page = 1} = filter;
  const pageCount = 20;

  const rowCount = await prisma.runResult.count({    
    where: {
      id: search ? Number(search) : undefined,
      runId,     
      category,
    },   
  });

  const results = await prisma.runResult.findMany({
    where: {
      id: search ? Number(search) : undefined,
      runId,
      category 
    },
    take: 10,
    skip: (page -1 ) * pageCount,
    orderBy: {
      rank: 'asc',
    }
  });

  const count = Math.ceil(rowCount / pageCount);

  return { data: results, count };
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
  const pageCount = 20;
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
    skip: (page -1 ) * pageCount,
    orderBy: {
      createdAt: 'asc',
    }
  });

  const count = Math.ceil(rowCount / pageCount);

  return { data: registrations, count };
}

export async function createResults(data: RunResult[]) {
  const validateResult = CreateRunResult.parse(data);
  
  const runResults = prisma.runResult.createMany({
    data: validateResult,
  });

  return runResults;
}
