CREATE TABLE `creative_clock_permissions` (
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creative_clock_userToProjects` (
	`userId` text NOT NULL,
	`projectId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `creative_clock_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`projectId`) REFERENCES `creative_clock_project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `creative_clock_permissions_name_unique` ON `creative_clock_permissions` (`name`);