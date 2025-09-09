import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Event } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { arrayToQuery } from "@/lib/resources";

export const eventService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Event[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.event.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.event.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
      include: arrayToQuery(["eventType"]),
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.event.findFirst({
      where: { id: Number(id) },
      include: arrayToQuery(["eventType"]),
    });
  },

  create: async (data: Event) => {
    await prisma.event.create({ data });
  },

  update: async (data: Event) => {
    await prisma.event.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.event.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.event.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
