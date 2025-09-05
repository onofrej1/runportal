import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Organizer } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const organizerService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Organizer[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.organizer.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.organizer.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.organizer.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Organizer) => {
    await prisma.organizer.create({ data });
  },

  update: async (data: Organizer) => {
    await prisma.organizer.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.organizer.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.organizer.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
