import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    company: z.optional(z.string()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Old Password is required!",
      path: ["password"],
    }
  );

export const LoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Must be a string",
    })
    .email({
      message: "Please enter your e-mail address",
    }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of six characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const RegisterSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Must be a string",
    })
    .email({
      message: "Please enter your e-mail address",
    }),
  password: z.string().min(6, {
    message: "Minimum of six characters required",
  }),

  name: z.string().min(1, {
    message: "Please provide a name",
  }),
  company: z.optional(z.string()),
});

export const UserListSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  company: z.string() || undefined,
});

export const DeleteUserSchema = z.object({
  id: z.string(),
});

export const OrganizationSchema = z.object({
  organizationName: z.string().min(1, "Please provide a company name"),
  slug: z.string(),
});

export const EmailSubmissionSchema = z.object({
  organizationId: z.string(),
  emails: z.array(z.object({
    email: z.string().email(),
  })).min(1, "At least one email is required."),
});

export const EmailTextareaSchema = z.object({
  emailsText: z.string().refine((value) => {
    // Split by commas or spaces into an array and validate each part as an email.
    const emails = value.split(/[\s,]+/).filter(Boolean); // Split and remove empty strings
    return emails.every(email => z.string().email().safeParse(email).success);
  }, {
    message: "Please enter valid email addresses, separated by commas or spaces.",
  }),
});

export const NewPasswordAndNameSchema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  token: z.string(), // Ensure this is included and matches the server's expectations
});

// Assuming this schema is adjusted to include `name` and `password` for updates
export const UpdateUserSchema = z.object({
  token: z.string(),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});