const crypto = require('crypto');

function encryptData(input, publicKey) {
    try {
        const buffer = Buffer.from(input, 'utf8');
        const encrypted = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha1'
            },
            buffer);
        return encrypted.toString('base64');
    } catch (error) {
        console.error('Error encrypting data:', error.message);
        throw error;
    }
}

module.exports = encryptData;