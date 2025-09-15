"use client";
import { getResultsByRunId } from "@/actions/results";
import React, { useMemo, useRef, useState } from "react";
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
import { getCategoryResultsOptions, getSearchOptions } from "@/actions/runs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Form from "@/components/form/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Paginator from "@/components/paginator/paginator";

type Filter = {
  runId: number;
  search?: string;
  category?: string;
  page: number;
};

export default function Results() {
  const params = useParams();
  const filter = useRef<Filter>({ runId: Number(params.id), page: 1 });
  const [query, setQuery] = useState('');

  const {
    data: response,
    refetch,
  } = useQuery({
    queryKey: ["getResultsByRunId"],
    queryFn: () => getResultsByRunId(filter.current),
    initialData: { data: [], count: 0 },
  });

  const { data, count } = response;

  const {
    data: options = [],
    refetch: refetchSearchOptions,
  } = useQuery({
    queryKey: ["getSearchOptions"],
    queryFn: () => getSearchOptions(Number(params.id), query),
  });

  const {
    data: categories = [],    
  } = useQuery({
    queryKey: ["getCategoryOptions"],
    queryFn: () => getCategoryResultsOptions(Number(params.id)),
  });  

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
      type: "combobox",
      //className: "w-md",
      onChange: (value: string) => {
        filter.current = {
          ...filter.current,
          search: value === "" ? undefined : value,
        };
        refetch();
      },
      onInputChange: (value) => {
        setQuery(value);
        refetchSearchOptions();
      },
      placeholder: "Hladaj meno ...",
      options,
    },
  ];

  const setCategoryFilter = (category: string) => {
    filter.current = {
      ...filter.current,
      category,
    };
    refetch();
  };

  return (
    <Card className=" bg-white p-6 border-t-4 rounded-md border-t-green-700">
      <CardContent>
        <div className="text-center">
          <h2 className="text-3xl justify-center -ml-5 flex gap-3 items-center font-bold tracking-tight text-text-primary">
            <Image width={70} height={70} alt="" src="/images/runner.jpg" />{" "}
            Secovska desiatka
          </h2>
          <p className="mt-3 border-t border-gray-400 border-b mb-4 text-lg text-text-secondary">
            Vysledky behu
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Form fields={fields}>
            {({ fields }) => (
              <div>
                <div className="flex gap-1">
                  <div className="flex-1 flex gap-3 items-center">
                    <label>Hladaj meno</label>
                    {fields.search}
                  </div>
                </div>
              </div>
            )}
          </Form>

          <ToggleGroup className="my-4" variant="outline" type="single">
            {categories.map((category) => (
              <ToggleGroupItem
                className="px-3"
                key={category.value}
                value={category.value}
                onClick={() => setCategoryFilter(category.value)}
              >
                {category.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
            {data.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-medium">{result.rank}</TableCell>
                <TableCell className="font-medium">{result.category}</TableCell>
                {/*<TableCell className="font-medium">{result.bib}</TableCell>*/}
                <TableCell className="font-medium">{result.name}</TableCell>
                <TableCell className="font-medium">
                  {result.yearOfBirth}
                </TableCell>
                <TableCell className="font-medium">{result.club}</TableCell>
                <TableCell className="font-medium">{result.gender}</TableCell>
                <TableCell className="font-medium">
                  {new Date(result.time * 1000).toISOString().slice(11, 19)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end">
          <Paginator
            currentPage={filter.current.page}
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
