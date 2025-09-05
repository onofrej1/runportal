import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { MediaCategory } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const mediaCategoryService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[MediaCategory[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.mediaCategory.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.mediaCategory.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.mediaCategory.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: MediaCategory) => {
    await prisma.mediaCategory.create({ data });
  },

  update: async (data: MediaCategory) => {
    await prisma.mediaCategory.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.mediaCategory.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.mediaCategory.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
