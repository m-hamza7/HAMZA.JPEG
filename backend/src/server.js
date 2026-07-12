/**
 * server.js
 * Entry point — loads env vars, boots the Express app, and starts the HTTP server.
 * Separation from app.js makes the app independently testable.
 */

require('dotenv').config();

const app = require('./app');

const PORT = parseInt(process.env.PORT || '5000', 10);

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Hmza Gallery API running on http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/health`);
  console.log(`   Photos       → http://localhost:${PORT}/photos\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n[server] ${signal} received — shutting down gracefully…`);
  server.close(() => {
    console.log('[server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
