-- CreateTable
CREATE TABLE "YouTubeService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "YouTubeService_pkey" PRIMARY KEY ("id")
);
