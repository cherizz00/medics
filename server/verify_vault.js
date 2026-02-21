const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';
let token = '';

async function login() {
    console.log('--- Logging in ---');
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'tester@test.com', password: 'password' })
    });
    const data = await res.json();
    token = data.token;
    console.log('Login success');
}

async function testVault() {
    console.log('--- Testing Vault Status ---');
    const statusRes = await fetch(`${API_BASE}/vault/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const status = await statusRes.json();
    console.log('Status:', status);

    console.log('--- Setting PIN (0000) ---');
    const setRes = await fetch(`${API_BASE}/vault/set-pin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin: '0000' })
    });
    console.log('Set PIN Result:', await setRes.json());

    console.log('--- Unlocking with WRONG PIN (1111) ---');
    const unlockFailRes = await fetch(`${API_BASE}/vault/unlock`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin: '1111' })
    });
    console.log('Unlock Fail Result (Expected 400):', unlockFailRes.status, await unlockFailRes.json());

    console.log('--- Unlocking with CORRECT PIN (0000) ---');
    const unlockSuccessRes = await fetch(`${API_BASE}/vault/unlock`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin: '0000' })
    });
    console.log('Unlock Success Result:', await unlockSuccessRes.json());
}

async function run() {
    try {
        await login();
        await testVault();
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

run();
