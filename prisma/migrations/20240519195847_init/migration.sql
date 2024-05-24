/*
  Warnings:

  - You are about to drop the `recipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `recipe`;

-- CreateTable
CREATE TABLE `Recipes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
