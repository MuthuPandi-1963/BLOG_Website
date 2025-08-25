import {
  users,
  articles,
  bookmarks,
  comments,
  type User,
  type UpsertUser,
  type Article,
  type InsertArticleDb,
  type Bookmark,
  type InsertBookmarkDb,
  type Comment,
  type InsertCommentDb,
  type CommentWithUser,
  type ArticleWithDetails,
} from "./schema.js";
import { db } from "./index.js";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Articles
  getArticles(
    country?: string,
    category?: string,
    limit?: number,
    offset?: number
  ): Promise<ArticleWithDetails[]>;
  getArticleById(id: string): Promise<ArticleWithDetails | undefined>;
  upsertArticle(article: InsertArticleDb): Promise<Article>;
  searchArticles(
    query: string,
    country?: string
  ): Promise<ArticleWithDetails[]>;

  // Bookmarks
  getUserBookmarks(userId: string): Promise<ArticleWithDetails[]>;
  addBookmark(bookmark: InsertBookmarkDb): Promise<Bookmark>;
  removeBookmark(userId: string, articleId: string): Promise<void>;
  isBookmarked(userId: string, articleId: string): Promise<boolean>;

  // Comments
  getArticleComments(articleId: string): Promise<CommentWithUser[]>;
  addComment(comment: InsertCommentDb): Promise<Comment>;
  deleteComment(commentId: string, userId: string): Promise<void>;

  // Admin
  deleteArticle(articleId: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Stats
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
        set: { ...userData, updatedAt: new Date() },
      })
      .returning();
    return user;
  }

  async getArticles(
    country?: string,
    category?: string,
    limit = 20,
    offset = 0
  ): Promise<ArticleWithDetails[]> {
    let whereConditions = [];
    if (country) whereConditions.push(eq(articles.country, country));
    if (category) whereConditions.push(eq(articles.category, category));

    const results = await db
      .select({
        article: articles,
        commentCount: sql<number>`count(distinct ${comments.id})`.as("commentCount"),
      })
      .from(articles)
      .leftJoin(comments, eq(articles.id, comments.articleId))
      .where(whereConditions.length ? and(...whereConditions) : undefined)
      .groupBy(articles.id)
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    return results.map((row) => ({
      ...row.article,
      bookmarks: [],
      comments: [],
      commentCount: row.commentCount,
    }));
  }

  

async saveArticle(apiArticle : any){
  const articlesList :Article[] = await db.insert(articles).values([{
    id: apiArticle.article_id, 
    title: apiArticle.title,
    description: apiArticle.description,
    content: apiArticle.content ?? null,
    url: apiArticle.link,
    urlToImage: apiArticle.image_url ?? null,
    source: apiArticle.source_id,  // or apiArticle.source_name
    author: apiArticle.creator ? apiArticle.creator[0] : null,
    publishedAt: new Date(apiArticle.pubDate),
    country: apiArticle.country ? apiArticle.country[0] : "world",
    category: apiArticle.category ? apiArticle.category[0] : null,
  }]).onConflictDoNothing({ target: articles.url }).returning(); // prevents duplicates
  console.log(articlesList);
  
  return articlesList;
}

  async getArticleById(id: string): Promise<ArticleWithDetails | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    if (!article) return undefined;

    const articleComments = await this.getArticleComments(id);
    const articleBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.articleId, id));

    return {
      ...article,
      bookmarks: articleBookmarks,
      comments: articleComments,
      commentCount: articleComments.length,
    };
  }

  async upsertArticle(article: InsertArticleDb): Promise<Article> {
    const [result] = await db
      .insert(articles)
      .values({ ...article, publishedAt: new Date() })
      .onConflictDoUpdate({ target: articles.url, set: { ...article } })
      .returning();
    return result;
  }

  async searchArticles(
    query: string,
    country?: string
  ): Promise<ArticleWithDetails[]> {
    let whereConditions = [
      sql`${articles.title} ILIKE ${`%${query}%`} OR ${articles.description} ILIKE ${`%${query}%`}`,
    ];
    if (country) whereConditions.push(eq(articles.country, country));

    const results = await db
      .select({
        article: articles,
        commentCount: sql<number>`count(distinct ${comments.id})`.as("commentCount"),
      })
      .from(articles)
      .leftJoin(comments, eq(articles.id, comments.articleId))
      .where(and(...whereConditions))
      .groupBy(articles.id)
      .orderBy(desc(articles.publishedAt))
      .limit(20);

    return results.map((row) => ({
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
        commentCount: sql<number>`count(distinct ${comments.id})`.as("commentCount"),
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .leftJoin(comments, eq(articles.id, comments.articleId))
      .where(eq(bookmarks.userId, userId))
      .groupBy(articles.id, bookmarks.id)
      .orderBy(desc(bookmarks.createdAt));

    return results.map((row) => ({
      ...row.article,
      bookmarks: [],
      comments: [],
      commentCount: row.commentCount,
      isBookmarked: true,
    }));
  }

  async addBookmark(bookmark: InsertBookmarkDb): Promise<Bookmark> {
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

    return results.map((row) => ({
      ...row.comment,
      user: row.user,
    }));
  }

  async addComment(comment: InsertCommentDb): Promise<Comment> {
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
    return await db
      .select({
        country: articles.country,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(articles)
      .groupBy(articles.country)
      .orderBy(desc(sql<number>`count(*)`));
  }
}

export const DbWorker = new DatabaseStorage();
