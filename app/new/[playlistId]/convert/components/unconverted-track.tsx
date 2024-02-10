"use client";
import { PlaylistedTrack } from "@spotify/web-api-ts-sdk";
import React, { useState } from "react";
import { convertTrack } from "@/app/lib/convert";
import { useRouter } from "next/navigation";
import { useConversions } from "@/app/providers/conversions-provider";

export default function UnconvertedTrack({
  track,
  conversionId,
  youtubePlaylistId,
}: {
  track: PlaylistedTrack;
  conversionId: string;
  youtubePlaylistId: string;
}) {
  const { convert } = useConversions();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConvertTrack = async () => {
    setLoading(true);
    await convert(track, youtubePlaylistId, conversionId);
  };

  return (
    <div className="border bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16">
          <img
            src={
              ("album" in track.track && track.track.album.images[0]?.url) ||
              "/default-image.jpg"
            }
            alt={track.track.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div>
          <p>{track.track.name}</p>
          {loading ? (
            <p>Loading...</p> // Show loading text or spinner while converting
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-2"
              onClick={handleConvertTrack}
              disabled={loading} // Disable button when loading
            >
              Convert
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
