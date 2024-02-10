"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useConversions } from "@/app/providers/conversions-provider";

export default function Home() {
  const { data: session } = useSession();
  const { youtubeService } = useConversions();

  if (!session?.user) {
    return <h1>Loading</h1>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <div className="flex flex-wrap justify-center space-x-12">
        <div className="border rounded-md p-4">
          <h1 className="text-3xl font-bold">Spotify</h1>
          <div className="mt-4 flex items-center">
            <div className="rounded-full overflow-hidden w-20 h-20 mr-4">
              <Image
                src={session?.user?.image || ""}
                alt="user profile image"
                layout="responsive"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{session?.user?.name}</h3>
              <p className="text-green-600 font-semibold">Connected</p>
            </div>
          </div>
        </div>

        {youtubeService ? (
          <div className="border rounded-md p-4">
            <h1 className="text-3xl font-bold">YouTube</h1>
            <div className="mt-4 flex items-center">
              <div className="rounded-full overflow-hidden w-20 h-20 mr-4">
                <Image
                  src={youtubeService.image}
                  alt="user profile image"
                  layout="responsive"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{youtubeService.name}</h3>
                <p className="text-green-600 font-semibold">Connected</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Link href={"api/auth/youtube/connect"} className="text-blue-600">
              Connect to YouTube
            </Link>
          </div>
        )}
      </div>

      <div className="text-center pt-12">
        <Link href={"/new"}>
          <span className="text-blue-600 font-bold">Next</span> Select a
          playlist
        </Link>
      </div>
    </main>
  );
}
