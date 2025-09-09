"use client";
import { getMedia } from "@/actions/media";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import "./gallery.css";
import { H3, H4 } from "@/components/typography";
import InfiniteScroll from "@/components/infinite-scroll";
import Image from "next/image";
import Lightbox from "@/components/lightbox";

export default function Page() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Awaited<ReturnType<typeof getMedia>>[0]>([]);
  const [lightboxImage, setLightboxImage] = useState<{
    id: number;
    src: string;
  }>();

  const next = async () => {
    setLoading(true);

    setTimeout(async () => {
      const newData = await queryClient.fetchQuery({
        queryKey: ["media"],
        queryFn: () => getMedia(2, page * 10),
      });
      setData((prev) => [...prev, ...newData[0]]);
      setPage((prev) => prev + 1);
      if (newData && newData[0].length < 10) {
        setHasMore(false);
      }
      setLoading(false);
    }, 800);
  };

  const lightboxImages = useMemo(
    () => data.map((media) => ({ id: media.id, src: media.file })),
    [data]
  );

  return (
    <div>
      <div className="p-4  border-dashedxx border-gray-400">
        <div className="flex justify-between p-3 bg-white border-t-2 border-b-2 border-gray-400 mb-2 rounded-lgxx shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <H3>Fotogaleria - Secovska desiatka</H3>
          <H4 className="mr-4">Autor: Jon Doe</H4>
        </div>
        <H4 className="my-2 pl-3">Datum: 20 jun 2025</H4>
        <H4 className="my-2 pl-3">Fotiek: 12</H4>
        <ul className="gallery mb-10">
          {data.map((media) => (
            <li key={media.id}>
              <Image
                onClick={() =>
                  setLightboxImage({ id: media.id, src: media.file })
                }
                className="img cursor-pointer hover:contrast-200 transition-transform duration-300 hover:scale-110"
                src={media.file}
                width={500}
                height={500}
                alt={media.file}
              />
            </li>
          ))}
        </ul>
        <InfiniteScroll
          hasMore={hasMore}
          isLoading={loading}
          next={next}
          threshold={1}
        >
          {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
        </InfiniteScroll>

        {lightboxImage && (
          <Lightbox activeImage={lightboxImage} images={lightboxImages} />
        )}
      </div>
    </div>
  );
}
