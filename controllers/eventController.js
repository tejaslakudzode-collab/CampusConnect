const Event = require('../models/Event');

// @desc Create a new event
// @route POST /api/events
// @access Private
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, venue } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            venue,
            posterImage: req.file ? req.file.filename : '',
            organizer: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
};

// @desc Get all events
// @route GET /api/events
// @access Public
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events',
            error: error.message
        });
    }
};

// @desc Get single event
// @route GET /api/events/:id
// @access Public
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event',
            error: error.message
        });
    }
};

// @desc Update an event
// @route PUT /api/events/:id
// @access Private
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to update this event'
            });
        }

        const allowedFields = ['title', 'description', 'date', 'venue'];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        if (req.file) {
            event.posterImage = req.file.filename;
        }

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: error.message
        });
    }
};

// @desc Delete an event
// @route DELETE /api/events/:id
// @access Private
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete this event'
            });
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message
        });
    }
};

// @desc Register for an event
// @route POST /api/events/:id/register
// @access Private
exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const alreadyRegistered = event.registeredUsers.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        event.registeredUsers.push(req.user._id);
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully registered for the event'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to register for event',
            error: error.message
        });
    }
};