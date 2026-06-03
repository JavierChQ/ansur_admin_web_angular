const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
const targetPath = path.resolve(process.cwd(), 'public', 'env.js');

const parsed = dotenv.config({ path: envPath }).parsed || {};

const env = {
  API_BASE_URL: parsed.API_BASE_URL || 'http://localhost:3000',
  APP_TITLE: parsed.APP_TITLE || 'Ansur Admin',
  ENVIRONMENT_NAME: parsed.ENVIRONMENT_NAME || 'development',
};

const output = `window.__env = ${JSON.stringify(env, null, 2)};\n`;
fs.writeFileSync(targetPath, output, 'utf-8');
console.log(`Generated ${path.relative(process.cwd(), targetPath)}`);
