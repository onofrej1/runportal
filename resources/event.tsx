import { Button } from "@/components/ui/button";
import { Resource } from "@/types/resources";
import { CreateEvent } from "@/validation";
import { Event, EventType } from "@/generated/prisma";
import Link from "next/link";
import { Image as ImageIcon, SquarePen } from "lucide-react";

const event: Resource = {
  name: "Event",
  name_plural: "Events",
  model: "event",
  resource: "events",
  rules: CreateEvent,
  menuIcon: "",
  renderForm: ({ fields }) => {
    return (
      <div className="flex flex-col gap-4">
        {fields.name}
        {fields.description}
        <div className="flex gap-2">
          <div className="flex-1">{fields.status}</div>
          <div className="flex-1">{fields.color}</div>
        </div>
        {fields.contact}
        {fields.location}
        {fields.venue}
        <div className="flex gap-2">
          <div className="flex-1">{fields.startDate}</div>
          <div className="flex-1">{fields.endDate}</div>
        </div>
        {fields.maxAttendees}
        {fields.venueId}
        {fields.organizerId}
        <Button type="submit">Save</Button>
      </div>
    );
  },
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "description", type: "textarea", label: "Description" },
    { name: "status", type: "text", label: "Status" },
    { name: "color", type: "text", label: "Color" },
    { name: "contact", type: "text", label: "Contact" },
    { name: "location", type: "text", label: "Location" },
    { name: "maxAttendees", type: "number", label: "Max attendees" },
    { name: "startDate", type: "date-picker", label: "Start date" },
    { name: "endDate", type: "date-picker", label: "End date" },
    {
      name: "venueId",
      type: "foreignKey",
      relation: "venue",
      label: "Venue",
      resource: "venues",
    },
    {
      name: "organizerId",
      type: "foreignKey",
      relation: "organizer",
      label: "Organizer",
      resource: "organizers",
    },
  ],
  list: [
    { name: "id", header: "Id" },
    { name: "name", header: "Name" },
    //{ name: "description", header: "Description" },
    {
      name: "startDate",
      header: "Start date",
      render: ({ row }) => (
        <span>
          {new Date((row.original as Event).startDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      name: "endDate",
      header: "End date",
      render: ({ row }) => (
        <span>
          {new Date((row.original as Event).endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      name: "eventType",
      header: "Event type",
      render: ({ row }) => (
        <span>
          {(row.original as Event & { eventType: EventType }).eventType.type}
        </span>
      ),
    },
    {
      name: "status",
      header: "Status",
      render: ({ row }) => <span>{(row.original as Event).status}</span>,
    },
    {
      name: "links",
      header: "Links",
      render: ({ row }) => (
        <div className="flex gap-2">
          <Button variant={"default"} size={"sm"}>
            <SquarePen />
            <Link href={`/resource/runs?eventId=${(row.original as Event).id}`}>
              Runs
            </Link>
          </Button>
          <Button variant={"default"} size={"sm"}>
            <ImageIcon />
            <Link
              href={`/resource/galleries?eventId=${(row.original as Event).id}`}
            >
              Galleries
            </Link>
          </Button>
        </div>
      ),
    },
  ],
};
export { event };
