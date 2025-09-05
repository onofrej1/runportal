import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { User } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const userService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[User[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.user.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.user.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: User) => {
    await prisma.user.create({ data });
  },

  update: async (data: User) => {
    await prisma.user.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.user.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.user.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
