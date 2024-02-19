/*
  Warnings:

  - You are about to drop the column `groupInfoId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `GroupInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupInfoId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupInfoId";

-- DropTable
DROP TABLE "GroupInfo";
