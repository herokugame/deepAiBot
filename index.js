// const express = require('express');
// const dotenv = require('dotenv');
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

let fetch;

// Use dynamic import to load 'node-fetch' as a CommonJS module
(async () => {
  fetch = (await import('node-fetch')).default;

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.static('public'));

  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
  });

  app.post('/generate-text', async (req, res) => {
    const textgen = req.body.text;

    const url = 'https://api.deepai.org/api/text-generator';
    const apiKey = process.env.API_KEY;

    const formData = new URLSearchParams();
    formData.append('text', textgen);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed (${response.status}): ${await response.text()}`);
      }

      const data = await response.json();
      res.json({ output: data.output });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
