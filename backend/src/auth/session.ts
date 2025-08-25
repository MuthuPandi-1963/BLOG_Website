import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq, lt } from "drizzle-orm";
import { randomUUID } from "crypto";

interface SessionData {
  userId: string;
}

export async function createSession(userId: string) {
  const sid = randomUUID();
  const expire = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day

  await db.insert(sessions).values({
    sid,
    sess: { userId },
    expire,
  });

  return { sid, expire };
}




export async function getSession(sid: string) {
  const [session] = await db.select().from(sessions).where(eq(sessions.sid, sid));
  if (!session) return null;

  // Tell TypeScript the type of session.sess
  const sess = session.sess as SessionData;

  if (!sess.userId || new Date(session.expire) < new Date()) {
    await db.delete(sessions).where(eq(sessions.sid, sid));
    return null;
  }

  return {
    sid: session.sid,
    sess,
    expire: session.expire,
  };
}

export async function deleteSession(sid: string) {
  await db.delete(sessions).where(eq(sessions.sid, sid));
}
