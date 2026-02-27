import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import customersRoutes from "./routes/customersRoutes.js";
import employeesRoutes from "./routes/employeesRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employees", employeesRoutes);

app.get("/", (req, res) => {
  res.send("ERP Backend Running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
