import express from "express";
import {
  createSalesOrder,
  deleteSalesOrder,
  getSalesOrders,
  updateSalesOrder,
} from "../controllers/salesOrdersController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN", "OPERATION"));

router.get("/", getSalesOrders);
router.post("/", createSalesOrder);
router.put("/:id", updateSalesOrder);
router.delete("/:id", deleteSalesOrder);

export default router;
