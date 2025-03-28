const express = require("express");
const router = express.Router();
const VerificationController = require("../controllers/VerificationController");


router.post("/send-otp", VerificationController.sendOTP);
router.post("/verify-otp", VerificationController.verifyOTP);

router.post('/request-otp-for-aadhar', VerificationController.requestOTPforAadhar);
router.post('/verify-aadhar-otp', VerificationController.verifyAadharOTP);

module.exports = router;
