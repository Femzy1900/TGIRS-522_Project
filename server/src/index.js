import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import gadgetRoutes from './routes/gadgetRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Setting from './models/Setting.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/gadgets', gadgetRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('TGIRS API is running...');
});

// Connect to DB and initialize settings
connectDB().then(async () => {
  // Ensure default PIN exists
  const existingPin = await Setting.findOne({ key: 'admin_pin' });
  if (!existingPin) {
    await Setting.create({ key: 'admin_pin', value: '1234' });
    console.log('Default Admin PIN (1234) initialized.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
