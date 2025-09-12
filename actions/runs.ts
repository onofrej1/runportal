"use server";

import { prisma } from "@/db/prisma";
import { Registration } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type SearchParams = {
  dateFrom?: string;
  dateTo?: string;
  distance?: number[];
  elevation?: number[];
  eventType?: string[];
  region?: string[];
};

export async function getRuns(search: SearchParams) {
  const { dateFrom, dateTo, distance, elevation, eventType, region } = search;

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
            in: eventType ? eventType.map((e) => Number(e)) : undefined,
          },
        },
        location: {
          district: {
            region: {
              id: {
                in: region ? region.map((e) => Number(e)) : undefined,
              },
            },
          },
        },
      },
      distance: {
        gt: distance ? distance[0] * 1000 : undefined,
        lt: distance ? distance[1] * 1000 : undefined,
      },
      elevation: {
        gt: elevation ? elevation[0] : undefined,
        lt: elevation ? elevation[1] : undefined,
      },
    },
    include: {
      event: {
        select: {
          startDate: true,
          endDate: true,
          location: {
            select: {
              location: true,
              district: {
                select: {
                  region: true,
                },
              },
            },
          },
          createdAt: true,
          name: true,
          eventType: true,
        },
      },
      _count: {
        select: {
          registrations: true,
          runResults: true,
        },
      },
    },
  });
}

export async function getRunById(id: number) {
  return prisma.run.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      runEntryFees: true,
      event: {
        select: {
          startDate: true,
          endDate: true,
          contact: true,
          name: true,
          organizer: true,

          location: {
            select: {
              location: true,
              district: {
                select: {
                  region: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          registrations: true,
          runResults: true,
        },
      },
    },
  });
}

export async function getRegionOptions() {
  const models = await prisma.region.findMany();

  return models.map((model) => ({
    value: model.id,
    label: model.region,
  }));
}

export async function getCategoryOptions(runId: number) {
  const models = await prisma.runCategory.findMany({
    where: {
      runs: {
        some: {
          id: {
            in: [runId],
          },
        },
      },
    },
  });
  console.log(models.length);

  return models.map((model) => ({
    value: model.id.toString(),
    label: model.title,
  }));
}

export async function createRegistration(data: Registration) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });

  const registration = prisma.registration.create({
    data: {
      ...data,
      userId: session?.user.id,
    },
  });
  return registration;
}
