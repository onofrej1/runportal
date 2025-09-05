import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Comment } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const commentService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Comment[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.comment.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.comment.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.comment.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Comment) => {
    await prisma.comment.create({ data });
  },

  update: async (data: Comment) => {
    await prisma.comment.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.comment.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.comment.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.title,
    }));
  },
};
