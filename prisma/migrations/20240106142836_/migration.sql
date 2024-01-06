/*
  Warnings:

  - Changed the type of `accountNumber` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountNumber",
ADD COLUMN     "accountNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_accountNumber_key" ON "User"("accountNumber");
