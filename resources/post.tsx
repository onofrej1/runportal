import { Post, Category, Tag } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { CreatePost } from "@/validation";

const post: Resource = {
  name: "Post",
  name_plural: "Posts",
  model: "post",
  resource: "posts",
  rules: CreatePost,
  menuIcon: "",
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "summary", type: "textarea", label: "Summary" },
    { name: "content", type: "richtext", label: "Content", contentClassName: 'h-52' },
    { name: "status", type: "text", label: "Status" },
    { name: "views", type: "text", label: "Views" },
    { name: "enableComments", type: "checkbox", label: "Enable comments" },
    { name: 'cover', type: 'upload', label: 'Cover'/*, uploadPath: 'posts'*/ },
    {
      name: "authorId",
      type: "foreignKey",
      relation: "author",
      label: "Author",
      resource: "users",      
    },
    {
      name: "categories",
      type: "manyToMany",
      label: "Categories",
      resource: "categories",
      field: "id",
    },
    {
      name: "tags",
      type: "manyToMany",
      label: "Tags",
      field: "id",
      resource: "tags",
    },
  ],
  list: [
    { name: "id", header: "Id" },
    { name: "title", header: "Title" },
    { name: "status", header: "Status" },
    {
      name: "categories",
      header: "Categories",
      render: ({ row }) => (
        <span>
          {(row.original as Post & { categories: Category[] }).categories.map(
            (category) => category.title
          ).join(', ')}
        </span>
      ),
    },
    {
      name: "tags",
      header: "Tags",
      render: ({ row }) => (
        <span>
          {(row.original as Post & { tags: Tag[] }).tags.map(
            (tag) => tag.title
          ).join(', ')}
        </span>
      ),
    },
  ],
};
export { post };
