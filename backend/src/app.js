/**
 * app.js
 * Express application factory.
 * Kept separate from server.js so the app is testable without binding to a port.
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const photoRoutes   = require('./routes/photoRoutes');
const errorHandler  = require('./middleware/errorHandler');

const app = express();

// ─── Global middleware ─────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
}));

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────

// Health check — useful for Railway / Render liveness probes
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/photos', photoRoutes);

// Catch-all for undefined routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Centralised error handler (must be last) ──────────────────────────────

app.use(errorHandler);

module.exports = app;
