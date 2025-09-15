import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Location } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const locationService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Location[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.location.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.location.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.location.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Location) => {
    await prisma.location.create({ data });
  },

  update: async (data: Location) => {
    await prisma.location.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.location.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.location.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.location,
    }));
  },
};
