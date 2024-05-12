CREATE TABLE `creative_clock_expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`notes` text,
	`receipt` text,
	`isApproved` integer NOT NULL,
	`amount` integer NOT NULL,
	`date` integer NOT NULL,
	`projectExpenseCategoryId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `creative_clock_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`projectExpenseCategoryId`) REFERENCES `creative_clock_projectExpenseCategory`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `creative_clock_projectExpenseCategory` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`projectId` text NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `creative_clock_project`(`id`) ON UPDATE no action ON DELETE cascade
);
