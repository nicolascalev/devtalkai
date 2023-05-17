/*
  Warnings:

  - You are about to drop the column `status` on the `invite` table. All the data in the column will be lost.
  - You are about to drop the column `adminOfId` on the `user` table. All the data in the column will be lost.
  - Made the column `about` on table `organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `domainIndustry` on table `organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `domainLiteracy` on table `organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roles` on table `organization` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `organizationId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invite` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `organization` MODIFY `about` VARCHAR(191) NOT NULL,
    MODIFY `domainIndustry` VARCHAR(191) NOT NULL,
    MODIFY `domainLiteracy` VARCHAR(191) NOT NULL,
    MODIFY `roles` JSON NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `organizationId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `adminOfId`;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
