import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  totalCents: integer("total_cents").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").notNull().default("at_appointment"),
  createdAt: text("created_at").notNull(),
});
