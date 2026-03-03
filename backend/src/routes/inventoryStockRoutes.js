import express from "express";
import {
  createInventoryStock,
  deleteInventoryStock,
  getInventoryStock,
  updateInventoryStock,
} from "../controllers/inventoryStockController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN", "OPERATION"));

router.get("/", getInventoryStock);
router.post("/", createInventoryStock);
router.put("/:id", updateInventoryStock);
router.delete("/:id", deleteInventoryStock);

export default router;
