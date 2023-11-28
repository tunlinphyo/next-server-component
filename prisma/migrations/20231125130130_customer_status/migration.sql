-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_statusId_fkey";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "statusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
