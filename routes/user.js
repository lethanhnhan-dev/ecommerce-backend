const express = require("express");
const router = express.Router();

const { requestSignin, isAuth, isAdmin } = require("../controller/auth");
const { userById, getProfileUser, updateProfileUser } = require("../controller/user");
const { userSignupValidator } = require("../validator");

router.get("/secret/:userId", requestSignin, isAuth, isAdmin, (req, res) => {
  res.json({ user: req.profile });
});

router.get('/user/:userId',requestSignin, isAuth, getProfileUser )
router.post('/user/:userId',requestSignin, isAuth, updateProfileUser )

router.param("userId", userById);

module.exports = router;
