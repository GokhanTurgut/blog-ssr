import express from "express";

import blogsController from "../controllers/blog.js";
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.get("/", blogsController.getIndex);

router.get('/addPost', checkAuth, blogsController.getAddPost);

export default router;
