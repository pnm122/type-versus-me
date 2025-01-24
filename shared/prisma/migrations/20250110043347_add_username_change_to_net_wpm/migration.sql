/*
  Warnings:

  - You are about to drop the column `wpm` on the `Score` table. All the data in the column will be lost.
  - Added the required column `netWPM` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "wpm",
ADD COLUMN     "netWPM" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL;
