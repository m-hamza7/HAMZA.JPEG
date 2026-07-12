/**
 * server.js
 * Binds the Express app to an HTTP port.
 * Keeping this separate from app.js allows testing without starting the server.
 */

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});
