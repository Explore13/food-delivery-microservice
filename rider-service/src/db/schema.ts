import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const dispatches = pgTable('dispatches', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull(),
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  item: varchar('item', { length: 100 }).notNull(),
  riderStatus: varchar('rider_status', { length: 50 })
    .notNull()
    .default('dispatched'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Dispatch = typeof dispatches.$inferSelect;
export type NewDispatch = typeof dispatches.$inferInsert;
