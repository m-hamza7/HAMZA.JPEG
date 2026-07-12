/**
 * app.js
 * Configures and exports the Express application.
 * Does NOT start the HTTP server — that lives in server.js.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const photoRoutes = require('./routes/photoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────

// CORS — allows the Vite frontend (and future n8n automation) to call the API.
// In production, restrict `origin` to your specific frontend domain.
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'POST', 'DELETE'],
  })
);

// Parse JSON bodies (for future non-multipart endpoints)
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/photos', photoRoutes);

// ─── 404 Catch-All ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Centralised Error Handler ────────────────────────────────────────────────
// Must be registered last — Express identifies error middleware by its 4-argument signature.
app.use(errorHandler);

module.exports = app;
