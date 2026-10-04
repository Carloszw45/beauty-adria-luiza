CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`service_id` text NOT NULL,
	`service_name` text NOT NULL,
	`total_cents` integer NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`preferred_date` text NOT NULL,
	`preferred_time` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_method` text DEFAULT 'at_appointment' NOT NULL,
	`created_at` text NOT NULL
);
