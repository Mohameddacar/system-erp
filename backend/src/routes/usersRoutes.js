import express from "express";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "../controllers/adminUsersController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN"));

router.get("/", getAdminUsers);
router.post("/", createAdminUser);
router.put("/:id", updateAdminUser);
router.delete("/:id", deleteAdminUser);

export default router;
