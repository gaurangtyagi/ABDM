require("dotenv").config();

const axios = require('axios');
const crypto = require('crypto');
const fetchHealthIdCert = require("../utils/encryptionKey");
const encryptData = require("../utils/encryptData");
const { v4: uuidv4 } = require('uuid');

const sendOTP = async (req, res) => {

    try {   
        const { loginHint, key, accessToken } = req.body; 

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp'; 

        if (!accessToken || !loginHint || !key) {
            return res.status(400).json({ error: 'Missing access token or encrypted mobile number' });
        }

        const headers = {
            'Content-Type': 'application/json',
            'TIMESTAMP': new Date().toISOString(),
            'REQUEST-ID': crypto.randomUUID(),
            'Authorization': `Bearer ${accessToken}`
        };

        const publicKey = await fetchHealthIdCert(); 

        const loginId = encryptData(key, publicKey); 

        const data = {
            scope: ["abha-login", "mobile-verify"],
            loginHint: loginHint,
            loginId: loginId,
            otpSystem: 'abdm'
        }

        const response = await axios.post(url, data, { headers });
        res.status(200).json(response.data);

    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data?.message || "Error from external API",
                error: err.response.data
            });
        }
        res.status(500).json({ message: err.message }); 
    }
}

const verifyOTP = async (req, res) => {

    try {
        const { otp, txnId, accessToken } = req.body;

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify';

        if (!accessToken || !otp || !txnId) {
            return res.status(400).json({ error: 'Missing access token or otp or txnId' });
        }

        const headers = {
            'Content-Type': 'application/json',
            'TIMESTAMP': new Date().toISOString(),
            'REQUEST-ID': crypto.randomUUID(),
            'Authorization': `Bearer ${accessToken}`
        };

        const publicKey = await fetchHealthIdCert();
        const encryptedOTP = encryptData(otp, publicKey);

        const data = {
            scope: ["abha-login", "mobile-verify"],
            authData: {
                authMethods: ["otp"],
                otp: {
                    txnId: txnId,
                    otpValue: encryptedOTP
                }
            }
        };

        const response = await axios.post(url, data, { headers });
        res.status(200).json(response.data);

    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data?.message || "Error from external API",
                error: err.response.data
            });
        }
        res.status(500).json({ message: err.message }); 
    }
}

const requestOTPforAadhar = async (req, res) => {

    try {
        const { aadhar, accessToken } = req.body;

        if (!aadhar || !accessToken) {
            return res.status(400).json({ error: 'Missing access token or encrypted mobile number' });
        }

        if (!/^\d{12}$/.test(aadhar)) {
            return res.status(400).json({ message: "Invalid Aadhar number. It must be a 12-digit number." });
        }

        const url = "https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp";
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();

        const headers = {
            'Content-Type': 'application/json',
            'REQUEST-ID': requestId,
            'TIMESTAMP': timestamp,
            'Authorization': `Bearer ${accessToken}`
        };

        const publickey = await fetchHealthIdCert();

        const loginId = encryptData(aadhar, publickey);

        const data = {
            scope: ["abha-login", "aadhaar-verify"],
            loginHint: "aadhaar",
            loginId: loginId,
            otpSystem: "aadhaar"
        };

        const response = await axios.post(url, data, { headers });
        res.status(200).json(response.data);
    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data?.message || "Error from external API",
                error: err.response.data
            });
        }
        res.status(500).json({ message: err.message }); 
    }
}

const verifyAadharOTP = async (req, res) => {

    try {

        const { otp, txnId, accessToken } = req.body;

        if (!accessToken || !otp || !txnId) {
            return res.status(400).json({ error: 'Missing access token or otp or txnId' });
        }

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify';
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();

        const headers = {
            'Content-Type': 'application/json',
            'REQUEST-ID': requestId,
            'TIMESTAMP': timestamp,
            'Authorization': `Bearer ${accessToken}`
        };

        const publickey = await fetchHealthIdCert();
        const encryptedOTP = encryptData(otp, publickey);

        const data = {
            scope: ["abha-login", "aadhaar-verify"],
            authData: {
                authMethods: ["otp"],
                otp: {
                    txnId: txnId,
                    otpValue: encryptedOTP
                }
            }
        };

        const response = await axios.post(url, data, { headers });
        res.status(200).json(response.data);

    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data?.message || "Error from external API",
                error: err.response.data
            });
        }
        res.status(500).json({ message: err.message }); 
    }
}

module.exports = {
    sendOTP,
    verifyOTP,
    requestOTPforAadhar,
    verifyAadharOTP
}
