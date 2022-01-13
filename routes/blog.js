import express from "express";
import { body } from "express-validator";

import blogsController from "../controllers/blog.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", blogsController.getIndex);

router.get("/post/:postId", blogsController.getPostById);

router.get("/addPost", checkAuth, blogsController.getAddPost);

router.get("/myPosts", checkAuth, blogsController.getMyPosts);

router.get("/post/edit/:postId", checkAuth, blogsController.getEditPostById);

router.post(
  "/post/delete/:postId",
  checkAuth,
  blogsController.postDeletePostById
);

router.post(
  "/post/edit/:postId",
  checkAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long."),
    body("description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."),
    body("content")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long."),
  ],
  blogsController.postEditPostById
);

router.post(
  "/addPost",
  checkAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long."),
    body("description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."),
    body("content")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long."),
  ],
  blogsController.postAddPost
);

export default router;
