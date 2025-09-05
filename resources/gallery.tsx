import { Gallery, Event, Post } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { createGallery } from "@/validation";
import Link from "next/link";

const gallery: Resource = {
  name: "Gallery",
  name_plural: "galleries",
  model: "gallery",
  resource: "galleries",
  menuIcon: "",
  rules: createGallery,
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "description", type: "text", label: "Description" },
    //{ name: "views", type: "text", label: "Views" },
    //{ name: "downloads", type: "text", label: "Downloads" },
    {
      name: "userId",
      type: "foreignKey",
      relation: "user",
      label: "User",
      resource: "users",
    },
    {
      name: "eventId",
      type: "foreignKey",
      relation: "event",
      label: "Event",
      resource: "events",
    },
    {
      name: "postId",
      type: "foreignKey",
      relation: "post",
      label: "Post",
      resource: "posts",
    },
  ],
  list: [
    { name: "name", header: "Name" },
    { name: "description", header: "Description" },
    { name: "views", header: "Views" },
    {
      name: "eventId",
      header: "Event/Post",
      enableColumnFilter: true,
      filter: {
        label: "Event",
        placeholder: "Search events...",
        //icon: Text,
        type: "multiSelect",
        name: "eventId",
        resource: "events",
        //renderOption: (row: Category) => row.name,
        search: "event",
      },
      render: ({ row }) => {
        const data = row.original as Gallery & { event?: Event; post?: Post };
        if (data.event) {
          return <span>[Event] {data.event.name}</span>;
        } else if (data.post) {
          return <span>[Post] {data.post.title}</span>;
        }
        return <span></span>;
      },
    },
    {
      name: "media",
      header: "Media",
      render: ({ row }) => (
        <span>
          <Link
            href={`/resource/media?galleryId=${(row.original as Gallery).id}`}
          >
            Media
          </Link>
        </span>
      ),
    },
  ],
};
export { gallery };
