import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createSession, deleteSession } from "./session.js";

export class AuthService {
  static async signup(email: string, password: string, firstName?: string, lastName?: string) {
    const hashed = await bcrypt.hash(password, 10);

    const [user] = await db.insert(users).values({
      email,
      password: hashed,
      firstName,
      lastName,
    }).returning();

    return user;
  }

  static async login(email: string, password: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const { sid, expire } = await createSession(user.id);

    return { user, sid, expire };
  }

  static async logout(sid: string) {
    await deleteSession(sid);
  }
}
