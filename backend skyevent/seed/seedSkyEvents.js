require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const SkyEvent = require('../models/SkyEvent');

const sampleEvents = [
  {
    name: 'Perseids Meteor Shower',
    type: 'Meteor Shower',
    description: 'Annual Perseids meteor shower, best viewed in dark locations.',
    date: '2026-08-12',
    startTime: '22:00',
    endTime: '04:00',
    visibility: 'Northern Hemisphere',
    location: 'Dark sky locations',
    image: 'https://example.com/perseids.jpg'
  },
  {
    name: 'Geminids Meteor Shower',
    type: 'Meteor Shower',
    description: 'The Geminids are a prolific meteor shower lasting several days.',
    date: '2026-12-14',
    startTime: '21:00',
    endTime: '05:00',
    visibility: 'Both Hemispheres',
    location: 'Wide dark sky areas',
    image: 'https://example.com/geminids.jpg'
  },
  {
    name: 'Total Lunar Eclipse',
    type: 'Lunar Eclipse',
    description: 'A total lunar eclipse visible over multiple continents.',
    date: '2026-05-16',
    startTime: '03:30',
    endTime: '06:00',
    visibility: 'Asia, Australia',
    location: 'Night-side of Earth',
    image: 'https://example.com/lunar-eclipse.jpg'
  },
  {
    name: 'Annular Solar Eclipse',
    type: 'Solar Eclipse',
    description: 'Annular solar eclipse with a visible ring of fire along path.',
    date: '2026-10-02',
    startTime: '09:00',
    endTime: '12:00',
    visibility: 'South America',
    location: 'Path of annularity',
    image: 'https://example.com/solar-eclipse.jpg'
  },
  {
    name: 'Jupiter Opposition',
    type: 'Planetary Event',
    description: 'Jupiter at opposition, excellent for planetary observation.',
    date: '2026-09-26',
    startTime: '20:00',
    endTime: '23:00',
    visibility: 'Global',
    location: 'Visible from dark skies',
    image: 'https://example.com/jupiter.jpg'
  }
];

const run = async () => {
  try {
    await connectDB();
    // clear existing
    await SkyEvent.deleteMany({});
    const created = await SkyEvent.insertMany(sampleEvents);
    console.log('Inserted sample sky events:', created.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
