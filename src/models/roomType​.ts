import {
    pgTable,
    varchar,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const roomTypes = pgTable("room_types", {
    id:  uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
});