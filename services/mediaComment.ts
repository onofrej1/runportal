import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { MediaComment } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const mediaCommentService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[MediaComment[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.mediaComment.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.mediaComment.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.mediaComment.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: MediaComment) => {
    await prisma.mediaComment.create({ data });
  },

  update: async (data: MediaComment) => {
    await prisma.mediaComment.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.mediaComment.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.mediaComment.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.title,
    }));
  },
};
