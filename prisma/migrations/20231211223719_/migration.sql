/*
  Warnings:

  - You are about to drop the column `description` on the `ConversionItems` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ConversionItems` table. All the data in the column will be lost.
  - Added the required column `spotifyTitle` to the `ConversionItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `youtubeTitle` to the `ConversionItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConversionItems" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "spotifyTitle" TEXT NOT NULL,
ADD COLUMN     "youtubeTitle" TEXT NOT NULL;
