-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_order_id_fkey`;

-- DropIndex
DROP INDEX `OrderItem_menu_id_fkey` ON `orderitem`;

-- DropIndex
DROP INDEX `OrderItem_order_id_fkey` ON `orderitem`;

-- DropIndex
DROP INDEX `Payment_order_id_fkey` ON `payment`;

-- AlterTable
ALTER TABLE `order` MODIFY `customer_name` VARCHAR(191) NULL,
    MODIFY `customer_phone` VARCHAR(20) NULL,
    MODIFY `table_number` INTEGER NULL,
    MODIFY `total_amount` INTEGER NULL,
    MODIFY `tax` INTEGER NULL,
    MODIFY `service_charge` INTEGER NULL,
    MODIFY `order_status` ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `orderitem` MODIFY `order_id` INTEGER NULL,
    MODIFY `menu_id` INTEGER NULL,
    MODIFY `quantity` INTEGER NULL,
    MODIFY `price` INTEGER NULL,
    MODIFY `subtotal` INTEGER NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `order_id` INTEGER NULL,
    MODIFY `amount` INTEGER NULL,
    MODIFY `payment_status` ENUM('pending', 'paid', 'failed', 'cancelled', 'expired') NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `Menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
