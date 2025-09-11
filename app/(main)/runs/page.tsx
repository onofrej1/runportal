"use client";
import { getRegionOptions, getRuns } from "@/actions/runs";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { FormField } from "@/types/resources";
import { useQuery } from "@tanstack/react-query";
import {
  Info,
  MapPin,
  Mountain,
  RulerDimensionLine,
  TreePine,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useMemo, useRef } from "react";

export default function Events() {
  const { data } = useSession();
  console.log(data);

  const filter = useRef<{
    dateFrom?: string;
    dateTo?: string;
    region?: string[];
  }>({});

  const {
    data: runs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getRuns"],
    queryFn: () => getRuns(filter.current),
  });

  console.log(runs);

  const {
    data: regions = [],
    //isLoading: isRegionsLoading,
  } = useQuery({
    queryKey: ["getRegions"],
    queryFn: () => getRegionOptions(),
  });

  const fields: FormField[] = useMemo(
    () => [
      //{ name: "name", type: "text", label: "Nazov podujatia" },
      {
        name: "region",
        type: "multiple-select",
        label: "Kraj",
        options: regions,
      },
      {
        name: "eventType",
        type: "multiple-select",
        label: "Typ sportu",
        options: [
          { value: "1", label: "Beh" },
          { value: "2", label: "Beh so psom" },
          { value: "3", label: "Nordic walking" },
          { value: "4", label: "Cyklistika" },
        ],
      },
      { name: "dateFrom", type: "date-picker", label: "Datum od" },
      { name: "dateTo", type: "date-picker", label: "Datum do" },
      { name: "locality", type: "text", label: "Lokalita" },
      {
        name: "distance",
        type: "range",
        min: 0,
        max: 100,
        label: "Dlzka trate",
      },
      {
        name: "elevation",
        type: "range",
        min: 0,
        max: 2000,
        label: "Prevysenie",
      },
    ],
    [regions]
  );

  const sendForm = useCallback(
    async (data: any) => {
      console.log("data", data);
      if (data.eventType && data.eventType.length > 0) {
        data.eventType = data.eventType.map((option: any) => option.value);
      } else {
        data.eventType = undefined;
      }

      if (data.region && data.region.length > 0) {
        data.region = data.region.map((option: any) => option.value);
      } else {
        data.region = undefined;
      }
      filter.current = data;
      refetch();
      return {};
    },
    [refetch]
  );

  const CalIcon = (date: Date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return (
      <div className="pt-2 min-w-16 bg-white p-3 font-medium">
        <div className="w-16 flex-none rounded-t text-center shadow-xl ">
          <div className="py-2 block rounded-t overflow-hidden  text-center ">
            <div className="py-1">{monthNames[date.getMonth()]}</div>
            <div className="pt-1 border-l border-r border-white bg-white">
              <span className="text-xl font-bold leading-tight">
                {date.getDate()}
              </span>
            </div>
            <div className="border-l border-r border-b rounded-b-lg text-center border-white bg-white -pt-2 -mb-1">
              <span className="text-sm">{weekdays[date.getDay()]}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MemoForm = useMemo(() => {
    console.log("rerender form");
    return (
      <Form fields={fields} action={sendForm}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.region}
              {fields.eventType}
              <div className="flex gap-2">
                <div className="flex-1">{fields.dateFrom}</div>
                <div className="flex-1">{fields.dateTo}</div>
              </div>
              <div className="mb-10">{fields.distance}</div>
              <div className="mb-10">{fields.elevation}</div>
              {fields.locality}

              <Button type="submit">Search</Button>
            </div>
          </div>
        )}
      </Form>
    );
  }, [fields, sendForm]);

  if (isLoading) return;
  console.log(runs);

  return (
    <div className="flex gap-6">
      <div>
        <div className="sidebar">
          <div className="max-w-sm p-6 border-t-green-700 border-t-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h5 className="mb-2 text-xl font-bold dark:text-white">
              Hladaj beh
            </h5>
            {MemoForm}
          </div>

          <div className="mt-2 max-w-sm p-6 border-t-green-700 border-t-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h5 className="mb-2 text-xl font-bold dark:text-white">
              Odber noviniek
            </h5>

            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
              <div className="relative w-full">
                <label
                  htmlFor="email"
                  className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Email address
                </label>
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-black border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div>We care about privacy policy</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {runs.map((run) => (
          <div
            key={run.id}
            className="w-full border border-gray-200 border-l-3 relative border-l-green-700 border-r-2 shadow-2xs rounded-xl"
          >
            <div className="flex items-center gap-6">
              <div>{CalIcon(run.event.startDate)}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{run.title}</h3>
                <div className="mt-2 flex gap-3 items-center">
                  <div className="flex gap-2 items-center">
                    <RulerDimensionLine size={16} color="#000000" />{" "}
                    {Number((run.distance / 1000).toFixed(1))}Km
                  </div>
                  <div className="flex gap-2 items-center">
                    <Mountain size={16} color="#000000" /> {run.elevation}m
                  </div>
                  <div className="flex gap-2 items-center">
                    <TreePine size={16} color="#000000" /> {run.surface}
                  </div>
                  <div className="flex gap-2 items-center">
                    <MapPin size={16} color="#000000" />
                    <span className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                      {run.event.location?.location}{' '}
                      ({run.event.location?.district.region.region})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/runs/${run.id}`}>
                  <Button variant={"ghost"} className="mt-2">
                    <Info /> Zobrazit viac
                  </Button>
                </Link>
                <Link href={`/runs/${run.id}/register`}>
                  <Button className="mt-2">Registrovat sa</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
