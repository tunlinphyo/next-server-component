/*
  Warnings:

  - You are about to drop the column `orderPaymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `OrderPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderPaymentId_fkey";

-- DropForeignKey
ALTER TABLE "OrderPayment" DROP CONSTRAINT "OrderPayment_paymentId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderPaymentId",
ADD COLUMN     "customerPaymentId" INTEGER;

-- DropTable
DROP TABLE "OrderPayment";

-- CreateTable
CREATE TABLE "CustomerPayment" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "cardData" TEXT,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3),

    CONSTRAINT "CustomerPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPayment_customerId_key" ON "CustomerPayment"("customerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerPaymentId_fkey" FOREIGN KEY ("customerPaymentId") REFERENCES "CustomerPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPayment" ADD CONSTRAINT "CustomerPayment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPayment" ADD CONSTRAINT "CustomerPayment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
