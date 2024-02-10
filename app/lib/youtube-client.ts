"use server";

import { OAuth2Client } from "google-auth-library";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { youtube } from "@googleapis/youtube/index";
import { youtube_v3 } from "@googleapis/youtube";

export type Schema$Playlist = youtube_v3.Schema$Playlist;

export async function getAuthorizeUrl() {
  const oAuth2Client = new OAuth2Client(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/youtube",
    prompt: "consent",
  });
}

export async function getTokens(code: string) {
  const oAuth2Client = new OAuth2Client(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  return oAuth2Client.getToken(code);
}

export async function getAuthClient() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const youtubeService = await prisma.youTubeService.findFirst({
    where: { userId: session.user.id },
  });

  if (!youtubeService) {
    throw new Error("No YouTube service found");
  }

  const oAuth2Client = new OAuth2Client(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    access_token: youtubeService.accessToken,
    refresh_token: youtubeService.refreshToken,
    expiry_date: youtubeService.tokenExpires * 1000,
  });

  return oAuth2Client;
}

export async function getChannel(authClient: OAuth2Client) {
  const youtubeClient = youtube({
    version: "v3",
    auth: authClient,
  });

  const channels = await youtubeClient.channels.list({
    part: ["snippet"],
    mine: true,
  });

  return channels?.data?.items?.[0];
}

export async function getYoutubeClient() {
  const authClient = await getAuthClient();
  return youtube({
    version: "v3",
    auth: authClient,
  });
}
