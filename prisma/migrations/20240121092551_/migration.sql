/*
  Warnings:

  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.
  - The `lastLoginTimeStamp` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_resetPasswordToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordToken",
DROP COLUMN "lastLoginTimeStamp",
ADD COLUMN     "lastLoginTimeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ResetPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_userId_key" ON "ResetPasswordToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_id_key" ON "Card"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- AddForeignKey
ALTER TABLE "ResetPasswordToken" ADD CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
