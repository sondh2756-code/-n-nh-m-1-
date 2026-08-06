require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const skyEventRoutes = require('./routes/skyEventRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// connect to DB
connectDB();

// middleware
app.use(express.json());

// routes
app.use('/api/sky-events', skyEventRoutes);

// health
app.get('/', (req, res) => res.json({ success: true, message: 'AI Sky Portal API' }));

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
