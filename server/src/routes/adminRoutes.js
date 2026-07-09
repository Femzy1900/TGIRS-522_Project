import express from 'express';
import Setting from '../models/Setting.js';

const router = express.Router();

// Verify PIN
router.post('/verify-pin', async (req, res) => {
  try {
    const { pin } = req.body;
    const adminPin = await Setting.findOne({ key: 'admin_pin' });
    
    if (!adminPin) {
      return res.status(500).json({ message: 'Admin PIN not configured.' });
    }

    if (adminPin.value === pin) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid PIN' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change PIN
router.put('/pin', async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;
    
    if (!newPin || newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      return res.status(400).json({ message: 'New PIN must be exactly 4 digits' });
    }

    const adminPin = await Setting.findOne({ key: 'admin_pin' });
    
    if (!adminPin) {
      return res.status(500).json({ message: 'Admin PIN not configured.' });
    }

    if (adminPin.value !== oldPin) {
      return res.status(401).json({ message: 'Incorrect old PIN' });
    }

    adminPin.value = newPin;
    await adminPin.save();

    res.json({ success: true, message: 'PIN updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
