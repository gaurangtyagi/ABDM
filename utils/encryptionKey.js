const axios = require('axios');

async function fetchHealthIdCert() {
    try {
        const response = await axios.get('https://healthidsbx.abdm.gov.in/api/v1/auth/cert', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching certificate:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = fetchHealthIdCert;