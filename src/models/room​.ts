import {
    pgTable,
    varchar,
    timestamp,
    uuid,
    integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { roomTypes } from "./roomType​";

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    roomNumber: integer("room_number").notNull(),
    roomTypeId: uuid("room_type_id")
    .references(() => roomTypes.id, { onDelete: "restrict" })
    .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
});