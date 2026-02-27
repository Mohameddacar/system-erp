import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/customersController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN", "FINANCE", "OPERATION"));

router.get("/", getCustomers);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
