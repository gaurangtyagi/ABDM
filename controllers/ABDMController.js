require("dotenv").config();

const axios = require('axios');
const fetchHealthIdCert = require("../utils/encryptionKey");
const crypto = require('crypto');
const encryptData = require("../utils/encryptData");
const { v4: uuidv4 } = require('uuid');

const fetchAccessToken = async (req, res) => {

    try {

        console.log('accessToken'); 

        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
        const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

        const response = await axios.post(
            'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions',
            {
                clientId: clientId,
                clientSecret: clientSecret,
                grantType: 'client_credentials',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'REQUEST-ID': '9914d941-a354-4ed4-b23c-0b9a9a02334a',
                    'TIMESTAMP': new Date().toISOString(),
                    'X-CM-ID': 'sbx'
                },
                withCredentials: true,
            }
        ); 

        console.log(response.data);
        res.status(200).json({ access_token: response.data.accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const sendOtp = async (req, res) => {
    
    try {
        console.log('send otp'); 
        const { aadhar, accessToken } = req.body;

        if (!aadhar || !accessToken) {
            return res.status(400).json({ message: "Please provide both aadhar and accessToken" });
        }

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp';
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
            "txnId": "",
            "scope": ["abha-enrol"],
            "loginHint": "aadhaar",
            "loginId": loginId,
            "otpSystem": "aadhaar"
        };

        console.log(data); 
        const response = await axios.post(url, data, { headers });
        
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const verifyOtp = async (req, res) => {

    try {
        console.log('verify status'); 

        const { txnId, otp, mobile, accessToken } = req.body;

        if (!txnId || !otp || !mobile || !accessToken) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar';

        const headers = {
            'Content-Type': 'application/json',
            'TIMESTAMP': new Date().toISOString(),
            'REQUEST-ID': crypto.randomUUID(),
            'Authorization': `Bearer ${accessToken}`
        };

        const publickey = await fetchHealthIdCert();

        const otp_value = encryptData(otp, publickey);

        const data = {
            authData: {
                authMethods: ["otp"],
                otp: {
                    txnId,
                    otpValue: otp_value,
                    mobile
                }
            },
            consent: {
                code: "abha-enrollment",
                version: "1.4"
            }
        };

        const response = await axios.post(url, data, { headers });
        return res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getProfile = async (req, res) => {

    try {

        console.log('profile'); 

        const { accessToken, X_Token } = req.body; 

        if (!accessToken || !X_Token) {
            return res.status(400).json({ message: "Please provide both accessToken and X_Token" });
        }

        const url = 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha-card';

        const headers = {
            'X-Token': `Bearer ${X_Token}`,
            'REQUEST-ID': crypto.randomUUID(),
            'TIMESTAMP': new Date().toISOString(),
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.get(url, {
            headers,
            responseType: 'arraybuffer' 
        });

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'inline; filename="abha-card.png"');

        res.send(response.data);
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}


module.exports = {
    fetchAccessToken,
    sendOtp,
    verifyOtp,
    getProfile
}
