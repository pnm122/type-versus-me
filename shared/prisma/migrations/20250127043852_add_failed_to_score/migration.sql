/*
  Warnings:

  - Added the required column `failed` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "failed" BOOLEAN NOT NULL,
ALTER COLUMN "isWinner" DROP DEFAULT;
