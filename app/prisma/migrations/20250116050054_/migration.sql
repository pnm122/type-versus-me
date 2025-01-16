/*
  Warnings:

  - Changed the type of `category` on the `Race` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `accuracy` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Race" DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "accuracy" DOUBLE PRECISION NOT NULL;

-- DropEnum
DROP TYPE "RaceCategory";
