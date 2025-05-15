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
  foreignKey,
  unique,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";

export const likeTargetEnum = pgEnum("like_target", ["post", "comment"]);
export const friendRequestStatusEnum = pgEnum("friend_request_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const userTable = pgTable("user", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  avatar: varchar("avatar", { length: 255 }).default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accountTable = pgTable(
  "account",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    accessToken: varchar("access_token", { length: 255 }).default(sql`NULL`),
    accessTokenExpiresAt: timestamp("access_token_expires").default(sql`NULL`),
    password: varchar("password", { length: 255 }).default(sql`NULL`),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.provider, t.providerAccountId)],
);

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
  numLikes: integer("num_likes").notNull().default(0),
  numComments: integer("num_comments").notNull().default(0),
  published: boolean("published").default(false),
});

export const likeTable = pgTable(
  "like",
  {
    id: bigserial("id", { mode: "number" }),
    targetId: bigint("post_id", { mode: "number" }).notNull(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    targetType: likeTargetEnum("target_type").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => [unique().on(t.targetId, t.userId, t.targetType)],
);

export const commentTable = pgTable(
  "comment",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    content: text("content"),
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => postTable.id),
    parentId: bigint("parent_id", { mode: "number" }),
  },
  (t) => [
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "comment_id_comment_parent_id_fkey",
    }),
  ],
);

export const attachmentTable = pgTable("attachment", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  postId: bigint("post_id", { mode: "number" }).references(() => userTable.id),
  publicUrl: text("public_url"),
  url: text("url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const friendRequestTable = pgTable(
  "friend_request",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    senderId: bigint("sender_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    recipientId: bigint("recipient_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    status: friendRequestStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    unique().on(t.senderId, t.recipientId),
    check("no_self_request", sql`${t.senderId} != ${t.recipientId}`),
  ],
);

export const friendShipTable = pgTable(
  "friendship",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    user1Id: bigint("user_1_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    user2Id: bigint("user_2_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [check("ordered_friend_ids", sql`${t.user1Id} < ${t.user2Id}`)],
);
