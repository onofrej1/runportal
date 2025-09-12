"use client";
import { getPostById } from "@/actions/posts";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { Clock9, Tag, User } from "lucide-react";
import { useParams } from "next/navigation";
import Comments from "./_components/comments";
import useMinimalTiptapEditor from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./gallery.css";
import Lightbox from "@/components/lightbox";
import { H3 } from "@/components/typography";

export default function SingleBlog() {
  const { id } = useParams();
  const { data, refetch } = useQuery({
    queryKey: ["getPostById", id],
    queryFn: () => getPostById(Number(id)),
    //initialData: { post: undefined, images: [] },
  });
  const { post, images } = data || { post: undefined, images: []};

  const [lightboxImage, setLightboxImage] = useState<{
    id: number;
    src: string;
  }>();
  //const { post = {}, images } = data;

  //console.log(post);
  const editor = useMinimalTiptapEditor({
    immediatelyRender: false,
  });

  useEffect(() => {
    if (post?.content && editor?.isEmpty) {
      let content = { type: "doc", content: [] };
      try {
        content = JSON.parse(post.content);
        editor?.commands.setContent(content);
      } catch {}
    }
  }, [editor?.commands, editor?.isEmpty, post]);

  if (!post) return "Loading...";

  return (
    <div className="max-w-3xl mx-auto z-50">
      <div className=" rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
        <div className="relative">
          <div
            className="rounded-md card-image w-full h-72 bg-cover bg-center mb-4"
            style={{
              backgroundImage: 'url("/uploads/' + post.cover + '")',
            }}
          ></div>
        </div>
        <div>
          <a
            href="#"
            className="text-green-700 hover:text-gray-700 transition duration-500 ease-in-out text-sm"
          >
            Bežecké články
          </a>
          <h1 className="text-gray-900 font-bold text-4xl">{post.title}</h1>
          <div className="py-5 text-sm font-regular text-gray-900 flex">
            <span className="mr-3 flex flex-row items-center">
              <Clock9 className="text-green-700" size={15} />
              <span className="ml-1">
                {formatDistance(new Date(), post.updatedAt)} ago
              </span>
            </span>
            <a
              href="#"
              className="flex flex-row items-center hover:text-green-700  mr-3"
            >
              <User className="text-green-700" size={15} />
              <span className="ml-1">{post.author.name}</span>
            </a>

            <div className="flex gap-3">
              {post.tags.map((tag) => (
                <a
                  key={tag.id}
                  href="#"
                  className="flex flex-row items-center hover:text-green-700"
                >
                  <Tag className="text-green-700" size={15} />
                  <span className="ml-1">{tag.title}</span>
                </a>
              ))}
            </div>
          </div>
          <hr />
          {editor && (
            <div
              className="my-5"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() }}
            />
          )}
        </div>

        <H3 className="mt-4 mb-3">Fotogaleria</H3>
        <ul className="gallery mb-10">
          {images.map((image) => (
            <li key={image.id}>
              <Image
                onClick={() =>
                  setLightboxImage({ id: image.id, src: image.src })
                }
                className="img cursor-pointer hover:contrast-200 transition-transform duration-300 hover:scale-110"
                src={image.src}
                width={500}
                height={500}
                alt={image.src}
              />
            </li>
          ))}
        </ul>

        {lightboxImage && (
          <Lightbox activeImage={lightboxImage} images={images} />
        )}
      </div>

      <Comments
        postId={post.id}
        onAddComment={refetch}
        comments={post.comments}
      />

      <div className="container font-sans bg-green-100 rounded mt-8 p-4 md:p-24 text-center">
        <h2 className="font-bold break-normal text-2xl md:text-4xl">
          Subscribe to Bezecky portal
        </h2>
        <h3 className="font-bold break-normal text-gray-600 text-base md:text-xl">
          Get the latest posts delivered right to your inbox
        </h3>
        <div className="w-full text-center pt-4">
          <form action="#">
            <div className="max-w-sm mx-auto p-1 pr-0 flex flex-wrap items-center">
              <input
                type="email"
                placeholder="youremail@example.com"
                className="flex-1 appearance-none rounded shadow p-3 text-gray-600 mr-2 focus:outline-none"
              />
              <button
                type="submit"
                className="flex-1 mt-4 md:mt-0 block md:inline-block appearance-none bg-green-500 text-white text-base font-semibold tracking-wider uppercase py-4 rounded shadow hover:bg-green-400"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
