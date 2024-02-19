-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupInfoId" INTEGER;

-- CreateTable
CREATE TABLE "GroupInfo" (
    "id" SERIAL NOT NULL,
    "GroupName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL,

    CONSTRAINT "GroupInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupInfoId_fkey" FOREIGN KEY ("groupInfoId") REFERENCES "GroupInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
