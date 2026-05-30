import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Photos table - stores uploaded photos with approval status
 */
export const photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  uploaderId: int("uploaderId").notNull(),
  title: text("title"),
  description: text("description"),
  photoUrl: varchar("photoUrl", { length: 512 }).notNull(),
  approvalStatus: mysqlEnum("approvalStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

/**
 * Comments table - stores comments on photos
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  photoId: int("photoId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Likes table - stores likes on photos (hidden count)
 */
export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  photoId: int("photoId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

/**
 * Telegram accounts - stores Telegram user info for login
 */
export const telegramAccounts = mysqlTable("telegramAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  telegramId: varchar("telegramId", { length: 64 }).notNull().unique(),
  telegramUsername: varchar("telegramUsername", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TelegramAccount = typeof telegramAccounts.$inferSelect;
export type InsertTelegramAccount = typeof telegramAccounts.$inferInsert;

/**
 * Google accounts - stores Google user info for login
 */
export const googleAccounts = mysqlTable("googleAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  googleId: varchar("googleId", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GoogleAccount = typeof googleAccounts.$inferSelect;
export type InsertGoogleAccount = typeof googleAccounts.$inferInsert;