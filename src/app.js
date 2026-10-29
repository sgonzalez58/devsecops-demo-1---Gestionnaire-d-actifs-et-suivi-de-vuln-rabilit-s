const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
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