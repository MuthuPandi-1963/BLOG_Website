import { isAuthenticated } from "../auth/middleware.js";
import { DbWorker } from "../db/dbWorker.js";
import { Router } from "express";
import z from "zod";

export const commentsRoutes = Router()

commentsRoutes.get('/:id/comments', async (req, res) => {
try {
    const { id } = req.params;
    const comments = await DbWorker.getArticleComments(id);
    res.json({ comments });
} catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
}
});

commentsRoutes.post('/:id/comments', isAuthenticated, async (req: any, res) => {
try {
    const userId = req.user.claims.sub;
    const { id: articleId } = req.params;
    
    const data = { ...req.body, userId, articleId };
    const comment = await DbWorker.addComment(data);
    res.json(comment);
} catch (error) {
    console.error('Error adding comment:', error);
    if (error instanceof z.ZodError) {
    return res.status(400).json({ message: 'Invalid comment data', errors: error.message });
    }
    res.status(500).json({ message: 'Failed to add comment' });
}
});

commentsRoutes.delete('/comments/:id', isAuthenticated, async (req: any, res) => {
try {
    const userId = req.user.claims.sub;
    const { id } = req.params;
    
    await DbWorker.deleteComment(id, userId);
    res.json({ message: 'Comment deleted' });
} catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
}
});