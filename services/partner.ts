import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Partner } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const partnerService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Partner[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.partner.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.partner.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.partner.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Partner) => {
    await prisma.partner.create({ data });
  },

  update: async (data: Partner) => {
    await prisma.partner.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.partner.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.partner.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.name,
    }));
  },
};
