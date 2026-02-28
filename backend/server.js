import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import analyzeRoute from './routes/analyze.js';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/analyze', analyzeRoute);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DermaScan API running' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ... ${process.env.PORT || 5000}`);
});