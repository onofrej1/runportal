import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Tag } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const tagService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Tag[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.tag.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.tag.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.tag.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Tag) => {
    await prisma.tag.create({ data });
  },

  update: async (data: Tag) => {
    await prisma.tag.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.tag.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.tag.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.title,
    }));
  },
};
