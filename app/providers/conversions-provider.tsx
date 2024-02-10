"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Page, Playlist, PlaylistedTrack } from "@spotify/web-api-ts-sdk";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { getPlaylistItems, getPlaylists } from "@/app/lib/spotify";
import { ConversionItems, Conversions, YouTubeService } from "@prisma/client";
import { getYoutubePlaylist, getYoutubeService } from "@/app/lib/youtube";
import {
  convertTrack,
  createConversion,
  findConversion,
  getConversionItems,
} from "@/app/lib/convert";
import { Schema$Playlist } from "@/app/lib/youtube-client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type ConversionsContextType = {
  spotifyPlaylists: Page<Playlist> | undefined;
  selectedPlaylist: Playlist | null;
  youtubeService?: YouTubeService | null;
  spotifyPlaylistsLoading: boolean;
  spotifyPlaylistsError: unknown;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  selectedPlaylistItems?: Page<PlaylistedTrack>;
  conversion?: Conversions | null;
  conversionItems?: ConversionItems[];
  youtubePlaylist?: Schema$Playlist;
  convertPageLoading: boolean;
  convert: (
    spotifyTrack: PlaylistedTrack,
    youtubePlaylistId: string,
    conversionId: string
  ) => void;
};

const conversionsContext = createContext<ConversionsContextType>({
  spotifyPlaylists: undefined,
  selectedPlaylist: null,
  youtubeService: undefined,
  spotifyPlaylistsLoading: false,
  spotifyPlaylistsError: undefined,
  setSelectedPlaylist: () => {},
  selectedPlaylistItems: undefined,
  convertPageLoading: false,
  convert: () => {},
});

export function ConversionsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const params = useParams();

  const {
    data: spotifyPlaylists,
    isLoading: spotifyPlaylistsLoading,
    error: spotifyPlaylistsError,
  } = useQuery("spotifyPlaylists", async () => getPlaylists());

  const { data: youtubeService, isLoading: youtubeServiceLoading } = useQuery(
    "youtubeService",
    async () => getYoutubeService()
  );

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );

  useEffect(() => {
    debugger;
    if (params?.playlistId) {
      const selectedPlaylist = spotifyPlaylists?.items.find(
        (playlist) => playlist.id === params.playlistId
      );
      setSelectedPlaylist(selectedPlaylist ?? null);
    }
  }, [params.playlistId, spotifyPlaylists]);

  const {
    data: conversion,
    isLoading: conversionLoading,
    refetch: refetchConversion,
  } = useQuery(["conversion", selectedPlaylist], async () => {
    debugger;
    if (!selectedPlaylist) {
      return;
    }
    let conversion = await findConversion(selectedPlaylist.id);

    if (!conversion) {
      const createResult = await createConversion(selectedPlaylist);
      conversion = createResult.conversion;
    }

    console.log(conversion);
    return conversion;
  });

  const {
    data: conversionItems,
    isLoading: conversionItemsLoading,
    refetch: refetchConversionItems,
  } = useQuery(["conversionItems", conversion], async () => {
    if (!conversion) {
      return;
    }
    return getConversionItems(conversion.id);
  });

  const { data: youtubePlaylist, isLoading: youtubePlaylistLoading } = useQuery(
    ["youtubePlaylist", conversion],
    async () => {
      if (!conversion) {
        return;
      }
      const playlist = await getYoutubePlaylist(conversion.youtubePlaylistId);
      return playlist;
    }
  );

  const {
    data: selectedPlaylistItems,
    isLoading: spotifyPlaylistItemsLoading,
    refetch: refetchPlaylistItems,
  } = useQuery(["spotifyPlaylistItems", selectedPlaylist], async () => {
    if (!selectedPlaylist) {
      return;
    }
    return getPlaylistItems(selectedPlaylist.id);
  });

  async function selectPlaylist(playlist: Playlist) {
    setSelectedPlaylist(playlist);
    refetchPlaylistItems();
  }

  async function convert(
    spotifyTrack: PlaylistedTrack,
    youtubePlaylistId: string,
    conversionId: string
  ) {
    await convertTrack(spotifyTrack, youtubePlaylistId, conversionId);
    refetchConversion();
    refetchConversionItems();
  }

  return (
    <conversionsContext.Provider
      value={{
        spotifyPlaylists,
        selectedPlaylist,
        setSelectedPlaylist,
        youtubeService,
        spotifyPlaylistsLoading,
        spotifyPlaylistsError,
        selectedPlaylistItems,
        conversion,
        conversionItems,
        youtubePlaylist,
        convert,
        convertPageLoading:
          spotifyPlaylistsLoading ||
          youtubeServiceLoading ||
          conversionLoading ||
          conversionItemsLoading ||
          youtubePlaylistLoading ||
          spotifyPlaylistItemsLoading,
      }}
    >
      {children}
    </conversionsContext.Provider>
  );
}

export function useConversions() {
  return useContext(conversionsContext);
}
