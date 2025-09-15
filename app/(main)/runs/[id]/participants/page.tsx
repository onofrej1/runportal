"use client";
import { getRegistrations } from "@/actions/results";
import React, { useCallback, useMemo, useRef } from "react";
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
import { SquareCheck } from "lucide-react";
import Paginator from "@/components/paginator/paginator";

type Filter = {
  runId: number;
  search?: string;
  categoryId?: number;
  status?: boolean;
  page?: number;
};

export default function Results() {
  const params = useParams();
  const filter = useRef<Filter>({ runId: Number(params.id) });

  const {
    data: response,
    refetch,    
    //isLoading: isRegionsLoading,
  } = useQuery({
    queryKey: ["getResultsByRunId", filter.current],
    refetchOnWindowFocus: false,
    queryFn: () => getRegistrations(filter.current),
    initialData: { data: [], count: 0 },
  });

  const { data, count } =  response;

  const names = useMemo(() => data.map(value => {
    return (
      { label: value.firstName+' '+value.lastName, value: value.id }
    )
  }), [data]);

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
    { name: "categoryId", header: "Kategoria" },
    //{ name: "bib", header: "Bib" },
    { name: "name", header: "Meno" },
    { name: "yearOfBirth", header: "Rok nar." },
    { name: "club", header: "Klub" },
    { name: "gender", header: "Muz/zena" },
    { name: "paid", header: "Platba" },
  ];

  const fields: FormField[] = useMemo(() => {
    return [
      {
        name: "search",
        type: "combobox",
        //className: "w-md",
        onChange: (value: string) => {
          //console.log(value);
          filter.current = {
            ...filter.current,
            search: value === "" ? undefined : value,
          };
          refetch();
        },
        placeholder: "Hladaj meno ...",
        options: names,
      },
      {
        name: "paid",
        type: "select",
        placeholder: "Platba",
        onChange: (value: string) => {
          filter.current = {
            ...filter.current,
            status: value === "yes" ? true : value === 'all' ? undefined : false,
          };
          refetch();
        },
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
        onChange: (value: string) => {
            filter.current = {
            ...filter.current,
            categoryId: value === "all" ? undefined : Number(value),
          };
          refetch();
        },
        placeholder: "Kategoria",
        className: "w-auto",
        options: categories,
      },
    ].map(
      (f) =>
        ({
          ...f,
          className: f.className + " !h-[40px]",
        } as FormField)
    );
  }, [categories, names, refetch]);

  //if (isFetching) return null;
  console.log("render");

  const MemoForm = useMemo(
    () => (
      <Form
        fields={fields}
        data={{ category: "all", paid: "all" }}
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
    ),
    [fields]
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
          {MemoForm}
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
                <TableCell className="font-medium">{reg.id}</TableCell>
                <TableCell className="font-medium">
                  {reg.category?.category}
                </TableCell>
                {/*<TableCell className="font-medium">{result.bib}</TableCell>*/}
                <TableCell className="font-medium">
                  {reg.lastName} {reg.firstName}
                </TableCell>
                <TableCell className="font-medium">
                  {reg.dateOfBirth.getFullYear()}
                </TableCell>
                <TableCell className="font-medium">{reg.club}</TableCell>
                <TableCell className="font-medium">{reg.gender}</TableCell>
                <TableCell className="font-medium justify-center">
                  {!reg.paid ? (
                    "[pending]"
                  ) : (
                    <SquareCheck className="bg-green-700 text-white" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end">
          <Paginator
            currentPage={filter.current.page || 0}
            totalPages={count}
            onPageChange={(page) => {
              filter.current = { ...filter.current, page };
              refetch();
            }}
            showPreviousNext
          />
        </div>
      </CardContent>
    </Card>
  );
}
