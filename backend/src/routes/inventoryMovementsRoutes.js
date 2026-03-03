import express from "express";
import {
  createInventoryMovement,
  deleteInventoryMovement,
  getInventoryMovements,
  updateInventoryMovement,
} from "../controllers/inventoryMovementsController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN", "OPERATION"));

router.get("/", getInventoryMovements);
router.post("/", createInventoryMovement);
router.put("/:id", updateInventoryMovement);
router.delete("/:id", deleteInventoryMovement);

export default router;
