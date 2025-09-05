import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Run } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { arrayToQuery, setRelations } from "@/lib/resources";
import { run } from "@/resources/run";

export const runService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Run[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.run.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.run.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
      include: arrayToQuery(["runCategories", "event"]),
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.run.findFirst({
      where: { id: Number(id) },
      include: arrayToQuery(["runCategories", "event"]),
    });
  },

  create: async (data: Run) => {
    setRelations(data, null, run.form);
    await prisma.run.create({ data });
  },

  update: async (data: Run) => {
    const oldData = await runService.get(data.id);
    setRelations(data, oldData, run.form);
    const { id, ...rest } = data;
    
    await prisma.run.update({ where: { id }, data: rest });
  },

  delete: async (id: number[]) => {
    await prisma.run.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.run.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.title,
    }));
  },
};
