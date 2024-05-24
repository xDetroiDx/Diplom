/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `recipe` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `step` table. All the data in the column will be lost.
  - You are about to drop the `recipes` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `imageUrl` on table `step` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Step_recipeId_number_key` ON `step`;

-- AlterTable
ALTER TABLE `recipe` DROP COLUMN `imageUrl`;

-- AlterTable
ALTER TABLE `step` DROP COLUMN `number`,
    MODIFY `imageUrl` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `recipes`;
