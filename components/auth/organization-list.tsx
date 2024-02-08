"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationSchema, EmailTextareaSchema } from "@/schemas";
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
import { addEmailsToOrganization } from "@/actions/add-members";
import { Textarea } from "../ui/textarea";

export const OrganizationList = () => {
  const [organizationCreated, setOrganizationCreated] = useState(false);
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const formOrg = useForm<z.infer<typeof OrganizationSchema>>({
    resolver: zodResolver(OrganizationSchema),
  });

  const formEmails = useForm({
    resolver: zodResolver(EmailTextareaSchema),
    defaultValues: {
      emailsText: "",
    },
  });

  const onSubmitOrganization = async (
    values: z.infer<typeof OrganizationSchema>
  ) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await createOrg(values);
      if (response.error) {
        setError(response.error);
      } else if (response.success && response.organizationId) {
        setSuccess(response.success);
        setOrganizationCreated(true);
        setOrganizationId(response.organizationId); // Assuming your createOrg action correctly returns the organizationId
      }
    });
  };

  const onSubmitEmails = async (data: { emailsText: string }) => {
    setError("");
    setSuccess("");

    // Split the emailsText into an array and prepare for submission
    const emailsArray = data.emailsText.split(/[\s,]+/).filter(Boolean);
    const submissionData = {
      organizationId: organizationId,
      emails: emailsArray.map((email) => ({ email })),
    };

    console.log("Data sent to server:", submissionData);

    const response = await addEmailsToOrganization(submissionData);
    if (response.error) {
      setError(response.error);
    } else if (response.success) {
      setSuccess(response.success);
      formEmails.reset(); // Reset the form to clear the textarea
    }
  };

  return (
    <CardWrapper
      headerLabel={
        organizationCreated
          ? "Step 2: Add Emails to Organization"
          : "Step 1: Create Your Organization"
      }
      backButtonLabel="Already have an organization?"
      backButtonHref="/auth/login"
    >
      {!organizationCreated ? (
        <Form {...formOrg}>
          <form
            onSubmit={formOrg.handleSubmit(onSubmitOrganization)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={formOrg.control}
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
            <Button
              disabled={isPending}
              type="submit"
              className="mt-6 w-full"
              size="lg"
            >
              Create
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...formEmails}>
          <form
            onSubmit={formEmails.handleSubmit(onSubmitEmails)}
            className="space-y-6"
          >
            <Textarea
              {...formEmails.register("emailsText")}
              placeholder="Enter emails, separated by commas or spaces"
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="mt-6 w-full">
              Add Emails
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
