import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { RunCategory } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const runCategoryService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[RunCategory[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.runCategory.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.runCategory.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.runCategory.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: RunCategory) => {
    await prisma.runCategory.create({ data });
  },

  update: async (data: RunCategory) => {
    await prisma.runCategory.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.runCategory.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.runCategory.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.title,
    }));
  },
};
