const mongoose = require('mongoose');
const SkyEvent = require('../models/SkyEvent');

// GET /api/sky-events
const getSkyEvents = async (req, res, next) => {
  try {
    const events = await SkyEvent.find().sort({ date: 1 });
    return res.json({ success: true, data: events });
  } catch (err) {
    return next(err);
  }
};

// GET /api/sky-events/:id
const getSkyEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const event = await SkyEvent.findById(id);
    if (!event) return res.status(404).json({ success: false, message: 'Sky event not found' });
    return res.json({ success: true, data: event });
  } catch (err) {
    return next(err);
  }
};

// POST /api/sky-events
const createSkyEvent = async (req, res, next) => {
  try {
    const { name, type, description, date } = req.body;
    if (!name || !type || !description || !date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const created = await SkyEvent.create(req.body);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

// PUT /api/sky-events/:id
const updateSkyEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const updated = await SkyEvent.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Sky event not found' });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

// DELETE /api/sky-events/:id
const deleteSkyEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const deleted = await SkyEvent.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Sky event not found' });
    return res.json({ success: true, data: deleted });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getSkyEvents,
  getSkyEventById,
  createSkyEvent,
  updateSkyEvent,
  deleteSkyEvent
};
