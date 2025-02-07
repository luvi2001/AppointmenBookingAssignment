const express = require('express');
const router = express.Router();
const { createAppointmentSlot } = require('../controllers/appointmentController');

// POST route to create an appointment slot
router.post('/create', createAppointmentSlot);

module.exports = router;
