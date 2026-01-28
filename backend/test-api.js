const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
    console.log('🧪 Testing Backend API...\n');

    // Test 1: Check if server is running
    try {
        console.log('1️⃣ Testing server connection...');
        const res = await axios.get('http://localhost:5000');
        console.log('✅ Server is running:', res.data);
    } catch (error) {
        console.log('❌ Server connection failed:', error.message);
        return;
    }

    // Test 2: Register a new user
    try {
        console.log('\n2️⃣ Testing user registration...');
        const registerData = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'test123456'
        };
        const res = await axios.post(`${API_URL}/auth/register`, registerData);
        console.log('✅ Registration successful:', res.data);

        // Test 3: Login with the new user
        console.log('\n3️⃣ Testing user login...');
        const loginData = {
            email: registerData.email,
            password: registerData.password
        };
        const loginRes = await axios.post(`${API_URL}/auth/login`, loginData);
        console.log('✅ Login successful');
        console.log('   Token:', loginRes.data.token.substring(0, 20) + '...');
        console.log('   User:', loginRes.data.user);

        const token = loginRes.data.token;

        // Test 4: Get events
        console.log('\n4️⃣ Testing events endpoint...');
        const eventsRes = await axios.get(`${API_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Events fetched:', eventsRes.data.length, 'events found');

        // Test 5: Get user bookings
        console.log('\n5️⃣ Testing bookings endpoint...');
        const bookingsRes = await axios.get(`${API_URL}/bookings/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Bookings fetched:', bookingsRes.data.length, 'bookings found');

        console.log('\n🎉 All tests passed!');

    } catch (error) {
        console.log('❌ Test failed:', error.response?.data || error.message);
    }
}

testBackend();
