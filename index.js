import express from "express";
import cors from "cors";
import { authenticateJWT } from "./Middleware/authenticateJWT.js";
import { connectToDatabase } from "./db/connection.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/category.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(cors());

// Establish a database connection
const connection = await connectToDatabase();

app.get("/", (req, res) => {
  res.json("Hellooooo");
});

app.use("/", authRoute);
app.use("/category", authenticateJWT, categoryRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default connection;
