require("dotenv").config();

const axios = require('axios');
const fetchHealthIdCert = require("../utils/encryptionKey");
const encryptData = require("../utils/encryptData");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const updateProfilePicture = async (req, res) => {

    try {
        console.log('update profile picture');

        const { accessToken, X_Token } = req.body;

        console.log({ accessToken: accessToken, X_Token: X_Token });

        if (!accessToken || !X_Token) {
            return res.status(400).json({ message: "Please provide both accessToken and X-accessToken" });
        }

        if (!req.files) {
            return res.status(400).json({ message: "Please provide a file" });
        }

        const photo = req.files.photo[0].buffer.toString('base64'); 

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account';

        const headers = {
            'X-token': `Bearer ${X_Token}`,
            'REQUEST-ID': crypto.randomUUID(),
            'TIMESTAMP': new Date().toISOString(),
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
        };

        // const publickey = await fetchHealthIdCert();
        // const encrypted_photo = encryptData(photo, publickey);

        const data = {
            profilePhoto: photo
        }

        const response = await axios.patch(url, data, { headers });

        console.log(response); 
        res.status(response.status).json(response.data);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateProfileEmail = async (req, res) => {
    try {
        console.log('update profile email');

        const { accessToken, X_Token } = req.body;

        console.log({ accessToken: accessToken, X_Token: X_Token });

        if (!accessToken || !X_Token) {
            return res.status(400).json({ message: "Please provide both accessToken and X-accessToken" });
        }

        if (!req.body.email) {
            return res.status(400).json({ message: "Please provide an email" });
        }

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account';

        const headers = {
            'X-token': `Bearer ${X_Token}`,
            'REQUEST-ID': crypto.randomUUID(),
            'TIMESTAMP': new Date().toISOString(),
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
        };

        const data = {
            email: req.body.email
        }

        const response = await axios.patch(url, data, { headers });

        console.log(response); 
        res.status(response.status).json(response.data);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}   

const updateProfileMobile = async (req, res) => {
    try {
        console.log('update profile mobile');

        const { accessToken, X_Token } = req.body;

        console.log({ accessToken: accessToken, X_Token: X_Token });

        if (!accessToken || !X_Token) {
            return res.status(400).json({ message: "Please provide both accessToken and X-accessToken" });
        }

        if (!req.body.mobile) {
            return res.status(400).json({ message: "Please provide a mobile" });
        }

        const publickey = await fetchHealthIdCert();
        const encryptedMobile = encryptData(req.body.mobile, publickey);

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/otp';

        const headers = {
            'X-token': `Bearer ${X_Token}`,
            'REQUEST-ID': crypto.randomUUID(),
            'TIMESTAMP': new Date().toISOString(),
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
        };

        const data = {
            scope: ["abha-profile", "mobile-verify"],
            loginHint: "mobile",
            loginId: encryptedMobile,
            otpSystem: "abdm"
        }

        const response = await axios.patch(url, data, { headers });

        console.log(response); 
        res.status(response.status).json(response.data);

    } catch (err) {
        console.log(err); 
        res.status(500).json({ message: err.message });
    }
}   

module.exports = {
    updateProfilePicture,
    updateProfileMobile
};
