import express from "express";
import morgan from "morgan";
import cors from "cors";
import { BACKEND_PORT } from "./config/index.js";
import routes from "./routes/index.js";
import sequelize from "./database/conexion.js";

const port = BACKEND_PORT || 3000;
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// database
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ alter: true });
    console.log("Database synced.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

initializeDatabase();

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api", routes);

// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
