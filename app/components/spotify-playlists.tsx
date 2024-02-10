'use client';

import { withNextAuthStrategy } from "@/app/lib/spotify";
import {Page, type Playlist} from "@spotify/web-api-ts-sdk";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useConversions} from "@/app/providers/conversions-provider";

export default function SpotifyPlaylists({
  playlists,
}: {
  playlists: Page<Playlist>;
}) {
    const router = useRouter();

    const { selectedPlaylist, setSelectedPlaylist} = useConversions();

    const handlePlaylistSelect = (playlist: Playlist) => {
        if (selectedPlaylist?.id === playlist.id) {
            setSelectedPlaylist(null);
            return;
        }
        setSelectedPlaylist(playlist);
    };

    const handleConvertButtonClick = () => {
        // Perform your action when the "Convert" button is clicked for the selected playlist
        if (selectedPlaylist) {
            // Do something with the selected playlist
            console.log("Converting playlist:", selectedPlaylist.name);
            router.push(`/new/${selectedPlaylist.id}/convert`);

        }
    };

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 justify-between items-center">
                    <h1 className="text-3xl font-semibold mb-6">Your Playlists</h1>
                    {selectedPlaylist && (
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-6"
                            onClick={handleConvertButtonClick}
                        >
                            Convert
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {playlists.items.map((playlist) => (
                        <div
                            key={playlist.id}
                            className={`${
                                selectedPlaylist?.id === playlist.id
                                    ? "border-4 border-blue-500"
                                    : "border"
                            } bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300`}
                            onClick={() => handlePlaylistSelect(playlist)}
                        >
                            <img
                                src={playlist.images[0]?.url || "/default-image.jpg"}
                                alt={playlist.name}
                                className="w-full h-36 object-cover rounded-md mb-3"
                            />
                            <h2 className="text-lg font-semibold">{playlist.name}</h2>
                            <p className="text-sm text-gray-600">
                                {playlist.tracks.total} tracks
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
