import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      image: string;
      name: string;
      // Add other user properties if needed
    };
  }
}
