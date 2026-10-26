// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, real, primaryKey, index } from "drizzle-orm/sqlite-core";
export const rooms = sqliteTable("live_rooms", {
  code: text("code").primaryKey(), hostHash: text("host_hash").notNull(),
  round: integer("round").notNull().default(0), phase: text("phase").notNull().default("collecting"),
  created: integer("created").notNull(), expires: integer("expires").notNull(),
}, t => [index("room_expiry").on(t.expires)]);
export const answers = sqliteTable("live_answers", {
  room: text("room").notNull().references(() => rooms.code, {onDelete:"cascade"}),
  round: integer("round").notNull(), participant: text("participant").notNull(), value: real("value").notNull(),
}, t => [primaryKey({columns:[t.room,t.round,t.participant]})]);
export const limits = sqliteTable("live_limits", {
  key: text("key").primaryKey(), count: integer("count").notNull().default(1), expires: integer("expires").notNull(),
});
