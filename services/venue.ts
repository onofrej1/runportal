import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Venue } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const venueService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Venue[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.venue.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.venue.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.venue.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Venue) => {
    await prisma.venue.create({ data });
  },

  update: async (data: Venue) => {
    await prisma.venue.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.venue.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.venue.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.location,
    }));
  },
};
