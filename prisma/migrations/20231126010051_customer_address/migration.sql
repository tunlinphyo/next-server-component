/*
  Warnings:

  - You are about to alter the column `avatar` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `address01` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `address02` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to alter the column `imgUrl` on the `ProductImage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `address` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "avatar" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "CustomerAddress" DROP COLUMN "address01",
DROP COLUMN "address02",
ADD COLUMN     "address" VARCHAR(255) NOT NULL,
ADD COLUMN     "city" VARCHAR(255) NOT NULL,
ADD COLUMN     "country" VARCHAR(255) NOT NULL,
ADD COLUMN     "state" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "imgUrl" SET DATA TYPE VARCHAR(255);
