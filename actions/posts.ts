"use server";

import { prisma } from "@/db/prisma";
import { PostStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function toggleEnableComments(
  id: number,
  enableComments: boolean
) {
  return prisma.post.update({
    where: {
      id,
    },
    data: {
      enableComments,
    },
  });
}

export async function getPostById(id: number) {
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      tags: true,
      categories: true,
      galleries: {
        select: {
          name: true,
          description: true,
          media: true,
        }
      },
      comments: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true /*{
            select: {
              name: true,
              image: true,
            },
          },*/,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
    },
  });
  const images = post.galleries.flatMap(gallery => gallery.media.map(media => ({
    src: media.file,
    id: media.id,
  })));

  return { post, images };
}

export async function getPosts(skip = 0) {
  const take = 10;
  const where = {};

  const data = await prisma.post.findMany({
    take: Number(take),
    skip: Number(skip),
    include: {
      author: true,
      comments: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const count = await prisma.post.count({
    where,
  });
  const numPages = Math.ceil(count / Number(take));

  return { data, count, numPages };
}

export async function updateStatus(id: number, status: PostStatus) {
  return prisma.post.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

export async function getComments(parentId: number) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  if (!session?.user.id) return;

  const result = await prisma.comment.findMany({
    where: {
      parentId,
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
        },
      },
      comment: true,
      publishedAt: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
}

export async function addComment(
  comment: string,
  postId: number | null,
  parentId?: number | null
) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  if (!session?.user.id) return;

  if (postId) {
    return prisma.comment.create({
      data: {
        userId: session.user.id,
        postId,
        comment,
      },
    });
  } else if (parentId) {
    return prisma.comment.create({
      data: {
        userId: session.user.id,
        parentId,
        comment,
      },
    });
  }
}
