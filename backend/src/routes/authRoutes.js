import express from "express";
import { login, forgotPassword } from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);


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
