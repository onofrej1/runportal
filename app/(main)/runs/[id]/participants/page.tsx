"use client";
import { getRegistrations } from "@/actions/results";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FormField } from "@/types/resources";
import { getCategoryOptions } from "@/actions/runs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Form from "@/components/form/form";
import { Check } from "lucide-react";

export default function Results() {
  const params = useParams();

  const {
    data = [],
    //isLoading: isRegionsLoading,
  } = useQuery({
    queryKey: ["getResultsByRunId"],
    queryFn: () => getRegistrations(Number(params.id)),
  });

  const {
    data: categories = [],
    //isLoading: isRegionsLoading,
  } = useQuery({
    queryKey: ["getCategoryOptions"],
    queryFn: () => getCategoryOptions(Number(params.id)),
  });

  console.log(categories);

  const headers = [
    { name: "rank", header: "Rank" },
    { name: "category", header: "Category" },
    //{ name: "bib", header: "Bib" },
    { name: "name", header: "Name" },
    { name: "yearOfBirth", header: "Born" },
    { name: "club", header: "Club" },
    { name: "gender", header: "Gender" },
    { name: "time", header: "Time" },
  ];

  const fields: FormField[] = [
    {
      name: "search",
      type: "text",
      className: "w-md",
      placeholder: "Hladaj meno ...",
    },
    {
      name: "paid",
      type: "select",
      placeholder: "Platba",
      className: "w-auto",
      options: [
        { label: "All statuses", value: "all" },
        { label: "Zaplatene", value: "yes" },
        { label: "Nezaplatene", value: "no" },
      ],
    },
    {
      name: "category",
      type: "select",
      placeholder: "Kategoria",
      className: "w-auto",
      options: categories.concat([{ label: "All categories", value: "all" }]),
    },
  ].map(
    (f) =>
      ({
        ...f,
        className: f.className + " !h-[40px]",
      } as FormField)
  );

  return (
    <Card className=" bg-white p-6 border-t-4 rounded-md border-t-green-700">
      <CardContent>
        <div className="text-center">
          <h2 className="text-3xl justify-center -ml-5 flex gap-3 items-center font-bold tracking-tight text-text-primary">
            <Image width={70} height={70} alt="" src="/images/runner.jpg" />{" "}
            Secovska desiatka
          </h2>
          <p className="mt-3 border-t border-gray-400 border-b mb-4 text-lg text-text-secondary">
            Zoznam registrovanych bezcov
          </p>
        </div>

        <div className="my-5 borderxx border-dashed border-gray-400 p-5x">
          <Form
            fields={fields}
            data={{ category: 'all', paid: 'all' }}
            //data={{ runId: Number(params.id) }}
            //action={sendRegistration}
          >
            {({ fields }) => (
              <div>
                {
                  <div className="flex gap-1">
                    <div className="flex-1 flex gap-3 items-center">
                      {fields.search}
                    </div>
                    {fields.category}
                    {fields.paid}
                  </div>
                }
              </div>
            )}
          </Form>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header.header} className="w-[100px]">
                  {header.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell className="font-medium"></TableCell>
                <TableCell className="font-medium">{reg.category}</TableCell>
                {/*<TableCell className="font-medium">{result.bib}</TableCell>*/}
                <TableCell className="font-medium">
                  {reg.lastName} {reg.firstName}
                </TableCell>
                <TableCell className="font-medium">
                  {reg.dateOfBirth.getFullYear()}
                </TableCell>
                <TableCell className="font-medium">{reg.club}</TableCell>
                <TableCell className="font-medium">{reg.gender}</TableCell>
                <TableCell className="font-medium">
                  {reg.paid ? <Check /> : <Check />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
