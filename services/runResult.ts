import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { RunResult } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { arrayToQuery } from "@/lib/resources";

export const runResultService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[RunResult[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.runResult.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.runResult.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
      include: arrayToQuery(["run", "user"]),
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.runResult.findFirst({
      where: { id: Number(id) },
      include: arrayToQuery(["run", "user"]),
    });
  },

  create: async (data: RunResult) => {
    await prisma.runResult.create({ data });
  },

  update: async (data: RunResult) => {
    await prisma.runResult.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.runResult.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.runResult.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
