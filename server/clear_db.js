const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medics';

async function clearUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        const result = await User.deleteMany({});
        console.log('Deleted users count:', result.deletedCount);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

clearUsers();
