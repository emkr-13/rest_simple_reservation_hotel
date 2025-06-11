import {
    pgTable,
    varchar,
    timestamp,
    uuid,
    integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user";
import { rooms } from "./room​";

export const reservations = pgTable("reservations", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
    roomId: uuid("room_id")
    .references(() => rooms.id, { onDelete: "restrict" })
    .notNull(),
    checkInDate: timestamp("check_in_date").notNull(),
    checkOutDate: timestamp("check_out_date").notNull(),
    totalAmount: integer("total_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
});