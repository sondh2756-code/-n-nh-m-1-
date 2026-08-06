const mongoose = require('mongoose');

const SkyEventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        'Meteor Shower',
        'Solar Eclipse',
        'Lunar Eclipse',
        'Planetary Event',
        'Comet',
        'Other'
      ]
    },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    visibility: { type: String },
    location: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkyEvent', SkyEventSchema);
