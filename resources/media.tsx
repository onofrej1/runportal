import { Button } from "@/components/ui/button";
import {
  Media,
  User,
  MediaCategory,
  MediaType,
  Gallery,
} from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { CreateMedia } from "@/validation";
import Link from "next/link";

const media: Resource = {
  name: "Media",
  name_plural: "Media",
  model: "media",
  resource: "media",
  //advancedFilter: true,
  menuIcon: "",
  rules: CreateMedia,
  renderForm: ({ fields }) => {
    return (
      <div className="flex flex-col gap-4">
        {fields.name}
        {fields.description}
        {fields.file}
        <div className="flex gap-2">
          <div className="flex-1">{fields.size}</div>
          <div className="flex-1">{fields.orientation}</div>
        </div>
        {fields.mediaTypeId}
        {fields.galleryId}
        {fields.userId}
        {/*<div className="flex gap-2">
            <div className="flex-1">{fields.likes}</div>
            <div className="flex-1">{fields.views}</div>
            <div className="flex-1">{fields.downloads}</div>
          </div>*/}
        {fields.categoryId}

        <Button type="submit">Save</Button>
      </div>
    );
  },
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "description", type: "textarea", label: "Description" },
    { name: "file", type: "text", label: "File" },
    { name: "size", type: "number", label: "Size" },
    {
      name: "orientation",
      type: "select",
      label: "Orientation",
      options: [
        { label: "Vertical", value: "VERTICAL" },
        { label: "Horizontal", value: "HORIZONTAL" },
        { label: "Square", value: "SQUARE" },
      ],
    },
    {
      name: "mediaTypeId",
      type: "foreignKey",
      relation: "mediaType",
      label: "Media type",
      resource: "mediaTypes",
    },
    //{ name: 'likes', type: 'number', label: 'Likes' },
    //{ name: 'views', type: 'number', label: 'Views' },
    //{ name: 'downloads', type: 'number', label: 'Downloads' },
    {
      name: "userId",
      type: "foreignKey",
      relation: "user",
      label: "User",
      resource: "users",
    },
    {
      name: "galleryId",
      type: "foreignKey",
      relation: "gallery",
      label: "Gallery",
      resource: "galleries",
    },
    {
      name: "categoryId",
      type: "foreignKey",
      relation: "category",
      label: "Category",
      resource: "mediaCategories",
    },
  ],
  list: [
    { name: "id", header: "Id" },
    { name: "name", header: "Name" },
    //{ name: "description", header: "Description" },
    {
      name: "galleryId",
      header: "Gallery",
      enableColumnFilter: true,
      filter: {
        label: "Gallery",
        placeholder: "Search galleries...",
        //icon: Text,
        type: "multiSelect",
        name: "galleryId",
        resource: "galleries",
        //renderOption: (row: Category) => row.name,
        search: "gallery",
      },
      render: ({ row }) => (
        <span>
          {(row.original as Media & { gallery: Gallery }).gallery.name}
        </span>
      ),
    },
    {
      name: "userId",
      header: "User",
      render: ({ row }) => (
        <span>{(row.original as Media & { user: User }).name}</span>
      ),
    },
    {
      name: "mediaTypeId",
      header: "Type",
      render: ({ row }) => (
        <span>
          {(row.original as Media & { mediaType: MediaType }).mediaType.name}
        </span>
      ),
    },
    {
      name: "mediaCategoryId",
      header: "Category",
      render: ({ row }) => (
        <span>
          {(row.original as Media & { category: MediaCategory }).category.name}
        </span>
      ),
    },
  ],
};
export { media };
