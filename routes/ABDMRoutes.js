const express = require("express");
const router = express.Router();
const ABDMController = require("../controllers/ABDMController");
const profileController = require("../controllers/profileController");
const { upload, uploadbuffer } = require("../middleware/uploadMiddleware");

router.get("/access-token", ABDMController.fetchAccessToken); 
router.post("/send-otp", ABDMController.sendOtp);
router.post("/verify-otp", ABDMController.verifyOtp);
router.post("/profile", ABDMController.getProfile);
router.post("/profile/qr", ABDMController.getQR);
router.post("/profile/account", ABDMController.getAccount);

router.put('/update/profile-picture', uploadbuffer.fields([
    { name: 'photo', maxCount: 1 },
]),profileController.updateProfilePicture); 

router.put('/update/profile-mobile', profileController.updateProfileMobile);
router.put('/update/profile-email', profileController.updateProfilePicture); 

module.exports = router;
