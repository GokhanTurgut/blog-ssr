import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

import { get404 } from "./controllers/error.js";
import blogRoutes from "./routes/blog.js";
import authRoutes from "./routes/auth.js";
import { checkUser } from "./middleware/checkAuth.js";

const PORT = 5000;

const app = express();

dotenv.config();

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.DATABASE_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(new URL("public", import.meta.url).pathname));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(checkUser);

app.use(blogRoutes);
app.use(authRoutes);

app.use(get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server Error",
    error: error,
  });
});

try {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(err);
}
