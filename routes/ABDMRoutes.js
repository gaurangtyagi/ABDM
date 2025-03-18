const express = require("express");
const router = express.Router();
const ABDMController = require("../controllers/ABDMController");

router.get("/access-token", ABDMController.fetchAccessToken); 
router.post("/send-otp", ABDMController.sendOtp);
router.post("/verify-otp", ABDMController.verifyOtp);
router.post("/profile", ABDMController.getProfile);

module.exports = router;