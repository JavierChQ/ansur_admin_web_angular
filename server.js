const express = require('express');
const path = require('path');

const app = express();

const distPath = path.join(__dirname, 'dist/ansur_admin_web_angular/browser');
const publicPath = path.join(__dirname, 'public');

// Generate env.js on runtime with environment variables
app.get('/env.js', (req, res) => {
  const env = {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    APP_TITLE: process.env.APP_TITLE || 'Ansur Admin',
    ENVIRONMENT_NAME: process.env.ENVIRONMENT_NAME || 'development',
  };
  res.set('Content-Type', 'application/javascript');
  res.send(`window.__env = ${JSON.stringify(env, null, 2)};`);
});

// Serve static files from dist
app.use(express.static(distPath));

// Serve public assets
app.use(express.static(publicPath));

// SPA routing: redirect all non-file requests to index.html
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});