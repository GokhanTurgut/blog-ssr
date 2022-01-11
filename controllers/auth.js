import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import User from "../models/user.js";

function getSignUp(req, res, next) {
  res.render("signUp", { pageTitle: "Sign up", errorMessage: null });
}

function getLogin(req, res, next) {
  res.render("login", { pageTitle: "Login" });
}

async function postSignUp(req, res, next) {
  const name = req.body.name;
  const surname = req.body.surname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("signUp", {
      pageTitle: "Sign up",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
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
    console.log(result);
    res.redirect("/login");
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

function postLogin(req, res, next) {}

export default { getSignUp, getLogin, postSignUp, postLogin };
