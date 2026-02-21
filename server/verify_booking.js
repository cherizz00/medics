const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medics';

async function verify() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ email: 'tester@test.com' });
    if (!user) {
        console.log('Test user not found');
    } else {
        const bookings = await Appointment.find({ user_id: user._id });
        console.log(`Found ${bookings.length} bookings for tester@test.com`);
        bookings.forEach(b => {
            console.log(`- Token: ${b.token_id}, Doctor: ${b.doctor_name}, Specialty: ${b.specialty}`);
        });
    }

    await mongoose.disconnect();
}

verify();
