import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Post } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { post } from "@/resources/post";
import { arrayToQuery, setRelations } from "@/lib/resources";

export const postService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Post[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.post.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.post.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      include: arrayToQuery(["author", "categories", "tags"]),
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.post.findFirst({
      where: { id: Number(id) },
      include: arrayToQuery(["author", "categories", "tags"]),
    });
  },

  create: async (data: Post) => {
    setRelations(data, null, post.form);
    await prisma.post.create({ data });
  },

  update: async (data: Post) => {
    const oldData = await postService.get(data.id);
    setRelations(data, oldData, post.form);
    const { id, ...rest } = data;

    await prisma.post.update({ where: { id }, data: rest });
  },

  delete: async (id: number[]) => {
    await prisma.post.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const models = await prisma.post.findMany();

    return models.map((model) => ({
      value: model.id,
      label: model.title,
    }));
  },
};
