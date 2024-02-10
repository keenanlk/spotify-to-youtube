import React from "react";
import Link from "next/link";

function buildYoutubePlaylistUrl(id: string) {
  return `https://youtube.com/playlist?list=${id}`;
}

function buildSpotifyPlaylistUrl(id: string) {
  return `https://open.spotify.com/playlist/${id}`;
}

export default function PlaylistInfo({
  photo,
  name,
  count,
  icon,
  description,
  type,
  id,
}: {
  photo: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  description: string;
  type: string;
  id: string;
}) {
  return (
    <div className="mb-8">
      <div
        className={`border ${
          type === "spotify" ? "bg-spotifyGreen" : "bg-youtubeRed"
        } rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300`}
      >
        <div className="flex items-center space-x-8">
          <div>
            <div className="w-28 h-28 rounded-full overflow-hidden">
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {" "}
                {/* Use a larger font size here */}
                {icon}
              </span>
              <Link
                href={
                  type === "spotify"
                    ? buildSpotifyPlaylistUrl(id)
                    : buildYoutubePlaylistUrl(id)
                }
                target="_blank"
                className="text-lg font-semibold"
              >
                {name}
              </Link>
            </div>
            <p>{description}</p>
            <hr className="border-t border-white my-2" />
            <p className="text-sm">{count} tracks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
