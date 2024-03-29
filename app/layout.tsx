import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthHandler from "@/app/components/auth-handler";
import { ConversionsContextProvider } from "@/app/providers/conversions-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import UserSessionProvider from "@/app/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <html lang="en">
      <body className={inter.className}>
        {!session ? (
          <AuthHandler />
        ) : (
          <UserSessionProvider>
            <QueryProvider>
              <ConversionsContextProvider>
                {children}
              </ConversionsContextProvider>
            </QueryProvider>
          </UserSessionProvider>
        )}
      </body>
    </html>
  );
}
