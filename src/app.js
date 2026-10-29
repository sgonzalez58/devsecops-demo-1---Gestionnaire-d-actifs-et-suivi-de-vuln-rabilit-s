const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const corsOptions = {
	origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
};

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
		timestamp: new Date().toISOString()
	});
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ressource introuvable' });
});

module.exports = app;