import { Run, RunResult } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { ManageResults } from "@/validation";

const runResult: Resource = {
  name: "Result",
  name_plural: "Results",
  model: "runResult",
  resource: "runResults",
  menuIcon: "",
  rules: ManageResults,
  form: [
    { name: "rank", type: "number", label: "Rank" },
    { name: "bib", type: "text", label: "Bib" },
    { name: "name", type: "text", label: "Name" },
    { name: "category", type: "text", label: "Category" },
    { name: "gender", type: "select", label: "Gender", options: [
        { value: 'MALE', label: 'Male'},
        { value: 'FEMALE', label: 'Female'},
    ]},
    { name: "yearOfBirth", type: "number", label: "Year of birth" },
    { name: "club", type: "text", label: "Club" },    
    { name: "time", type: "text", label: "Time" },    
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
  ],
  list: [
    { name: "rank", header: "Rank" },    
    { name: "name", header: "Name" },
    { name: "gender", header: "Gender" },
    { name: "yearOfBirth", header: "Year of birth" },
    { name: "club", header: "Club" },
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
        const data = row.original as RunResult & { run: Run };        
        return <span>{data.run.title}</span>;
      },      
    },  
    { name: "time", header: "Time" },  
  ],
};
export { runResult };
