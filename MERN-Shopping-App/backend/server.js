require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');
const billsRouter = require('./routes/bills');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

// Routes
// Keep existing items router mounted during migration
app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/bills', billsRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Bill Splitter API running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
