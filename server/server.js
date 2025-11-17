// Simple entrypoint for running the NestJS backend on shared hosting.
// 
// Usage:
//   - Build the app locally: `npm run build` in the `server` folder.
//   - Upload the `dist/` folder (and node_modules if your host can't run npm).
//   - Point your hosting panel's "Application startup file" to: `server.js`
//
// This file then loads the compiled NestJS app from `dist/main.js`.

// Load environment variables from .env if present
try {
  // Optional dependency; if not installed, Nest will still load env via @nestjs/config
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  require('dotenv').config();
} catch {
  // ignore if dotenv is not available
}

// Start the compiled NestJS application
// The compiled bootstrap function lives in dist/src/main.js
// eslint-disable-next-line global-require
require('./dist/src/main');


