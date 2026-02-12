const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const vitalRoutes = require('./routes/vitals');
const familyRoutes = require('./routes/family');
const userRoutes = require('./routes/user');


dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception:', error);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medics';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/symptoms', require('./routes/symptoms'));
app.use('/api/heart-rate', require('./routes/heartRate'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api/content', require('./routes/content'));
app.use('/api/feedback', require('./routes/feedback'));


app.use('/api/symptoms/assessment', require('./routes/symptomAssessment'));

// Routes placeholder
app.get('/', (req, res) => {
    res.send('Medics API is running');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
