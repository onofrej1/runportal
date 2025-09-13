import { Button } from "@/components/ui/button";
import { Run, Event } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { CreateRun } from "@/validation";

const run: Resource = {
  name: "Run",
  name_plural: "Runs",
  model: "run",
  resource: "runs",
  relations: ["event"],
  rules: CreateRun,
  menuIcon: "",
  renderForm: ({ fields }) => {
    return (
      <div className="flex flex-col gap-4">
        {fields.eventId}
        {fields.title}
        <div className="flex gap-2">
          <div className="flex-1">{fields.distance}</div>
          <div className="flex-1">{fields.elevation}</div>
        </div>
        {fields.surface}        
        {fields.runCategories}
        <Button type="submit">Save</Button>
      </div>
    );
  },
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "distance", type: "number", label: "Distance (m)" },    
    { name: "elevation", type: "text", label: "Elevation (m)" },
    { name: "surface", type: "text", label: "Surface" },
    {
      name: "eventId",
      type: "foreignKey",
      relation: "event",
      label: "Event",
      resource: "events",
    },
    {
      name: "runCategories",
      type: "manyToMany",
      label: "Categories",
      resource: "runCategories",
      field: "id",
    },
  ],
  list: [
    { name: "id", header: "Id" },
    {
      name: "eventId",
      header: "Event",
      enableColumnFilter: true,
      filter: {
        label: "Event",
        placeholder: "Search events...",        
        type: "multiSelect",
        name: "eventId",
        resource: "events",
        search: "event",
      },
      render: ({ row }) => (
        <span>{(row.original as Run & { event: Event }).event.name}</span>
      ),
    },
    { name: "title", header: "Title" },
    { name: "distance", header: "Distance" },
    { name: "surface", header: "Surface" },
  ],
};
export { run };
