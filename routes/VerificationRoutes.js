const express = require("express");
const router = express.Router();
const VerificationController = require("../controllers/VerificationController");


router.post("/send-otp", VerificationController.sendOTP);
router.post("/verify-otp", VerificationController.verifyOTP);

module.exports = router;