const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medics';

async function checkUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        const users = await User.find({});
        console.log('Total users:', users.length);
        console.log('Users:', JSON.stringify(users, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
