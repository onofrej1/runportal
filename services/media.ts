import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Media } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { arrayToQuery } from "@/lib/resources";

export const mediaService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Media[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });
    console.log(filters);
    const where = applyFilters(filters, operator);
    console.log(where);
    const rowCount = await prisma.media.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.media.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
      include: arrayToQuery(["mediaType", "category", "user", "gallery"]),
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.media.findFirst({
      where: { id: Number(id) },      
    });
  },

  create: async (data: Media) => {
    await prisma.media.create({ data });
  },

  update: async (data: Media) => {
    await prisma.media.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.media.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.media.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
