import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { EventType } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const eventTypeService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[EventType[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.eventType.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.eventType.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.eventType.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: EventType) => {
    await prisma.eventType.create({ data });
  },

  update: async (data: EventType) => {
    await prisma.eventType.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.eventType.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.eventType.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.type,
    }));
  },
};
