"use client";
import { getRunById } from "@/actions/runs";
//import FileUploader from "@/components/fileUploader";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

//import { H1, H2, H3 } from "@/components/typography";
import {
  ExternalLink,
  MapPin,
  Mountain,
  RulerDimensionLine,
  TreePine,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
//import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Run() {
  const { id } = useParams();
  const { data: run, isFetching } = useQuery({
    queryKey: ["getRunById"],
    queryFn: () => getRunById(Number(id)),
  });
  console.log(run);
  if (isFetching || !run) return;

  return (
    <Card className="flex mb-6 p-0 border-t-green-700 border-t-4">
      <CardContent className="flex pr-0">
        <div className="max-w-3xl p-6 flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Coastal Marathon
          </h1>
          <p className="mt-2 text-base text-slate-500">
            San Francisco, CA · Saturday, August 12, 2023
          </p>

          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-slate-200 py-6 sm:grid-cols-2">
            <div className="flex gap-3 items-center">
              <RulerDimensionLine size={16} color="#000000" />
              <div>
                <div className="text-sm text-slate-500">Vzdialenost</div>
                <span className="text-lg font-bold text-slate-800">
                  {Number((run.distance / 1000).toFixed(1))}Km
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Mountain size={16} color="#000000" />
              <div>
                <div className="text-sm text-slate-500">Prevysenie</div>
                <span className="text-lg font-bold text-slate-800">
                  {run.elevation}m
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <TreePine size={16} color="#000000" />
              <div>
                <div className="text-sm text-slate-500">Povrch</div>
                <span className="text-lg font-bold text-slate-800">
                  {run.surface}
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <MapPin size={16} color="#000000" />
              <div>
                <div className="text-sm text-slate-500">Lokalita</div>
                <span className="text-lg font-bold text-slate-800">
                  {run.event.location?.location}
                  {/*run.event.location?.district.region.region*/}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mt-6 text-xl font-bold text-slate-800">
              Startovne
            </h3>
            <ul className="space-y-0.5">
              {run.runEntryFees.map(entryFee => <li key={entryFee.id}>
                Registracia do <span className="font-bold">{formatDate(entryFee.registerDate, 'dd.MM.yyyy')}</span> - <Badge variant={'outline'} className="font-bold">{entryFee.entryFee},- EUR</Badge></li>)}
            </ul>
            <h3 className="mt-6 text-xl font-bold text-slate-800">Kategorie</h3>
            <p>Kategorie su dostupne na stranke usporiadatela</p>
            <h3 className="mt-6 text-xl font-bold text-slate-800">
              Program behu
            </h3>
            <p>Informacie su dostupne na stranke usporiadatela</p>
            <div className="mt-2 flex gap-1">
              <Button size={"lg"}>Propozicie</Button>
              <Button size={"lg"}>
                Registracia
                <ExternalLink />
              </Button>
            </div>
            {/*<h3 className="mt-6 text-xl font-bold text-slate-800">Pravidla</h3>
            <p>
              Preteká sa podľa pravidiel atletických súťaží atletického zväzu
            </p>

            <h3 className="mt-6 text-xl font-bold text-slate-800">Poistenie</h3>
            <p>
              Všetci účastníci sú povinní zabezpečiť si individuálne zdravotné
              poistenie (postačujúce je štandardné všeobecné zdravotné
              poistenie, kryté niektorou z poisťovní). Organizátor nepreberá
              zodpovednosť za škody na majetku alebo na zdraví súvisiace s
              cestou, pobytom a s účasťou pretekárov na podujatí.Každý účastník
              štartuje na vlastnú zodpovednosť a zodpovedá za svoj zdravotný
              stav v akom nastupuje na štart a zúčastňuje sa podujatia.
            </p>
            {/*<div className="mt-4 border-t border-slate-200">
              <dl className="divide-y divide-slate-200">
                <div className="grid grid-cols-3 gap-4 px-0 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    6:00 AM - 7:30 AM
                  </dt>
                  <dd className="col-span-2 mt-0 text-sm text-slate-900">
                    Packet Pickup &amp; Registration
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-0 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    8:00 AM
                  </dt>
                  <dd className="col-span-2 mt-0 text-sm text-slate-900">
                    Race Start
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-0 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    8:00 AM
                  </dt>
                  <dd className="col-span-2 mt-0 text-sm text-slate-900">
                    Vyhodnotenie
                  </dd>
                </div>
              </dl>
            </div>*/}
            {/*<h3 className="mt-6 mb-3 text-xl font-bold text-slate-800">
              Odkaz na podujatie
            </h3>
            <p>Prejst na stranku s podujatim</p>*/}
          </div>
        </div>

        {/*<div className="flex-1">
          <Image
            src="/images/test.jpg"
            width={500}
            height={500}
            className="object-contain w-full h-full rounded-r-md"
            alt=""
          />
        </div>*/}
      </CardContent>
    </Card>
  );
}
