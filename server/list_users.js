const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medics';

async function listUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        const users = await User.find({});
        console.log('--- USER LIST ---');
        users.forEach(u => {
            console.log(`ID: ${u._id}, Name: ${u.name}, Phone: ${u.phoneNumber}, Hash: ${u.password.substring(0, 10)}...`);
        });
        console.log('--- END LIST ---');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listUsers();
