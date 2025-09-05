import { getResultsByRunId } from "@/actions/results";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultsProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string }>;
}
export default async function Results({ params }: ResultsProps) {
  const { id } = await params;
  const results = await getResultsByRunId(Number(id));
  const headers = [
    { name: "rank", header: "Rank" },
    { name: "category", header: "Category" },
    { name: "bib", header: "Bib" },
    { name: "name", header: "Name" },
    { name: "yearOfBirth", header: "Born" },
    { name: "club", header: "Club" },    
    { name: "gender", header: "Gender" },    
    { name: "time", header: "Time" },
  ];

  return (
    <div>
         
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
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.rank}</TableCell>              
              <TableCell className="font-medium">{result.category}</TableCell>
              <TableCell className="font-medium">{result.bib}</TableCell>
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell className="font-medium">{result.yearOfBirth}</TableCell>
              <TableCell className="font-medium">{result.club}</TableCell>
              <TableCell className="font-medium">{result.gender}</TableCell>
              <TableCell className="font-medium">{new Date(result.time * 1000).toISOString().slice(11, 19)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
