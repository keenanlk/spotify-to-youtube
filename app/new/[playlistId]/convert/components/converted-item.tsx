import Link from "next/link";
import React from "react";
import sanitizeHtml from "sanitize-html";

function buildSpotifyUrl(id: string) {
  return `https://open.spotify.com/track/${id}`;
}

function buildYoutubeUrl(id: string) {
  return `https://youtube.com/watch?v=${id}`;
}

export default function ConvertedItem({
  id,
  spotifyTrackId,
  youtubeVideoId,
  spotifyTitle,
  youtubeTitle,
}: {
  id: string;
  spotifyTrackId: string;
  youtubeVideoId: string;
  spotifyTitle: string;
  youtubeTitle: string;
}) {
  return (
    <div
      key={id}
      className="border bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300"
    >
      <p>
        <Link href={buildSpotifyUrl(spotifyTrackId)} target="_blank">
          {sanitizeHtml(spotifyTitle)}
        </Link>{" "}
        /{" "}
        <Link href={buildYoutubeUrl(youtubeVideoId)} target="_blank">
          {sanitizeHtml(youtubeTitle)}
        </Link>
      </p>
    </div>
  );
}
