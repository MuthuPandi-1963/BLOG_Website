import { isAuthenticated } from "../auth/middleware.js";
import { DbWorker } from "../db/dbWorker.js";
import { Router } from "express";
import z from "zod";

export const bookmarkRoutes = Router()

bookmarkRoutes.get('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const bookmarks = await DbWorker.getUserBookmarks(userId);
    res.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
});

bookmarkRoutes.post('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const data = { ...req.body, userId };
    
    const isAlreadyBookmarked = await DbWorker.isBookmarked(userId, data.articleId);
    if (isAlreadyBookmarked) {
      return res.status(409).json({ message: 'Article already bookmarked' });
    }

    const bookmark = await DbWorker.addBookmark(data);
    res.json(bookmark);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid bookmark data', errors: error._zod });
    }
    res.status(500).json({ message: 'Failed to add bookmark' });
  }
});

bookmarkRoutes.delete('/:articleId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { articleId } = req.params;
    
    await DbWorker.removeBookmark(userId, articleId);
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Failed to remove bookmark' });
  }
});

