/*
  Warnings:

  - Added the required column `updatedAt` to the `YouTubeService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YouTubeService" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Conversions" (
    "id" TEXT NOT NULL,
    "spotifyPlaylistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "youtubePlaylistId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionItems" (
    "id" TEXT NOT NULL,
    "conversionId" TEXT NOT NULL,
    "spotifyTrackId" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversionItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversions" ADD CONSTRAINT "Conversions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionItems" ADD CONSTRAINT "ConversionItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionItems" ADD CONSTRAINT "ConversionItems_conversionId_fkey" FOREIGN KEY ("conversionId") REFERENCES "Conversions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
