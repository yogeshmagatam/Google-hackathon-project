/*
  Warnings:

  - You are about to drop the `LearningPath` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN "educationalBackground" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LearningPath";
PRAGMA foreign_keys=on;
