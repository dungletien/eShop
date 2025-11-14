-- AlterTable
ALTER TABLE `order` ADD COLUMN `customerInfo` JSON NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NULL;
