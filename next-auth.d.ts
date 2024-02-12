import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    company: string;
    organizationId: string;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}