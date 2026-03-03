import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import customersRoutes from "./routes/customersRoutes.js";
import employeesRoutes from "./routes/employeesRoutes.js";
import warehousesRoutes from "./routes/warehousesRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import inventoryStockRoutes from "./routes/inventoryStockRoutes.js";
import inventoryMovementsRoutes from "./routes/inventoryMovementsRoutes.js";
import salesOrdersRoutes from "./routes/salesOrdersRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/warehouses", warehousesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/inventory-stock", inventoryStockRoutes);
app.use("/api/inventory-movements", inventoryMovementsRoutes);
app.use("/api/sales-orders", salesOrdersRoutes);

app.get("/", (req, res) => {
  res.send("ERP Backend Running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
