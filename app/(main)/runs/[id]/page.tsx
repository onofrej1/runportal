"use client";
import { getRunById } from "@/actions/runs";
//import FileUploader from "@/components/fileUploader";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { hmsToSeconds, parseCsv } from "@/lib/utils";
import { createResults } from "@/actions/results";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UploadDialog from "@/components/uploadDialog";
import { H3 } from "@/components/typography";

type CsvData = {
  rank: number;
  bib: number;
  name: string;
  category: string;
  club: string;
  time: number;
  timeHms: string;
  gender: string;
  runId: number;
  yearOfBirth: number;
};

export default function Run() {
  const { id } = useParams();
  const [uploadData, setUploadData] = useState<CsvData[]>();
  const { data: run, isFetching } = useQuery({
    queryKey: ["getRunById"],
    queryFn: () => getRunById(Number(id)),
  });
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  if (isFetching || !run) return;

  const fileUpload = (files: File[]) => {
    //const { file } = data;
    const file = files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("myFile", file, file.name);
    const formObject = Object.fromEntries(formData.entries());
    const reader = new FileReader();

    reader.onload = function (e: any) {
      const content = e.target.result;
      const requiredHeaders = [
        "rank",
        "bib",
        "name",
        "category",
        "time",
        "club",
        "gender",
        "yearOfBirth",
      ];
      const csvData = parseCsv(content, requiredHeaders);
      setUploadData(csvData);
      setIsUploadDialogOpen(false);
    };
    reader.readAsText(formObject["myFile"] as Blob);
  };

  /*const headers = [
    { name: "name", header: "Name" },
    { name: "time", header: "Time" },
    { name: "rank", header: "Rank" },
  ];*/

  const saveResults = () => {
    if (uploadData && uploadData?.length > 0) {
      const data: CsvData = uploadData.map((data) => {
        data.runId = Number(id);
        data.time = hmsToSeconds(data.timeHms);
        return data;
      });
      createResults(data);
    }
  };

  console.log(uploadData);

  return (
    <div>
      Run {run.title} {run.distance} km Upload results
      {/*<FileUploader onChange={fileUpload} />*/}
      <Button onClick={() => setIsUploadDialogOpen(true)}>
        Upload results
      </Button>
      <UploadDialog
        onChange={fileUpload}
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
      <H3>Upload data</H3>
      {uploadData && uploadData.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Poradie</TableHead>
              <TableHead>Št. číslo</TableHead>
              <TableHead>Categória</TableHead>
              <TableHead>Meno</TableHead>
              <TableHead>Rok nar.</TableHead>
              <TableHead>Klub</TableHead>
              <TableHead>Pohlavie</TableHead>
              <TableHead>Čas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadData.map((data) => (
              <TableRow key={data.rank}>
                <TableCell>{data.rank}</TableCell>
                <TableCell>{data.bib}</TableCell>
                <TableCell>{data.category}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.yearOfBirth}</TableCell>
                <TableCell>{data.club}</TableCell>
                <TableCell>{data.gender}</TableCell>
                <TableCell>{data.timeHms}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button onClick={saveResults}>Save results</Button>
    </div>
  );
}
