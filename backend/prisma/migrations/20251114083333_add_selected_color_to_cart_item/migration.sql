/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,selectedColor]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `CartItem_userId_productId_key` ON `cartitem`;

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `selectedColor` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_userId_productId_selectedColor_key` ON `CartItem`(`userId`, `productId`, `selectedColor`);
