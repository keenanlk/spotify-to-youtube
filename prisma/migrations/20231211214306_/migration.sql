/*
  Warnings:

  - A unique constraint covering the columns `[spotifyPlaylistId,userId]` on the table `Conversions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversions_spotifyPlaylistId_userId_key" ON "Conversions"("spotifyPlaylistId", "userId");
