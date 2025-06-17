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
export const profileTypeEnum = pgEnum("profile_type", ["user", "page"]);

export const userTable = pgTable("user", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  avatar: varchar("avatar", { length: 255 }).default(sql`NULL`),
  dob: timestamp("dob").default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profileTable = pgTable("profile", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  bio: text("bio").default(sql`NULL`),
  location: varchar("location", { length: 255 }).default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  name: varchar("name", { length: 255 }).default(sql`NULL`),
  type: profileTypeEnum("type").notNull().default("user"),
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
  content: text("content"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`NULL`)
    .$onUpdate(() => new Date()),
  numLikes: integer("num_likes").notNull().default(0),
  numComments: integer("num_comments").notNull().default(0),
});

// export const attachments = relations(postTable, ({ many }) => ({
//   attachments: many(attachmentTable),
// }));

export const likeTable = pgTable(
  "like",
  {
    id: bigserial("id", { mode: "number" }),
    targetId: bigint("target_id", { mode: "number" }).notNull(),
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

// cloudinary uploads
// TODO: Settle with naming convention
export const attachmentTable = pgTable("attachment", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  postId: bigint("post_id", { mode: "number" })
    .notNull()
    .references(() => postTable.id),
  url: text("url").notNull(),
  asset_id: text("asset_id"),
  public_id: text("public_id"),
  width: integer("width"),
  height: integer("height"),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  resource_type: varchar("resource_type", { length: 50 }).default("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // TODO: add more fields like public_id, format, etc.
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

export const friendTable = pgTable(
  "friend",
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
