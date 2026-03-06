import express from "express";
import rateLimit from "express-rate-limit";
import {
  forgotPassword,
  login,
  setPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

router.post("/login", authLimiter, login);
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/set-password", authLimiter, setPassword);
router.post("/forgot-password", authLimiter, forgotPassword);


// ===== ROLE TEST ROUTES =====

router.get(
  "/admin",
  protect,
  authorize("ADMIN"),
  (req, res) => res.json({ message: "Admin access granted" })
);

router.get(
  "/finance",
  protect,
  authorize("FINANCE"),
  (req, res) => res.json({ message: "Finance access granted" })
);

router.get(
  "/operation",
  protect,
  authorize("OPERATION"),
  (req, res) => res.json({ message: "Operation access granted" })
);

router.get("/profile", protect, (req, res) => {
  res.json({ message: "Authenticated user", user: req.user });
});

export default router;
