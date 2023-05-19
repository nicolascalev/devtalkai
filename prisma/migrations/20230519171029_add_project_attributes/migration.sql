-- AlterTable
ALTER TABLE `project` ADD COLUMN `documentationLink` VARCHAR(191) NULL,
    ADD COLUMN `integrations` JSON NOT NULL,
    ADD COLUMN `objectives` JSON NOT NULL,
    ADD COLUMN `securityConsiderations` JSON NOT NULL,
    ADD COLUMN `technicalStack` JSON NOT NULL,
    ADD COLUMN `timeConstraints` VARCHAR(191) NULL;
