import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Gallery } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { arrayToQuery } from "@/lib/resources";

export const galleryService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Gallery[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.gallery.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.gallery.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
      include: arrayToQuery(['event', 'post']),
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.gallery.findFirst({
      where: { id: Number(id) },
      include: arrayToQuery(['event', 'post']),
    });
  },

  create: async (data: Gallery) => {
    await prisma.gallery.create({ data });
  },

  update: async (data: Gallery) => {
    await prisma.gallery.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.gallery.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.gallery.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
