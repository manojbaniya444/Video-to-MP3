const express = require("express");
const {
  registerUser,
  loginUser,
  checkAuth,
  logoutUser,
} = require("../controller/user.controller");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/auth", checkAuth);

module.exports = router;
