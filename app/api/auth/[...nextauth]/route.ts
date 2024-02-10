import NextAuth, {type Session, User} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/lib/prisma";

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "playlist-read-private user-read-email user-read-private",
          show_dialog: true,
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({session, user}: {session: Session, user: User}) {
      // Include the user ID in the session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
