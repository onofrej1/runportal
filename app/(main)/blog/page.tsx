"use client";
import { getPosts } from "@/actions/posts";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { useRouter } from "next/navigation";

export default function Blog() {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["getPosts"],
    queryFn: () => getPosts(),
  });

  const navigateToBlog = (id: number) => {
    router.push(`/blog/${id}`);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {data?.data.map((post) => (
        <div
          key={post.id}
          className="max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        >
          <div className="relative">
            <div
              className="card-image h-72 bg-cover bg-center"
              style={{
                backgroundImage: 'url("/uploads/' + post.cover + '")',
              }}
            ></div>
          </div>
          <div className="p-6 bg-white space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {post.summary}
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigateToBlog(post.id)}
                className="bg-green-800 text-white py-2 px-6 rounded-full text-sm font-medium shadow-md hover:bg-green-900 hover:shadow-xl transition-all transform flex items-center"
              >
                Zobraziť článok
              </button>
              <span className="text-sm text-gray-500">
                Last updated: {formatDistance(new Date(), post.updatedAt)} ago
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
