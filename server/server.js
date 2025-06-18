// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load .env variables

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err);
});

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Mongoose schema
const Station = mongoose.model('Station', new mongoose.Schema({
  name: String,
  plugType: String,
  powerKW: Number,
  latitude: Number,
  longitude: Number,
  photoUrl: String,
}));

// Routes
app.post('/api/stations', upload.single('photo'), async (req, res) => {
  const { name, plugType, powerKW, latitude, longitude } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newStation = new Station({ name, plugType, powerKW, latitude, longitude, photoUrl });
  await newStation.save();
  res.status(201).json(newStation);
});

app.get('/api/stations', async (req, res) => {
  const stations = await Station.find();
  res.json(stations);
});

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
