const express = require('express');
const multer = require('multer');
const Station = require('../models/Station');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.single('photo'), async (req, res) => {
  try {
    const { name, plugType, powerKW, lat, lng } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newStation = new Station({
      name,
      plugType,
      powerKW: Number(powerKW),
      lat: Number(lat),
      lng: Number(lng),
      photoUrl,
    });

    await newStation.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const { plugType, minPower } = req.query;

    const filter = {};
    if (plugType && plugType !== 'all') filter.plugType = plugType;
    if (minPower) filter.powerKW = { $gte: Number(minPower) };

    const stations = await Station.find(filter);
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
