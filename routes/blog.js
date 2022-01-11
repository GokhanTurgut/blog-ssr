import express from "express";

import blogsController from "../controllers/blog.js";

const router = express.Router();

router.get("/", blogsController.getIndex);

export default router;
