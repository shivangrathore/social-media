// TODO: Delete firstname and lastname from user table
// TODO: create new field name or displayname
// TODO: remove Table suffix from table names (maybe?)
// TODO: Seperate types with different files
import { eq, relations, sql } from "drizzle-orm";
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
  pgView,
} from "drizzle-orm/pg-core";

export const likeTargetEnum = pgEnum("like_target", ["post", "comment"]);
export const friendRequestStatusEnum = pgEnum("friend_request_status", [
  "pending",
  "accepted",
  "rejected",
]);
export const profileTypeEnum = pgEnum("profile_type", ["user", "page"]);
export const postTypeEnum = pgEnum("post_type", ["regular", "poll"]);
// TODO: add audio support
export const attachmentTypeEnum = pgEnum("attachment_type", ["image", "video"]);
export const bookmarkTypeEnum = pgEnum("bookmark_type", ["post", "comment"]);

export const userTable = pgTable("user", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  avatar: varchar("avatar", { length: 255 }).default(sql`NULL`),
  dob: timestamp("dob").default(sql`NULL`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profileTable = pgTable("profile", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).default(sql`NULL`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => userTable.id),
  avatar: varchar("avatar", { length: 255 }).default(sql`NULL`),
  bio: text("bio").default(sql`NULL`),
  location: varchar("location", { length: 255 }).default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
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
  content: text("content"), // Acts as question for polls
  postType: postTypeEnum("post_type").notNull().default("regular"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`NULL`)
    .$onUpdate(() => new Date()),
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: timestamp("published_at").default(sql`NULL`),
});

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
    content: text("content").notNull(),
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => postTable.id),
    parentId: bigint("parent_id", { mode: "number" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
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
  // TODO: remove userId from attachment table
  id: bigserial("id", { mode: "number" }).primaryKey(),
  postId: bigint("post_id", { mode: "number" })
    .notNull()
    .references(() => postTable.id),
  url: text("url").notNull(),
  assetId: text("asset_id").notNull(),
  publicId: text("public_id").notNull(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  type: attachmentTypeEnum("type").notNull().default("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const pollTable = pgTable("poll", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  postId: bigint("post_id", { mode: "number" })
    .notNull()
    .references(() => postTable.id)
    .unique(),
  expiresAt: timestamp("expires_at").default(sql`NULL`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pollOptionTable = pgTable("poll_option", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  pollId: bigint("poll_id", { mode: "number" })
    .notNull()
    .references(() => pollTable.id),
  text: text("text").notNull(),
  voteCount: integer("vote_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pollVoteTable = pgTable(
  "poll_vote",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    pollId: bigint("poll_id", { mode: "number" })
      .notNull()
      .references(() => pollTable.id),
    pollOptionId: bigint("poll_option_id", { mode: "number" })
      .notNull()
      .references(() => pollOptionTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.pollOptionId)],
);

export const postViewTable = pgTable("post_view", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  postId: bigint("post_id", { mode: "number" })
    .notNull()
    .references(() => postTable.id),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBookmarkTable = pgTable(
  "user_bookmark",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => userTable.id),
    targetId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => postTable.id),
    type: bookmarkTypeEnum("type").notNull().default("post"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.targetId, t.type)],
);

export const userView = pgView("user_view").as((qb) =>
  qb
    .select({
      id: userTable.id,
      name: profileTable.name,
      email: userTable.email,
      emailVerified: userTable.emailVerified,
      avatar: profileTable.avatar,
      dob: userTable.dob,
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
      username: profileTable.username,
    })
    .from(userTable)
    .innerJoin(profileTable, eq(userTable.id, profileTable.userId)),
);
