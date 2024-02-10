/*
  Warnings:

  - Added the required column `tokenExpires` to the `YouTubeService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YouTubeService" ADD COLUMN     "tokenExpires" INTEGER NOT NULL;
