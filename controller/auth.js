const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandle");
const jwt = require("jsonwebtoken"); // to generate jwt token
const expressJWT = require("express-jwt"); // for authorization

exports.signUp = (req, res) => {
  // console.log("req.body", req.body);
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({
      user,
    });
  });
};

exports.signIn = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res
        .status(400)
        .json({ error: "User with that email does not exists. Please signup" });
    }
    // If user is founded make sure the email and password are match
    // Create authenticate method in user model
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password are not match" });
    }
    // Generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT);
    // Persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // Return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Sign Out Success!" });
};

exports.requestSignin = expressJWT({
  secret: process.env.JWT,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied!",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    // bug not respone when admin requrest
    return res.status(403).json({
      error: "Admin resourse! Access denied",
    });
  }
  next();
};
