import { relations, sql } from "drizzle-orm";
import {
  integer,
  varchar,
  pgTable,
  timestamp,
  bigserial,
  boolean,
  bigint,
  text,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: boolean("email_verified").default(false),
  avatar: varchar("avatar", { length: 255 }).default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accountTable = pgTable("account", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  accessToken: varchar("access_token", { length: 255 }).default(sql`NULL`),
  accessTokenExpiresAt: timestamp("access_token_expires").default(sql`NULL`),
  password: varchar("password", { length: 255 }).default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessionTable = pgTable("session", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }).default(sql`NULL`),
  userAgent: varchar("user_agent", { length: 255 }).default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userAccountRelation = relations(userTable, ({ many }) => ({
  accounts: many(accountTable),
}));

export const accountUserRelation = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));

export const postTable = pgTable("post", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  title: text("title"),
  content: text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`NULL`),
  numLikes: integer("num_likes").default(0),
  numComments: integer("num_comments").default(0),
});

export const attachmentTable = pgTable("attachment", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  postId: bigint("post_id", { mode: "number" }).references(() => userTable.id),
  public_url: text("public_url"),
  url: text("url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
