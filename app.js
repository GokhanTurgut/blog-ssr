import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { get404 } from "./controllers/error.js";
import blogRoutes from "./routes/blog.js";
import authRoutes from "./routes/auth.js";

const PORT = 5000;

const app = express();

dotenv.config();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(new URL("public", import.meta.url).pathname));

app.use(blogRoutes);
app.use(authRoutes);

app.use(get404);

try {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(err);
}
