const mongoose = require('mongoose');
const HealthBotSession = require('./models/HealthBotSession');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medics';

async function reset() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ email: 'tester@test.com' });
    if (user) {
        await HealthBotSession.deleteMany({ user_id: user._id });
        console.log('Cleared sessions for tester@test.com');
    }

    await mongoose.disconnect();
}

reset();
