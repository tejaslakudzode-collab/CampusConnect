const express = require('express');
const router = express.Router();

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent
} = require('../controllers/eventController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Get all events
router.get('/', getAllEvents);

// Get one event
router.get('/:id', getEventById);

// Create event (login required)
router.post('/', protect, upload.single('posterImage'), createEvent);

// Update event (login required)
router.put('/:id', protect, upload.single('posterImage'), updateEvent);

// Delete event (login required)
router.delete('/:id', protect, deleteEvent);

// Register for an event (login required)
router.post('/:id/register', protect, registerForEvent);

module.exports = router;