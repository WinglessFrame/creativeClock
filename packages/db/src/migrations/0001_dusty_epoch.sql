CREATE TABLE `creative_clock_projectCategory` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`projectId` text NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `creative_clock_project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `creative_clock_project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creative_clock_timeEntry` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`notes` text,
	`timeInMinutes` integer NOT NULL,
	`date` integer NOT NULL,
	`projectCategoryId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `creative_clock_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`projectCategoryId`) REFERENCES `creative_clock_projectCategory`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `creative_clock_project_name_unique` ON `creative_clock_project` (`name`);