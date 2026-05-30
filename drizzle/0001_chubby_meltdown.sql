CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photoId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `googleAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`googleId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `googleAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `googleAccounts_googleId_unique` UNIQUE(`googleId`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photoId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uploaderId` int NOT NULL,
	`title` text,
	`description` text,
	`photoUrl` varchar(512) NOT NULL,
	`approvalStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `telegramAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`telegramId` varchar(64) NOT NULL,
	`telegramUsername` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `telegramAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `telegramAccounts_telegramId_unique` UNIQUE(`telegramId`)
);
