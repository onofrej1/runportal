"use server";

import { prisma } from "@/db/prisma";
import { Registration } from "@/generated/prisma";
import { eventType } from "@/resources/eventType";

type SearchParams = {
  dateFrom?: string;
  dateTo?: string;
  distance?: number[];
  elevation?: number[];
  eventType?: string[];
};

export async function getRuns(search: SearchParams) {
  const { dateFrom, dateTo, distance, elevation, eventType } = search;
  console.log('e', eventType);
  return prisma.run.findMany({
    where: {
      event: {
        endDate: {
          lt: dateTo ? new Date(dateTo) : undefined,
        },
        startDate: {
          gt: dateFrom ? new Date(dateFrom) : undefined,
        },
        eventType: {
          id: {
            in: eventType ? eventType.map(e => Number(e)) : undefined,
          }
        }
      },
      
      distance: {
        gt: distance ? distance[0] * 1000 : undefined,
        lt: distance ? distance[1] * 1000 : undefined
      },
      elevation: {
        gt: elevation ? elevation[0] : undefined,
        lt: elevation ? elevation[1] : undefined
      },
    },
    include: {      
      event: {
        select: {
          startDate: true,
          endDate: true,
          location: true,
          createdAt: true,
          name: true,
          eventType: true,
        }
      },      
      _count: {
        select: {
            registrations: true,
            runResults: true,
        }
      }
    },    
  });
}

export async function getRunById(id: number) {
  return prisma.run.findFirstOrThrow({
    where: {
      id,
    },
  });
}

export async function createRegistration(data: Registration) {
  const registration = prisma.registration.create({
    data,
  });
  return registration;
}
