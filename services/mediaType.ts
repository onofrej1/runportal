import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { MediaType } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const mediaTypeService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[MediaType[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.mediaType.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.mediaType.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.mediaType.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: MediaType) => {
    await prisma.mediaType.create({ data });
  },

  update: async (data: MediaType) => {
    await prisma.mediaType.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.mediaType.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.mediaType.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
