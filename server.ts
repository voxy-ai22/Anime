import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  const API_KEY = process.env.ANIME_API_KEY || process.env.VITE_ANIME_API_KEY;
  const NEOXR_KEY = process.env.NEOXR_API_KEY || process.env.VITE_NEOXR_API_KEY;
  
  const EXTERNAL_BASE_URL = 'https://api.ferdev.my.id/internet/animekuindo';
  const NEOXR_BASE_URL = 'https://api.neoxr.eu/api';

  // API Proxy Routes (FerDev)
  app.get('/api/anime/search', async (req, res) => {
    try {
      const { query } = req.query;
      const response = await fetch(`${EXTERNAL_BASE_URL}/search?query=${encodeURIComponent(query as string)}&apikey=${API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('FerDev Search Error:', error);
      res.status(500).json({ success: false, message: 'Server proxy error' });
    }
  });

  // API Proxy Routes (Neoxr Otakudesu)
  app.get('/api/neoxr/search', async (req, res) => {
    try {
      const { q } = req.query;
      const response = await fetch(`${NEOXR_BASE_URL}/otakudesu?q=${encodeURIComponent(q as string)}&apikey=${NEOXR_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Neoxr Search Error:', error);
      res.status(500).json({ success: false, message: 'Neoxr proxy error' });
    }
  });

  app.get('/api/neoxr/get', async (req, res) => {
    try {
      const { url } = req.query;
      const response = await fetch(`${NEOXR_BASE_URL}/otakudesu-get?url=${encodeURIComponent(url as string)}&apikey=${NEOXR_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Neoxr Detail Error:', error);
      res.status(500).json({ success: false, message: 'Neoxr proxy error' });
    }
  });

  app.get('/api/neoxr/stream', async (req, res) => {
    try {
      const { url } = req.query;
      const response = await fetch(`${NEOXR_BASE_URL}/otakudesu-stream?url=${encodeURIComponent(url as string)}&apikey=${NEOXR_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Neoxr Stream Error:', error);
      res.status(500).json({ success: false, message: 'Neoxr proxy error' });
    }
  });

  app.get('/api/anime/detail', async (req, res) => {
    try {
      const { bookUrl } = req.query;
      const response = await fetch(`${EXTERNAL_BASE_URL}/detail?bookUrl=${encodeURIComponent(bookUrl as string)}&apikey=${API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('FerDev Detail Error:', error);
      res.status(500).json({ success: false, message: 'Server proxy error' });
    }
  });

  app.get('/api/anime/stream', async (req, res) => {
    try {
      const { episodeUrl } = req.query;
      const response = await fetch(`${EXTERNAL_BASE_URL}/stream?episodeUrl=${encodeURIComponent(episodeUrl as string)}&apikey=${API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('FerDev Stream Error:', error);
      res.status(500).json({ success: false, message: 'Server proxy error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
