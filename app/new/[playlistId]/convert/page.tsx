"use client";
import React from "react";
import UnconvertedTrack from "@/app/new/[playlistId]/convert/components/unconverted-track";
import Link from "next/link";
import PlaylistInfo from "@/app/new/[playlistId]/convert/components/playlist-info";
import { FaSpotify, FaYoutube } from "react-icons/fa";
import ConvertedItem from "@/app/new/[playlistId]/convert/components/converted-item";
import { useConversions } from "@/app/providers/conversions-provider";

export default function Convert({
  params,
}: {
  params: { playlistId: string };
}) {
  const {
    selectedPlaylist: spotifyPlaylist,
    selectedPlaylistItems,
    conversion,
    conversionItems,
    youtubePlaylist,
    convertPageLoading,
  } = useConversions();

  const unconvertedItems = selectedPlaylistItems?.items.filter(
    (playlistItem) => {
      return !conversionItems?.find(
        (convertedItem) =>
          convertedItem.spotifyTrackId === playlistItem.track.id
      );
    }
  );

  if (convertPageLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mb-8">
        <Link href={`/new`}>Back to playlist</Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {spotifyPlaylist && (
          <PlaylistInfo
            photo={spotifyPlaylist.images[0]?.url || "/default-image.jpg"}
            name={spotifyPlaylist.name}
            count={spotifyPlaylist.tracks.total}
            icon={<FaSpotify />}
            description={spotifyPlaylist.description}
            type="spotify"
            id={spotifyPlaylist.id}
          />
        )}

        {youtubePlaylist && (
          <PlaylistInfo
            photo={
              youtubePlaylist.snippet?.thumbnails?.default?.url ||
              "/default-image.jpg"
            }
            name={youtubePlaylist.snippet?.title || ""}
            count={youtubePlaylist.contentDetails?.itemCount || 0}
            icon={<FaYoutube />}
            description={youtubePlaylist.snippet?.description || ""}
            type="youtube"
            id={youtubePlaylist.id || ""}
          />
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-4">Converted Songs</h1>
          {conversionItems?.length ? (
            <div className="space-y-4">
              {conversionItems.map((convertedItem) => (
                <ConvertedItem
                  key={convertedItem.id}
                  id={convertedItem.id}
                  spotifyTrackId={convertedItem.spotifyTrackId}
                  youtubeVideoId={convertedItem.youtubeVideoId}
                  spotifyTitle={convertedItem.spotifyTitle}
                  youtubeTitle={convertedItem.youtubeTitle}
                />
              ))}
            </div>
          ) : (
            <h4>No converted songs</h4>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-4">Unconverted Songs</h1>
          {unconvertedItems?.length ? (
            <div className="space-y-4">
              {unconvertedItems.map((unconvertedItem) => (
                <UnconvertedTrack
                  key={unconvertedItem.track.id}
                  track={unconvertedItem}
                  conversionId={conversion?.id || ""}
                  youtubePlaylistId={youtubePlaylist?.id || ""}
                />
              ))}
            </div>
          ) : (
            <h4>No unconverted songs</h4>
          )}
        </div>
      </div>
    </div>
  );
}
