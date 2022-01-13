import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

import User from "../models/user.js";

dotenv.config();

function getSignUp(req, res, next) {
  res.render("auth/signUp", {
    pageTitle: "Sign up",
    errorMessage: null,
    oldInput: {
      name: null,
      surname: null,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
    },
  });
}

function getLogin(req, res, next) {
  res.render("auth/login", {
    pageTitle: "Login",
    errorMessage: null,
    oldInput: {
      username: null,
      password: null,
    }
  });
}

async function postSignUp(req, res, next) {
  const name = req.body.name;
  const surname = req.body.surname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signUp", {
      pageTitle: "Sign up",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        surname: surname,
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      surname: surname,
      username: username,
      email: email,
      password: hashedPassword,
    });
    const result = await user.save();
    res.redirect("/login");
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

async function postLogin(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        username: username,
        password: password,
      },
    });
  }
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login",
        errorMessage: "Invalid username!",
        oldInput: {
          username: username,
          password: password,
        },
      });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login",
        errorMessage: "Invalid password!",
        oldInput: {
          username: username,
          password: password,
        },
      });
    }
    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id,
      },
      process.env.PRIVATE_KEY,
      { expiresIn: "2h" }
    );
    res.cookie("token", token, { httpOnly: true });
    req.session.browser = req.headers["user-agent"];
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

function postLogout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      throw new Error(err);
    }
    res.cookie("token", "Null", { httpOnly: true });
    res.redirect("/");
  });
}

export default { getSignUp, getLogin, postSignUp, postLogin, postLogout };
