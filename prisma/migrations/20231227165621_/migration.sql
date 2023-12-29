/*
  Warnings:

  - Added the required column `DEK` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DEKReset` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `KEKSalt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "DEK" TEXT NOT NULL,
ADD COLUMN     "DEKReset" TEXT NOT NULL,
ADD COLUMN     "KEKSalt" TEXT NOT NULL,
ADD COLUMN     "iv" TEXT NOT NULL;
