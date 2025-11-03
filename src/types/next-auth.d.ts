import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole; // ✅ Use UserRole enum type
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole; // ✅ Use UserRole enum type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole; // ✅ Use UserRole enum type
    id: string;
  }
}
