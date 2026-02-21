const express = require('express');
const router = express.Router();

// Mock data for consultancies
const consultancies = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "General Physician",
        distance: "0.8 km",
        location: "Green Valley Medical Center",
        rating: 4.8,
        reviews: 124,
        available: "9:00 AM - 5:00 PM",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Cardiologist",
        distance: "1.2 km",
        location: "City Heart Hospital",
        rating: 4.9,
        reviews: 89,
        available: "10:30 AM - 6:30 PM",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        name: "Dr. Priya Sharma",
        specialty: "Dermatologist",
        distance: "2.5 km",
        location: "Skin & Care Clinic",
        rating: 4.7,
        reviews: 210,
        available: "11:00 AM - 8:00 PM",
        image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        id: 4,
        name: "Dr. Robert Wilson",
        specialty: "Pediatrician",
        distance: "3.1 km",
        location: "Kids Health Trust",
        rating: 4.6,
        reviews: 156,
        available: "8:00 AM - 4:00 PM",
        image: "https://randomuser.me/api/portraits/men/91.jpg"
    },
    {
        id: 5,
        name: "Dr. Elena Rodriguez",
        specialty: "Neurologist",
        distance: "4.2 km",
        location: "Neuroscience Institute",
        rating: 4.9,
        reviews: 67,
        available: "1:00 PM - 7:00 PM",
        image: "https://randomuser.me/api/portraits/women/22.jpg"
    }
];

// GET /api/consultancies
router.get('/', (req, res) => {
    const { search, category } = req.query;
    let filtered = [...consultancies];

    if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.specialty.toLowerCase().includes(query) ||
            c.location.toLowerCase().includes(query)
        );
    }

    if (category && category !== 'All') {
        filtered = filtered.filter(c => c.specialty === category);
    }

    res.json(filtered);
});

// POST /api/consultancies/book
router.post('/book', require('../middleware/auth'), async (req, res) => {
    try {
        const { doctorName, specialty } = req.body;
        const Notification = require('../models/Notification');
        const Appointment = require('../models/Appointment');

        // Create Token ID (e.g., MED-1234)
        const tokenId = `MED-${Math.floor(1000 + Math.random() * 9000)}`;

        // Save Appointment
        const appointment = new Appointment({
            user_id: req.user.id,
            doctor_name: doctorName,
            specialty: specialty,
            token_id: tokenId
        });
        await appointment.save();

        // Create a real notification
        const newNotification = new Notification({
            user_id: req.user.id,
            title: 'Appointment Confirmed! 🏥',
            message: `Your appointment with ${doctorName} (${specialty}) has been scheduled successfully. Token: ${tokenId}`,
            type: 'system'
        });

        await newNotification.save();
        res.json({ message: 'Booking successful', appointment, tokenId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during booking' });
    }
});

// GET /api/consultancies/my-bookings
router.get('/my-bookings', require('../middleware/auth'), async (req, res) => {
    try {
        const Appointment = require('../models/Appointment');
        const bookings = await Appointment.find({ user_id: req.user.id, status: 'scheduled' }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
});

module.exports = router;
