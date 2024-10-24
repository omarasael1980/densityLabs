import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/roles", rolRoutes);
export default app;
