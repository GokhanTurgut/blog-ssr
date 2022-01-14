import { marked } from "marked";
import DOMPurifyCreator from "dompurify";
import { JSDOM } from "jsdom";
import { validationResult } from "express-validator";

import Post from "../models/post.js";

const DOMPurify = DOMPurifyCreator(new JSDOM().window);

async function getIndex(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: "desc" });
    res.render("index", { pageTitle: "gusto-Blogs", posts: posts });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

async function getPostById(req, res) {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post does not exist!");
      error.statusCode = 404;
      throw error;
    }
    res.render("blog/post", {
      pageTitle: post.title,
      post: post,
    });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

function getAddPost(req, res) {
  res.render("blog/addPost", {
    pageTitle: "Add Post",
    errorMessage: null,
    oldInput: {
      title: null,
      imageURL: null,
      description: null,
      content: null,
    },
  });
}

async function getMyPosts(req, res) {
  const userId = req.userId;
  try {
    const posts = await Post.find({ creatorId: userId });
    res.render("blog/myPosts", {
      pageTitle: "My Posts",
      posts: posts,
    });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

async function getEditPostById(req, res) {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.render("blog/editPost", {
      pageTitle: "Edit Post",
      post: post,
      errorMessage: null,
    });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

async function postAddPost(req, res) {
  const title = req.body.title;
  let imageURL = req.body.imageURL;
  const description = req.body.description;
  const content = req.body.content;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("blog/addPost", {
      pageTitle: "Add Post",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: title,
        imageURL: imageURL,
        description: description,
        content: content,
      },
    });
  }

  if (!imageURL) {
    imageURL = "images/default-photo.webp";
  }

  const sanitizedContent = DOMPurify.sanitize(marked(content));

  const post = new Post({
    title: title,
    imageURL: imageURL,
    description: description,
    content: content,
    sanitizedContent: sanitizedContent,
    creator: req.username,
    creatorId: req.userId,
  });

  try {
    const result = await post.save();
    res.redirect(`/post/${post._id}`);
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

async function postDeletePostById(req, res) {
  const postId = req.params.postId;
  try {
    const result = await Post.findByIdAndDelete(postId);
    res.redirect("/myPosts");
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

async function postEditPostById(req, res) {
  const title = req.body.title;
  let imageURL = req.body.imageURL;
  const description = req.body.description;
  const content = req.body.content;
  const postId = req.params.postId;

  const oldPost = { title, imageURL, description, content, _id: postId };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("blog/editPost", {
      pageTitle: "Edit Post",
      post: oldPost,
      errorMessage: errors.array()[0].msg,
    });
  }

  if (!imageURL) {
    imageURL = "images/default-photo.webp";
  }

  const sanitizedContent = DOMPurify.sanitize(marked(content));

  try {
    const post = await Post.findById(postId);
    if (post.creatorId.toString() !== req.userId.toString()) {
      return res.redirect("/");
    }
    post.title = title;
    post.imageURL = imageURL;
    post.description = description;
    post.content = content;
    post.sanitizedContent = sanitizedContent;
    await post.save();
    res.redirect("/myPosts");
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

export default {
  getIndex,
  getPostById,
  getAddPost,
  getMyPosts,
  getEditPostById,
  postAddPost,
  postEditPostById,
  postDeletePostById,
};
