const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medics';

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        await User.updateOne({ email: 'tester@test.com' }, { $set: { vaultPin: null } });
        console.log('Reset vaultPin for tester@test.com');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
run();
