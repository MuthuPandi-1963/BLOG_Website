import { Router } from "express";
import { AuthService } from "../auth/authservice.js";
import { requireAuth } from "../auth/middleware.js";

export const AuthRoutes = Router();

// Signup
AuthRoutes.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await AuthService.signup(email, password, firstName, lastName);
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
AuthRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, sid, expire } = await AuthService.login(email, password);

    // store sid in httpOnly cookie
    res.cookie("sid", sid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expire,
    });

    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Logout
AuthRoutes.post("/logout", async (req, res) => {
  try {
    const sid = req.cookies.sid;
    if (sid) {
      await AuthService.logout(sid);
      res.clearCookie("sid");
    }
    res.json({ success: true, message: "Logged out" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Profile (Protected)
AuthRoutes.get("/profile", requireAuth, async (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    userId: (req as any).userId,
  });
});

