"use client";
import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationSchema, EmailTextareaSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Info } from "lucide-react";

const createSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const OrganizationList = () => {
  const [organizationCreated, setOrganizationCreated] = useState(false);
  const [emailsAddedSuccess, setEmailsAddedSuccess] = useState(false);

  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [slugUrl, setSlugUrl] = useState("");

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

  useEffect(() => {
    const subscription = formOrg.watch((value, { name }) => {
      if (name === "organizationName") {
        // Ensure value.organization is treated as a string, even if it's undefined
        const organizationName = value.organizationName || "";
        const newSlug = createSlug(organizationName);
        setSlugUrl(newSlug);
        // Optionally, directly set the slug value in the form if needed for submission
        formOrg.setValue("slug", newSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [formOrg]);

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

    const response = await addEmailsToOrganization(submissionData);
    if (response.error) {
      setError(response.error);
    } else if (response.success) {
      setSuccess(response.success);
      formEmails.reset(); // Reset the form to clear the textarea
      setEmailsAddedSuccess(true);
    }
  };

  return (
    <CardWrapper
      headerLabel={
        emailsAddedSuccess ? "Emails succesfully added to organization" :
        organizationCreated
          ? "Step 2: Add Your Email / Invite Members"
          : "Step 1: Create Your Organization"
      }
      backButtonLabel="Already have an organization?"
      backButtonHref="/auth/login"
    >
      {emailsAddedSuccess ? (
        <div className="text-center p-4">
          <p>Check your email and verify your profile.</p>
        </div>
      ) : !organizationCreated ? (
        <Form {...formOrg}>
          <form
            onSubmit={formOrg.handleSubmit(onSubmitOrganization)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={formOrg.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Muster GmbH"
                        onChange={(e) => {
                          // Handle the organization name input change
                          const newSlug = createSlug(e.target.value); // Generate the slug based on input
                          setSlugUrl(newSlug); // Update the slug state
                          formOrg.setValue("slug", newSlug, {
                            shouldValidate: true,
                          }); // Optionally set the slug value in form
                          field.onChange(e); // Ensure the original handler is called
                        }}
                        type="text" // Changed to "text" if "organization" type was a typo
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Display the generated slug URL */}
              <FormItem>
                <FormLabel>Slug-URL</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your individual organization URL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input
                    value={slugUrl} // Display the generated slug URL
                    disabled={true} // Make the input disabled
                    placeholder="muster-gmbh"
                    type="text" // Assuming it's just a text type for display
                  />
                </FormControl>
              </FormItem>
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
