"use client";
import { createRegistration } from "@/actions/runs";
import Form from "@/components/form/form";
import { H3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Registration } from "@/generated/prisma";
import { FormField } from "@/types/resources";
import { CreateRegistration } from "@/validation";
import { useParams } from "next/navigation";
import React from "react";

export default function Register() {
  const params = useParams();

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
    { name: "city", type: "text", label: "Mesto" },
    { name: "phone", type: "text", label: "Telefonne cislo" },
    { name: "confirm", type: "checkbox", label: "Confirm submit" },
  ].map(f => ({
    ...f,
    className: 'h-[40px]',
  } as FormField));

  const sendRegistration = async (data: Registration) => {
    await createRegistration(data);
    return {};
  };

  return (
    <Card>
      <CardContent>
        <H3 className="mb-6">Registracia ucastnika</H3>
        <Form<Registration>
          fields={fields}
          validation={CreateRegistration}
          data={{ runId: Number(params.id) }}
          action={sendRegistration}
        >
          {({ fields }) => (
            <div>
              <div className="flex flex-col gap-3 pb-4">
                {fields.firstName}
                {fields.lastName}
                <div className="flex gap-3">
                  <div className="flex-1">{fields.gender}</div>
                  <div className="flex-1">{fields.dateOfBirth}</div>
                </div>
                {fields.email}
                {fields.nation}
                <div className="flex gap-3">
                  <div className="flex-1">{fields.club}</div>
                  <div className="flex-1">{fields.city}</div>
                </div>
                {fields.phone}
                <Button size='lg' type="submit">Registrovat sa</Button>
              </div>
            </div>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
