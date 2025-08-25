import { Request, Response, NextFunction, RequestHandler } from "express";
import { getSession } from "./session.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sid = req.cookies.sid;
  if (!sid) return res.status(401).json({ message: "Not authenticated" });

  const session = await getSession(sid);
  if (!session) return res.status(401).json({ message: "Session expired or invalid" });

  // attach userId to req
  (req as any).userId = session.sid;
  next();
}
// Neon session helpers

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sid = req.cookies.sid;
  if (!sid) return res.status(401).json({ message: "Unauthorized" });

  const session = await getSession(sid);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  // Attach userId
  (req as any).userId = session.sess.userId;
  next();
};
