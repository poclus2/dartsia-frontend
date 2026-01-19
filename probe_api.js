
const axios = require('axios');

const endpoints = [
    '/stats',
    '/network',
    '/network/status',
    '/network/stats',
    '/storage',
    '/hosts/stats'
];

const run = async () => {
    console.log('Probing API endpoints...');
    for (const ep of endpoints) {
        try {
            const url = `http://localhost:3000/api/v1/explorer${ep}`;
            const res = await axios.get(url, { headers: { 'x-api-key': 'secret' } });
            console.log(`[SUCCESS] ${ep}:`, JSON.stringify(res.data).substring(0, 200));
        } catch (err) {
            console.log(`[FAILED] ${ep}: ${err.message}`);
        }
    }
};

run();
