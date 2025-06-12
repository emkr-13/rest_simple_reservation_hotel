import { pgTable, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { reservations } from './reservation​';

export const payments = pgTable('payments', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  reservationId: uuid('reservation_id')
    .references(() => reservations.id, { onDelete: 'restrict' })
    .notNull(),
  amount: integer('amount').notNull(),
  paidAt: timestamp('paid_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
