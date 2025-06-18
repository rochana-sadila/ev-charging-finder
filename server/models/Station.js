const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: String,
  plugType: String,       // e.g. Type 2, CCS, CHAdeMO
  powerKW: Number,        // Power rating
  lat: Number,
  lng: Number,
  photoUrl: String,
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Station', stationSchema);
