CREATE TABLE `live_answers` (
	`room` text NOT NULL,
	`round` integer NOT NULL,
	`participant` text NOT NULL,
	`value` real NOT NULL,
	PRIMARY KEY(`room`, `round`, `participant`),
	FOREIGN KEY (`room`) REFERENCES `live_rooms`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `live_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `live_rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`host_hash` text NOT NULL,
	`round` integer DEFAULT 0 NOT NULL,
	`phase` text DEFAULT 'collecting' NOT NULL,
	`created` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `room_expiry` ON `live_rooms` (`expires`);