require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./database');

const app = express();

// connect MongoDB first
connectDB();

app.use(cors());
app.use(express.json());

// serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes
app.use('/api/chat', require('./backend/routes/chat'));
app.use('/api/confessions', require('./backend/routes/confessions'));
app.use('/api/games', require('./backend/routes/games'));
app.use('/api/admin', require('./backend/routes/admin'));

// frontend page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'frontend/index.html')));
app.get('/games', (req, res) => res.sendFile(path.join(__dirname, 'frontend/games.html')));
app.get('/confess', (req, res) => res.sendFile(path.join(__dirname, 'frontend/confess.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'frontend/admin.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Simi is live on http://localhost:${PORT}`));