/*
  Warnings:

  - You are about to drop the column `addressId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_addressId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "addressId",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "note",
DROP COLUMN "phone";
