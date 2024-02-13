"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { newPasswordAndName } from "@/actions/new-password-and-name";
import { useSearchParams } from "next/navigation";
import { NewPasswordAndNameSchema } from "@/schemas";

export const NewPasswordAndNameForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordAndNameSchema>>({
    resolver: zodResolver(NewPasswordAndNameSchema),
    defaultValues: {
      name: "",
      password: "",
      token: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordAndNameSchema>) => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("A valid token is required to complete your profile.");
      return; // Ensure this condition correctly identifies missing tokens
    }

    // Ensure token is included in the submission data
    const submissionData = {
      ...values,
      token: token, // Append the token to the values object
    };

    startTransition(() => {
      newPasswordAndName(submissionData)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        .catch((error) => {
          setError("An error occurred while updating your profile.");
          console.error("Error in newPasswordAndName:", error);
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Complete Your Profile"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      {success ? (
        <>
          <FormSuccess message={success} />
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Max Mustermann"
                      type="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} typeof="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
