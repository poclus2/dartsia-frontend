
const axios = require('axios');

const run = async () => {
    try {
        console.log('Fetching recent transactions...');
        const recent = await axios.get('http://localhost:3000/api/v1/explorer/tx/recent?limit=1', {
            headers: { 'x-api-key': 'secret' }
        });

        if (recent.data && recent.data.length > 0) {
            const txId = recent.data[0].id; // Simplified object
            console.log(`Fetching details for TX ID: ${txId}`);

            // Now fetch full details
            const detail = await axios.get(`http://localhost:3000/api/v1/explorer/tx/${txId}`, {
                headers: { 'x-api-key': 'secret' }
            });

            console.log(JSON.stringify(detail.data, null, 2));
        } else {
            console.log('No recent transactions found.');
        }
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
};

run();
