/*
  Warnings:

  - You are about to drop the column `winnerId` on the `Race` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Race" DROP COLUMN "winnerId";

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "isWinner" BOOLEAN NOT NULL DEFAULT false;
