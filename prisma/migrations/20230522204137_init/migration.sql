-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL,
    `auth0sub` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `technicalProficiency` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `organizationId` INTEGER NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_auth0sub_key`(`auth0sub`),
    UNIQUE INDEX `user_stripeCustomerId_key`(`stripeCustomerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `stripeSubId` VARCHAR(191) NOT NULL,
    `stripeSubPriceId` VARCHAR(191) NOT NULL,
    `stripeSubProductName` VARCHAR(191) NOT NULL,
    `stripeSubStatus` VARCHAR(191) NOT NULL,
    `stripeSubQuantity` INTEGER NOT NULL,

    UNIQUE INDEX `subscription_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `about` LONGTEXT NOT NULL,
    `trainingResourcesUrl` VARCHAR(191) NULL,
    `domainIndustry` VARCHAR(191) NOT NULL,
    `domainLiteracy` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `adminId` INTEGER NOT NULL,

    UNIQUE INDEX `organization_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `label` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `objectives` JSON NOT NULL,
    `technicalStack` JSON NOT NULL,
    `timeConstraints` VARCHAR(191) NULL,
    `integrations` JSON NOT NULL,
    `securityConsiderations` JSON NOT NULL,
    `documentationLink` VARCHAR(191) NULL,
    `organizationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `organizationId` INTEGER NOT NULL,

    INDEX `invite_organizationId_email_idx`(`organizationId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `output` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `organizationId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `body` LONGTEXT NOT NULL,
    `markedAs` VARCHAR(191) NOT NULL,
    `voice` VARCHAR(191) NOT NULL,
    `userBookmarked` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization` ADD CONSTRAINT `organization_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invite` ADD CONSTRAINT `invite_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
