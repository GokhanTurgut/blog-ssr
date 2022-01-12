import express from "express";
import { check } from "express-validator";

import User from "../models/user.js";
import authController from "../controllers/auth.js";

const router = express.Router();

router.get("/signup", authController.getSignUp);

router.get("/login", authController.getLogin);

router.post(
  "/signup",
  [
    check("username")
      .trim()
      .isAlphanumeric()
      .custom((value, { req }) =>
        User.findOne({ username: value }).then((user) => {
          if (user) {
            throw new Error("Username already exists!");
          }
          return true;
        })
      ),
    check("email")
      .isEmail()
      .withMessage("Email is not valid!")
      .normalizeEmail()
      .custom((value, { req }) =>
        User.findOne({ email: value }).then((user) => {
          if (user) {
            throw new Error("Email already exists!");
          }
          return true;
        })
      ),
    check("password")
      .isLength({ min: 6 })
      .withMessage(
        "Password must contain numbers and letters and must be at least 6 characters long."
      )
      .isAlphanumeric()
      .trim(),
    check("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords does not match!");
        }
        return true;
      }),
  ],
  authController.postSignUp
);

router.post(
  "/login",
  [
    check("username").trim().isAlphanumeric(),
    check("password")
      .isLength({ min: 6 })
      .withMessage(
        "Password must contain numbers and letters and must be at least 6 characters long."
      )
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

export default router;
