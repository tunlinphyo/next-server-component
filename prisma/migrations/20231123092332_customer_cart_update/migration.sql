-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_addressId_fkey";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "CustomerAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
