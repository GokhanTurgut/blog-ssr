import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function checkAuth(req, res, next) {
  const token = req.cookies.token;
  if (token === 'Null') {
    return res.redirect("/");
  }
  try {
    decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decodedToken) {
      return res.redirect("/");
    }
    req.userId = decodedToken.userId;
    req.username = decodedToken.username;
    next();
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
}

export function checkUser(req, res, next) {
  if (req.session.user) {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
}
