"use server";

import { prisma } from "@/db/prisma";
import { PostStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

export async function getAllPosts(skip: number) {
  //const { take, skip, sort, include, joinOperator = 'AND', filters } =   
  const take = 10;
  //const orderBy = getOrderBy(sort);
  const where = {};
  //const whereQuery = getWhereQuery(filters);
  //const where = whereQuery.length ? { [joinOperator.toUpperCase()]: whereQuery } : {};

  const data = await prisma.post.findMany({
    take: Number(take),
    skip: Number(skip),
    include: {
      author: true,
      comments: true,
    },
    //orderBy,
  });

  const count = await prisma.post.count({
    where,
  });
  const numPages = Math.ceil(count / Number(take));

  return { data, count, numPages };
  /*const data = await prisma.post.findMany({
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      comments: true,
    },
  });

  return data;*/
}

export async function updateStatus(
  id: number,
  status: PostStatus
) {
  return prisma.post.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}
