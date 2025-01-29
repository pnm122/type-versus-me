-- CreateEnum
CREATE TYPE "RaceCategory" AS ENUM ('QUOTE', 'TOP_100', 'TOP_1000');

-- CreateTable
CREATE TABLE "Race" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "category" "RaceCategory" NOT NULL,
    "numWords" INTEGER NOT NULL,
    "timeLimit" INTEGER NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "points" INTEGER NOT NULL,
    "wpm" DOUBLE PRECISION NOT NULL,
    "raceId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_userId_raceId_key" ON "Score"("userId", "raceId");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
