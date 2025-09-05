import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Registration } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const registrationService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Registration[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.registration.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.registration.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.registration.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Registration) => {
    await prisma.registration.create({ data });
  },

  update: async (data: Registration) => {
    await prisma.registration.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.registration.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.registration.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
