"use client";
import { createRegistration, getCategoryOptions } from "@/actions/runs";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
//import { Card, CardContent } from "@/components/ui/card";
import { Registration } from "@/generated/prisma";
import { FormField } from "@/types/resources";
import { CreateRegistration } from "@/validation";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function Register() {
  const params = useParams();

  const {
    data: categories = [],
    //isLoading: isRegionsLoading,
  } = useQuery({
    queryKey: ["getCategoryOptions"],
    queryFn: () => getCategoryOptions(Number(params.id)),
  });

  const fields: FormField[] = [
    { name: "runId", type: "hidden" },
    { name: "firstName", label: "Meno", type: "text" },
    { name: "lastName", label: "Priezvisko", type: "text" },
    {
      name: "gender",
      type: "select",
      label: "Pohlavie",
      options: [
        { label: "Man", value: "MALE" },
        { label: "Woman", value: "FEMALE" },
      ],
    },
    { name: "dateOfBirth", type: "date-picker", label: "Datum narodenia" },
    { name: "email", type: "text", label: "Email" },

    { name: "nation", type: "text", label: "Narodnost" },
    { name: "club", type: "text", label: "Klub" },
    {
      name: "category",
      type: "select",
      label: "Kategoria",
      options: categories,
    },
    { name: "city", type: "text", label: "Mesto" },
    //{ name: "phone", type: "text", label: "Telefonne cislo" },
    { name: "note", type: "textarea", label: "Poznamka (Nepovinne)", rows: 4 },
  ]
    .map(
      (f) =>
        ({
          ...f,
          className: "!h-[50px]",
        } as FormField)
    )
    .concat([{ name: "confirm", type: "checkbox" }]);

  const test = () => {
    toast("Dakujeme za registraciu", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
    });
  };

  const sendRegistration = async (data: Registration) => {
    await createRegistration(data);
    test();
    return {};
  };

  return (
    <Card className=" bg-white p-6 border-t-4 rounded-md border-t-green-700">
      <CardContent>
        <div className="text-center">
          <h2 className="text-3xl justify-center -ml-5 flex gap-3 items-center font-bold tracking-tight text-text-primary">
            <Image width={70} height={70} alt="" src="/images/runner.jpg" />{" "}
            Secovska desiatka
          </h2>
          <p className="mt-3 mb-6 border-t border-gray-400 border-b mb-4 text-lg text-text-secondary">
            Prosim vyplnte nasledovny formular pre registraciu.
          </p>
        </div>

        <Form<Registration>
          fields={fields}
          validation={CreateRegistration}
          data={{ runId: Number(params.id) }}
          action={sendRegistration}
        >
          {({ fields }) => (
            <div>
              <div className="flex flex-col gap-4 pb-4">
                {fields.firstName}
                {fields.lastName}
                <div className="flex gap-3">
                  <div className="flex-1">{fields.gender}</div>
                  <div className="flex-1">{fields.dateOfBirth}</div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">{fields.category}</div>
                  <div className="flex-1">{fields.nation}</div>
                </div>
                {fields.email}
                <div className="flex gap-3">
                  <div className="flex-1">{fields.club}</div>
                  <div className="flex-1">{fields.city}</div>
                </div>
                {fields.phone}
                {fields.note}
                <div className="mt-3 flex items-start gap-3 text-lg">
                  {fields.confirm}
                  <p className="-mt-2">
                    Potvrdzujem, že súhlasím so všeobecnými podmienkami
                    webstránky www.behportal.sk a so spracovaním osobných
                    údajov.
                  </p>
                </div>
                <Button size="lg" className="h-[50px] font-bold" type="submit">
                  Registrovat sa
                </Button>
              </div>
            </div>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
