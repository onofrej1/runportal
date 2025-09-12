import { createRegistration } from "@/actions/registrations";
import { Registration, Run } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { ManageRegistration } from "@/validation";

const registration: Resource = {
  name: "Registration",
  name_plural: "Registrations",
  model: "registration",
  resource: "registrations",
  menuIcon: "",
  rules: ManageRegistration,
  form: [
    { name: "firstName", type: "text", label: "First name" },
    { name: "lastName", type: "text", label: "Last name" },
    {
      name: "gender",
      type: "select",
      label: "Gender",
      options: [
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" },
      ],
    },
    { name: "dateOfBirth", type: "date-picker", label: "Date of birth" },
    {
      name: "nation",
      type: "select",
      label: "Nation",
      options: [
        { value: "svk", label: "SVK" },
        { value: "other", label: "other" },
      ],
    },
    { name: "club", type: "text", label: "Club" },
    { name: "city", type: "text", label: "City" },
    { name: "email", type: "text", label: "Email" },
    { name: "presented", type: "checkbox", label: "Presented" },
    { name: "paid", type: "checkbox", label: "Paid" },
    {
      name: "tshirtSize",
      type: "select",
      label: "Tshirt size",
      options: [
        { value: "null", label: "No Tshirt" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
      ],
    },
    {
      name: "userId",
      type: "foreignKey",
      relation: "user",
      label: "User",
      resource: "users",
    },
    {
      name: "runId",
      type: "foreignKey",
      relation: "run",
      label: "Run",
      resource: "runs",
    },
    {
      name: "categoryId",
      type: "foreignKey",
      relation: "runCategory",
      label: "Category",
      resource: "runCategories",
    },
  ],
  list: [
    { name: "firstName", header: "First name" },
    { name: "lastName", header: "Last name" },
    { name: "club", header: "Club" },
    { name: "paid", header: "Paid" },
    {
      name: "runId",
      header: "Run",
      enableColumnFilter: true,
      filter: {
        label: "Run",
        placeholder: "Search runs...",
        type: "multiSelect",
        name: "runId",
        resource: "runs",
        search: "run",
      },
      render: ({ row }) => {
        const data = row.original as Registration & { run: Run };
        return <span>{data.run.title}</span>;
      },
    },
  ],
};
export { registration };
