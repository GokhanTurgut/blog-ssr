import express from "express";

import blogsController from "../controllers/blogs.js";

const router = express.Router();

router.get("/", blogsController.getIndex);

export default router;
