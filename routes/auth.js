const express = require("express");
const router = express.Router();

const { signUp, signIn, signOut, requestSignin } = require("../controller/auth");
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.get("/hello",requestSignin, (req, res) => {
  res.send("Hello there");
});

module.exports = router;
