import { Resource } from "@/types/resources";
import { CreateMediaComment } from "@/validation";

const mediaComment: Resource = {
  name: "MediaComment",
  name_plural: "Media comments",
  model: "mediaComment",
  resource: "mediaComments",
  menuIcon: "",
  rules: CreateMediaComment,
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "comment", type: "text", label: "Comment" },
    { name: "status", type: "text", label: "Status" },
    {
      name: "userId",
      type: "foreignKey",
      relation: "user",
      label: "User",
      resource: "users",
    },
    {
      name: "mediaId",
      type: "foreignKey",
      relation: "media",
      label: "Media",
      resource: "media",
    },
  ],
  list: [
    { name: "title", header: "Title" },
    { name: "comment", header: "Comment" },
    { name: "status", header: "Status" },
  ],
};
export { mediaComment };
