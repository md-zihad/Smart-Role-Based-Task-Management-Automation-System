const express = require("express");
const db = require("../config/db");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
require("dotenv").config();

const {
  getAllUser,
  createUser,
  signupUser,
  loginUser
} = require("../controllers/userController");


//User Routes
router.get("/users", auth, getAllUser);
router.post("/users", auth, createUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);



module.exports = router;
