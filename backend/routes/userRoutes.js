const express = require("express");
const router = express.Router();
const {
  signupUser,
  signinUser,
  getMe,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", signupUser);
router.post("/signin", signinUser);
router.get("/me", protect, getMe);

module.exports = router;
