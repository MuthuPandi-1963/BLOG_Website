import { relations, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  jsonb,
  index,
  text,
} from "drizzle-orm/pg-core";

// --- Tables ---

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  preferredCountries: varchar("preferred_countries").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  url: text("url").notNull().unique(),
  urlToImage: text("url_to_image"),
  source: varchar("source").notNull(),
  author: varchar("author"),
  publishedAt: timestamp("published_at").notNull(),
  country: varchar("country").notNull(),
  category: varchar("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  articleId: varchar("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  articleId: varchar("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  bookmarks: many(bookmarks),
  comments: many(comments),
}));

export const articlesRelations = relations(articles, ({ many }) => ({
  bookmarks: many(bookmarks),
  comments: many(comments),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [bookmarks.articleId],
    references: [articles.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
}));

// --- Types ---

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertArticleDb = typeof articles.$inferInsert;
export type Article = typeof articles.$inferSelect;

export type InsertBookmarkDb = typeof bookmarks.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;

export type InsertCommentDb = typeof comments.$inferInsert;
export type Comment = typeof comments.$inferSelect;

export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "firstName" | "lastName" | "email">;
};

export type ArticleWithDetails = Article & {
  bookmarks: Bookmark[];
  comments: CommentWithUser[];
  isBookmarked?: boolean;
  commentCount?: number;
};
