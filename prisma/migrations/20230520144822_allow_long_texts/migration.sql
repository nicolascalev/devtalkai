-- AlterTable
ALTER TABLE `organization` MODIFY `about` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `output` MODIFY `body` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `description` LONGTEXT NOT NULL;
