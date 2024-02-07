"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { createOrg } from "@/actions/create-org";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { redirect, useSearchParams } from "next/navigation";


export const OrganizationList = () => {
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl")

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof OrganizationSchema>>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      organization: "",
    },
  });

  const onSubmit = (values: z.infer<typeof OrganizationSchema>) => {
    // clear messages before new submit
    setError("");
    setSuccess("");

    startTransition(() => {
      createOrg(values)
        .then((data) => {
          {
            form.reset();
            setError(data?.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            //redirect('/select-members')
          }
        })
        .catch(() => setError("Something went wrong - No Organization created!"));
        redirect('/select-members')
    });
  };

  return (
    <CardWrapper
      headerLabel="Create your organization"
      backButtonLabel="Already have an organization?"
      backButtonHref="/auth/login" //TO BE CHANGED
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Muster GmbH"
                      type="organization"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} typeof="submit" className="w-full">
            Create
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
