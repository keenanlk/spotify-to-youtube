"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { getYoutubeClient } from "@/app/lib/youtube-client";

export async function createYoutubePlaylist(name: string, description: string) {
  const youtubeClient = await getYoutubeClient();

  const { data } = await youtubeClient.playlists.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        title: name,
        description,
      },
    },
  });

  if (!data || !data.id) {
    throw new Error("Could not create YouTube playlist");
  }

  return data;
}

export async function getYoutubePlaylist(playlistId: string) {
  "use server";
  const youtubeClient = await getYoutubeClient();

  const { data } = await youtubeClient.playlists.list({
    part: ["snippet", "contentDetails"],
    id: [playlistId],
  });

  if (!data?.items?.[0]) {
    throw new Error("Could not find YouTube playlist");
  }
  return data.items[0];
}

export async function addVideoToPlaylist(videoId: string, playlistId: string) {
  const youtubeClient = await getYoutubeClient();

  await youtubeClient.playlistItems.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    },
  });
}

export async function getYoutubeService() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return prisma.youTubeService.findFirst({
    where: { userId: session.user?.id },
  });
}
