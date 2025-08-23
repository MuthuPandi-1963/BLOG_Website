import {
  users,
  articles,
  bookmarks,
  comments,
  type User,
  type UpsertUser,
  type Article,
  type InsertArticle,
  type Bookmark,
  type InsertBookmark,
  type Comment,
  type InsertComment,
  type CommentWithUser,
  type ArticleWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Article operations
  getArticles(country?: string, category?: string, limit?: number, offset?: number): Promise<ArticleWithDetails[]>;
  getArticleById(id: string): Promise<ArticleWithDetails | undefined>;
  upsertArticle(article: InsertArticle): Promise<Article>;
  searchArticles(query: string, country?: string): Promise<ArticleWithDetails[]>;
  
  // Bookmark operations
  getUserBookmarks(userId: string): Promise<ArticleWithDetails[]>;
  addBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  removeBookmark(userId: string, articleId: string): Promise<void>;
  isBookmarked(userId: string, articleId: string): Promise<boolean>;
  
  // Comment operations
  getArticleComments(articleId: string): Promise<CommentWithUser[]>;
  addComment(comment: InsertComment): Promise<Comment>;
  deleteComment(commentId: string, userId: string): Promise<void>;
  
  // Admin operations
  deleteArticle(articleId: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  
  // Statistics
  getArticleCountByCountry(): Promise<{ country: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getArticles(country?: string, category?: string, limit = 20, offset = 0): Promise<ArticleWithDetails[]> {
    let whereConditions = [];
    
    if (country) {
      whereConditions.push(eq(articles.country, country));
    }
    
    if (category) {
      whereConditions.push(eq(articles.category, category));
    }

    const query = db
      .select({
        article: articles,
        commentCount: sql<number>`count(distinct ${comments.id})`.as('commentCount'),
      })
      .from(articles)
      .leftJoin(comments, eq(articles.id, comments.articleId))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .groupBy(articles.id)
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    const results = await query;
    
    return results.map(row => ({
      ...row.article,
      bookmarks: [],
      comments: [],
      commentCount: row.commentCount,
    }));
  }

  async getArticleById(id: string): Promise<ArticleWithDetails | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    if (!article) return undefined;

    const articleComments = await this.getArticleComments(id);
    const articleBookmarks = await db.select().from(bookmarks).where(eq(bookmarks.articleId, id));

    return {
      ...article,
      bookmarks: articleBookmarks,
      comments: articleComments,
      commentCount: articleComments.length,
    };
  }

  async upsertArticle(article: InsertArticle): Promise<Article> {
    const [result] = await db
      .insert(articles)
      .values(article)
      .onConflictDoUpdate({
        target: articles.url,
        set: {
          ...article,
        },
      })
      .returning();
    return result;
  }

  async searchArticles(query: string, country?: string): Promise<ArticleWithDetails[]> {
    let whereConditions = [
      sql`${articles.title} ILIKE ${`%${query}%`} OR ${articles.description} ILIKE ${`%${query}%`}`
    ];
    
    if (country) {
      whereConditions.push(eq(articles.country, country));
    }

    const dbQuery = db
      .select({
        article: articles,
        commentCount: sql<number>`count(distinct ${comments.id})`.as('commentCount'),
      })
      .from(articles)
      .leftJoin(comments, eq(articles.id, comments.articleId))
      .where(and(...whereConditions))
      .groupBy(articles.id)
      .orderBy(desc(articles.publishedAt))
      .limit(20);

    const results = await dbQuery;
    
    return results.map(row => ({
      ...row.article,
      bookmarks: [],
      comments: [],
      commentCount: row.commentCount,
    }));
  }

  async getUserBookmarks(userId: string): Promise<ArticleWithDetails[]> {
    const results = await db
      .select({
        article: articles,
        commentCount: sql<number>`count(distinct ${comments.id})`.as('commentCount'),
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .leftJoin(comments, eq(articles.id, comments.articleId))
      .where(eq(bookmarks.userId, userId))
      .groupBy(articles.id, bookmarks.id)
      .orderBy(desc(bookmarks.createdAt));

    return results.map(row => ({
      ...row.article,
      bookmarks: [],
      comments: [],
      commentCount: row.commentCount,
      isBookmarked: true,
    }));
  }

  async addBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const [result] = await db.insert(bookmarks).values(bookmark).returning();
    return result;
  }

  async removeBookmark(userId: string, articleId: string): Promise<void> {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)));
  }

  async isBookmarked(userId: string, articleId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)));
    return !!result;
  }

  async getArticleComments(articleId: string): Promise<CommentWithUser[]> {
    const results = await db
      .select({
        comment: comments,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.articleId, articleId))
      .orderBy(desc(comments.createdAt));

    return results.map(row => ({
      ...row.comment,
      user: row.user,
    }));
  }

  async addComment(comment: InsertComment): Promise<Comment> {
    const [result] = await db.insert(comments).values(comment).returning();
    return result;
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    await db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
  }

  async deleteArticle(articleId: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, articleId));
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getArticleCountByCountry(): Promise<{ country: string; count: number }[]> {
    const results = await db
      .select({
        country: articles.country,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(articles)
      .groupBy(articles.country)
      .orderBy(desc(sql<number>`count(*)`));

    return results;
  }
}

export const storage = new DatabaseStorage();
