"use client";
import { getPlaylists, parseSpotifyError } from "@/app/lib/spotify";
import SpotifyPlaylists from "@/app/components/spotify-playlists";
import { useConversions } from "@/app/providers/conversions-provider";

export default function New() {
  const { spotifyPlaylists, spotifyPlaylistsLoading, spotifyPlaylistsError } =
    useConversions();

  if (spotifyPlaylistsLoading) {
    return <h1>Loading</h1>;
  }

  if (spotifyPlaylists) {
    return <SpotifyPlaylists playlists={spotifyPlaylists} />;
  }

  if (spotifyPlaylistsError) {
    const message =
      spotifyPlaylistsError &&
      typeof spotifyPlaylistsError === "object" &&
      "message" in spotifyPlaylistsError &&
      typeof spotifyPlaylistsError.message === "string"
        ? parseSpotifyError(spotifyPlaylistsError.message)
        : "An unknown error";

    return <h1>{message}</h1>;
  }
}
