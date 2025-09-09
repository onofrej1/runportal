"use server";

import { mediaService } from "@/services/media";

export async function getMedia(galleryId: number, offset: number) {
  const [data, count] = await mediaService.getAll(
    { limit: 10, offset },
    { filters: [], operator: "and" },
    [{ id: "id", desc: true }]
  );

  return [data, count] as const;
}
