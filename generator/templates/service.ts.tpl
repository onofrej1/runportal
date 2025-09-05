import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { [ENTITY] } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const [MODEL]Service = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[[ENTITY][], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.[MODEL].aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.[MODEL].findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.[MODEL].findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: [ENTITY]) => {
    await prisma.[MODEL].create({ data });
  },

  update: async (data: [ENTITY]) => {
    await prisma.[MODEL].update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.[MODEL].deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.[MODEL].findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.[OPTION_FIELD],
    }));
  },
};
