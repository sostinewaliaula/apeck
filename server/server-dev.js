// Development-style entrypoint for running NestJS directly from TypeScript on hosting.
// This uses ts-node to execute src/main.ts without a separate build step.
//
// Requirements on the server:
//  - node_modules installed with `ts-node` and `tsconfig-paths` available
//  - Application root pointing to the `server` folder
//  - Startup file set to `server-dev.js`
//
// Note: This is slower to start than running the compiled dist/main.js and is
// not recommended for heavy production traffic, but works on shared hosting
// when you prefer not to run a build.

// Load env variables from .env if present
try {
  // eslint-disable-next-line global-require
  require('dotenv').config();
} catch {
  // ignore if dotenv not installed
}

// Register TypeScript runtime hooks
// eslint-disable-next-line global-require
require('ts-node/register');
// eslint-disable-next-line global-require
require('tsconfig-paths/register');

// Start the NestJS app from TypeScript sources
// eslint-disable-next-line global-require
require('./src/main');


