
import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express"; // Correct import statement
import prisma from "./db/DB";
import  authRoutes from "./routes/auth.route";

// Load environment variables from .env file


if (prisma) {
  console.log("🚀 Prisma is connected to the database! ✅");
}

const app: express.Application = express();

// Parse incoming JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the authentication routes
app.use("/api/auth", authRoutes);

// Define a simple route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
