"use server";

import { Playlist, PlaylistedTrack } from "@spotify/web-api-ts-sdk";
import { addVideoToPlaylist, createYoutubePlaylist } from "@/app/lib/youtube";
import { getAuthClient } from "@/app/lib/youtube-client";
import { youtube } from "@googleapis/youtube/index";
import { getUserId } from "@/app/lib/session";
import prisma from "@/app/lib/prisma";
import { getYoutubeClient } from "@/app/lib/youtube-client";

export async function findConversion(spotifyPlaylistId: string) {
  const userId = await getUserId();

  const conversion = await prisma.conversions.findUnique({
    where: { spotifyPlaylistId_userId: { spotifyPlaylistId, userId } },
  });
  return conversion;
}

export async function getConversionItems(conversionId: string) {
  const userId = await getUserId();

  const items = await prisma.conversionItems.findMany({
    where: { conversionId },
  });

  return items;
}

export async function createConversion(playlist: Playlist) {
  const youtubePlaylist = await createYoutubePlaylist(
    playlist.name,
    playlist.description
  );

  const userId = await getUserId();
  const conversion = await prisma.conversions.create({
    data: {
      spotifyPlaylistId: playlist.id,
      youtubePlaylistId: youtubePlaylist.id || "",
      userId,
      title: playlist.name,
      description: playlist.description,
    },
  });

  return { conversion, youtubePlaylist };
}

export async function convert(
  spotifySongs: PlaylistedTrack[],
  playlistName: string
) {
  const authClient = await getAuthClient();
  const youtubeClient = youtube({
    version: "v3",
    auth: authClient,
  });
  const playlist = await youtubeClient.playlists.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        title: playlistName,
      },
    },
  });

  for (const song of spotifySongs) {
    const search = await youtubeClient.search.list({
      part: ["snippet"],
      q: `${song.track.name} ${
        "artists" in song.track && song.track.artists[0].name
      }`,
      maxResults: 1,
    });
    await youtubeClient.playlistItems.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          playlistId: playlist.data?.id,
          resourceId: {
            kind: search.data?.items?.[0].id?.kind,
            videoId: search.data?.items?.[0].id?.videoId,
          },
        },
      },
    });
  }
}

export async function convertTrack(
  spotifyTrack: PlaylistedTrack,
  youtubePlaylistId: string,
  conversionId: string
) {
  const userId = await getUserId();
  const youtubeClient = await getYoutubeClient();
  const search = await youtubeClient.search.list({
    part: ["snippet"],
    q: `${spotifyTrack.track.name} ${
      "artists" in spotifyTrack.track && spotifyTrack.track.artists[0].name
    }`,
    maxResults: 1,
  });
  const video = search.data?.items?.[0];

  if (!video) {
    throw new Error("Could not find video");
  }

  await addVideoToPlaylist(video.id?.videoId || "", youtubePlaylistId);

  try {
    const conversionItem = await prisma.conversionItems.create({
      data: {
        conversionId,
        spotifyTrackId: spotifyTrack.track.id,
        youtubeVideoId: video.id?.videoId || "",
        userId,
        spotifyTitle: spotifyTrack.track.name,
        youtubeTitle: video.snippet?.title || "",
      },
    });
    return conversionItem;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
