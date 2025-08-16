import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';
import initializeDatabase from './database/init.js';
import apiRoutes from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Serve static assets from root public folder (for favicon and other assets)
    const publicDir = path.resolve(__dirname, '../../public');
    app.use(express.static(publicDir));

    // Gracefully serve an SVG favicon when browsers request /favicon.ico
    app.get('/favicon.ico', (_req, res) => {
      res.sendFile(path.join(publicDir, 'favicon.svg'));
    });

    // API routes
    app.use('/api', apiRoutes);

    // In development, respond on root to avoid noisy 404 logs when hitting backend directly
    if (process.env.NODE_ENV !== 'production') {
      app.get('/', (_req, res) => {
        res.status(200).send('BSL API server is running');
      });
    }

    // In production, serve built frontend from dist
    if (process.env.NODE_ENV === 'production') {
      const clientDist = path.resolve(__dirname, '../../dist');
      app.use(express.static(clientDist));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
      });
    }
    app.use(notFound);
    app.use(errorHandler);
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default app;

// For Vercel deployment
module.exports = app;
