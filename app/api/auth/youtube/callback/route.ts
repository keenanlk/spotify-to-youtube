import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";
import { getAuthClient, getChannel, getTokens } from "@/app/lib/youtube-client";
import prisma from "@/app/lib/prisma";
import { OAuth2Client } from "google-auth-library";

async function handler(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Bad Request", { status: 400 });
  }

  const { tokens } = await getTokens(code);

  if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
    return new Response("Bad Request", { status: 400 });
  }

  const authClient = new OAuth2Client(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  authClient.setCredentials(tokens);

  const channel = await getChannel(authClient);

  const existingService = await prisma.youTubeService.findFirst({
    where: { userId: session.user.id, channelId: channel?.id || "" },
  });

  const service = await prisma.youTubeService.upsert({
    where: { id: existingService?.id || "" },
    create: {
      userId: session.user.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpires: Math.floor(tokens.expiry_date / 1000),
      channelId: channel?.id || "",
      image: channel?.snippet?.thumbnails?.default?.url || "",
      name: channel?.snippet?.title || "",
    },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpires: Math.floor(tokens.expiry_date / 1000),
      channelId: channel?.id || "",
      image: channel?.snippet?.thumbnails?.default?.url || "",
      name: channel?.snippet?.title || "",
    },
  });

  return Response.redirect(`http://localhost:3000/`);
}

export { handler as GET, handler as POST };
