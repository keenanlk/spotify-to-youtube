"use server";

import {
  AccessToken,
  IAuthStrategy,
  SdkConfiguration,
  SdkOptions,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { Account } from "@prisma/client";

class NextAuthStrategy implements IAuthStrategy {
  public getOrCreateAccessToken(): Promise<AccessToken> {
    return this.getAccessToken();
  }

  private async refreshAccessToken(account: Account) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: account.refresh_token || "",
      }),
    });

    const result = await response.json();
    if (result.access_token && result.expires_in) {
      const updatedAccount = await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: result.access_token,
          expires_at: Math.floor(Date.now() / 1000) + result.expires_in,
        },
      });

      if (!updatedAccount) {
        throw new Error("Could not update account");
      }

      return account;
    } else {
      throw new Error("Could not refresh access token");
    }
  }

  public async getAccessToken(): Promise<AccessToken> {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      include: { accounts: true },
    });

    if (!user.accounts.length) {
      throw new Error("No accounts found");
    }

    let account = user.accounts[0];

    if (
      Number(account.expires_at) < Math.floor(Date.now() / 1000) &&
      account.refresh_token
    ) {
      account = await this.refreshAccessToken(account);
    }

    return {
      access_token: account.access_token,
      token_type: "Bearer",
      expires_in: Number(account.expires_at) - Math.floor(Date.now() / 1000),
      expires: account.expires_at,
      refresh_token: account.refresh_token,
    } as AccessToken;
  }

  public removeAccessToken(): void {
    console.warn("[Spotify-SDK][WARN]\nremoveAccessToken not implemented");
  }

  public setConfiguration(configuration: SdkConfiguration): void {
    console.warn("[Spotify-SDK][WARN]\nsetConfiguration not implemented");
  }
}

export async function withNextAuthStrategy(config?: SdkOptions) {
  const strategy = new NextAuthStrategy();
  return new SpotifyApi(strategy, config);
}

const spotifyErrors: Record<string, string> = {
  "The app has exceeded its rate limits.":
    "We encountered an error while trying to fetch your data. Please try again later.",
} as const;

export async function parseSpotifyError(message: string) {
  return spotifyErrors[message] || message;
}

export async function getPlaylists() {
  const api = await withNextAuthStrategy();
  const currentUser = await api.currentUser.profile();
  return api.playlists.getUsersPlaylists(currentUser.id);
}

export async function getPlaylistItems(playlistId: string) {
  const api = await withNextAuthStrategy();
  return api.playlists.getPlaylistItems(playlistId);
}

export async function getSpotifyPlaylist(playlistId: string) {
  const api = await withNextAuthStrategy();
  return api.playlists.getPlaylist(playlistId);
}
