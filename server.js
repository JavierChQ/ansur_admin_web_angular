const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const distPath = path.join(__dirname, 'dist/ansur_admin_web_angular/browser');
const publicPath = path.join(__dirname, 'public');

// Serve static files from dist
app.use(express.static(distPath));

// Serve public assets
app.use(express.static(publicPath));

// SPA routing: redirect all non-file requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});