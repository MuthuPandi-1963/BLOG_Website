// Admin routes

// import { insertArticleSchema } from "../db/dbWorker.js";
import { isAuthenticated } from "../auth/middleware.js";
import { DbWorker } from "../db/dbWorker.js";
import { Response, Router } from "express";

export const AdminRoutes = Router()
  AdminRoutes.get('/users', isAuthenticated, async (req: any, res:Response) => {
    try {
      const currentUser = await DbWorker.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const users = await DbWorker.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  AdminRoutes.delete('/articles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await DbWorker.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { id } = req.params;
      await DbWorker.deleteArticle(id);
      res.json({ message: 'Article deleted' });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ message: 'Failed to delete article' });
    }
  });

  AdminRoutes.post('/articles', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await DbWorker.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      // const validatedData = insert.parse(req.body);
      const article = await DbWorker.upsertArticle(req.body);
      
      res.json(article);
    } catch (error) {
      console.error('Error creating article:', error);
      if (error instanceof Error) {
        return res.status(400).json({ message: 'Invalid article data', errors: error.message });
      }
      res.status(500).json({ message: 'Failed to create article' });
    }
  });

  AdminRoutes.delete('/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await DbWorker.getUser(req.user.claims.sub);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { id } = req.params;
      if (id === req.user.claims.sub) {
        return res.status(400).json({ message: 'Cannot delete own account' });
      }

      await DbWorker.deleteUser(id);
      res.json({ message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });