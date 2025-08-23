import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { newsApi } from "./services/newsApi";
import { insertArticleSchema, insertBookmarkSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // News API routes
  app.get('/api/news', async (req, res) => {
    try {
      const { country, category, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      
      // First try to get from database
      let articles = await storage.getArticles(
        country as string, 
        category as string, 
        Number(limit), 
        offset
      );

      // If no articles in database, fetch from NewsAPI
      if (articles.length === 0 && Number(page) === 1) {
        try {
          const newsArticles = await newsApi.fetchTopHeadlines(
            country as string, 
            category as string, 
            Number(limit)
          );

          // Store articles in database
          for (const newsArticle of newsArticles) {
            const articleData = {
              title: newsArticle.title,
              description: newsArticle.description || '',
              content: newsArticle.content || '',
              url: newsArticle.url,
              urlToImage: newsArticle.urlToImage || '',
              source: newsArticle.source.name,
              author: newsArticle.author || '',
              publishedAt: new Date(newsArticle.publishedAt),
              country: country as string || 'global',
              category: category as string || 'general',
            };

            await storage.upsertArticle(articleData);
          }

          // Fetch updated articles from database
          articles = await storage.getArticles(
            country as string, 
            category as string, 
            Number(limit), 
            offset
          );
        } catch (newsError) {
          console.warn('Failed to fetch from NewsAPI:', newsError);
          // Continue with empty articles array if NewsAPI fails
        }
      }

      res.json({ articles, hasMore: articles.length === Number(limit) });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });
    }
  });

  app.get('/api/news/search', async (req, res) => {
    try {
      const { q, country } = req.query;
      
      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      let articles = await storage.searchArticles(q as string, country as string);

      // If no results from database, try NewsAPI
      if (articles.length === 0) {
        try {
          const newsArticles = await newsApi.searchNews(q as string, country as string);
          
          // Store articles in database
          for (const newsArticle of newsArticles) {
            const articleData = {
              title: newsArticle.title,
              description: newsArticle.description || '',
              content: newsArticle.content || '',
              url: newsArticle.url,
              urlToImage: newsArticle.urlToImage || '',
              source: newsArticle.source.name,
              author: newsArticle.author || '',
              publishedAt: new Date(newsArticle.publishedAt),
              country: country as string || 'global',
              category: 'general',
            };

            await storage.upsertArticle(articleData);
          }

          articles = await storage.searchArticles(q as string, country as string);
        } catch (newsError) {
          console.warn('Failed to search from NewsAPI:', newsError);
        }
      }

      res.json({ articles });
    } catch (error) {
      console.error('Error searching news:', error);
      res.status(500).json({ message: 'Failed to search news' });
    }
  });

  app.get('/api/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      res.json(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ message: 'Failed to fetch article' });
    }
  });

  // Bookmark routes
  app.get('/api/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json({ bookmarks });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ message: 'Failed to fetch bookmarks' });
    }
  });

  app.post('/api/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertBookmarkSchema.parse({ ...req.body, userId });
      
      const isAlreadyBookmarked = await storage.isBookmarked(userId, data.articleId);
      if (isAlreadyBookmarked) {
        return res.status(409).json({ message: 'Article already bookmarked' });
      }

      const bookmark = await storage.addBookmark(data);
      res.json(bookmark);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid bookmark data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to add bookmark' });
    }
  });

  app.delete('/api/bookmarks/:articleId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { articleId } = req.params;
      
      await storage.removeBookmark(userId, articleId);
      res.json({ message: 'Bookmark removed' });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      res.status(500).json({ message: 'Failed to remove bookmark' });
    }
  });

  // Comment routes
  app.get('/api/articles/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getArticleComments(id);
      res.json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  });

  app.post('/api/articles/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id: articleId } = req.params;
      
      const data = insertCommentSchema.parse({ ...req.body, userId, articleId });
      const comment = await storage.addComment(data);
      res.json(comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid comment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to add comment' });
    }
  });

  app.delete('/api/comments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.deleteComment(id, userId);
      res.json({ message: 'Comment deleted' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Failed to delete comment' });
    }
  });

  // Countries and categories
  app.get('/api/countries', (req, res) => {
    const countries = newsApi.getAllCountries();
    res.json({ countries });
  });

  app.get('/api/categories', (req, res) => {
    const categories = newsApi.getCategories();
    res.json({ categories });
  });

  app.get('/api/stats/countries', async (req, res) => {
    try {
      const stats = await storage.getArticleCountByCountry();
      res.json({ stats });
    } catch (error) {
      console.error('Error fetching country stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const users = await storage.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.delete('/api/admin/articles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { id } = req.params;
      await storage.deleteArticle(id);
      res.json({ message: 'Article deleted' });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ message: 'Failed to delete article' });
    }
  });

  app.post('/api/admin/articles', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.upsertArticle({
        ...validatedData,
        publishedAt: new Date(validatedData.publishedAt || new Date()),
      });
      
      res.json(article);
    } catch (error) {
      console.error('Error creating article:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid article data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create article' });
    }
  });

  app.delete('/api/admin/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { id } = req.params;
      if (id === req.user.claims.sub) {
        return res.status(400).json({ message: 'Cannot delete own account' });
      }

      await storage.deleteUser(id);
      res.json({ message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
