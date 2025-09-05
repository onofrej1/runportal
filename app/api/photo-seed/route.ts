import { prisma } from "@/db/prisma";
import { Media } from "@/generated/prisma";
import { getImageOrientation } from "@/lib/server-utils";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

function random<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET() {
  const ids = await prisma.user.findMany({ select: { id: true } });
  const userIds = ids.map((i) => i.id);
  const media: Partial<Media>[] = [];
  const galleries = await prisma.gallery.findMany({ select: { id: true } });
  const galleryIds = galleries.map(g => g.id);
  const categories = await prisma.mediaCategory.findMany({ select: { id: true } });
  const categoryIds = categories.map(c => c.id);

  for (const [i] of Array.from({ length: 80 }).entries()) {
    const fileName = "photo-" + i + ".jpeg";
    const path = "/photos_new/"+fileName;

    media.push({
      name: faker.lorem.words({ min: 1, max: 2 }).replace(" ", "_"),
      description: faker.lorem.sentence(),
      file: path,
      categoryId: random(categoryIds),
      galleryId: random(galleryIds),
      userId: random(userIds),
      orientation: await getImageOrientation(path),
      size: faker.number.int({ min: 100, max: 500 }),
      mediaTypeId: 1,
    });
  }

  await prisma.media.createMany({ data: media as Media[] });

  return NextResponse.json({ result: "done" });
}
