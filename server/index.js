/**
 * server/index.js – QuizBlast Express API
 *
 * Start:  node index.js        (or: npm run dev in /server)
 * Base:   http://localhost:3001
 * API:    http://localhost:3001/api
 *
 * No external database needed – all data lives in /db/*.json files.
 */

import express from 'express';
import cors    from 'cors';
import path    from 'path';
import { fileURLToPath } from 'url';

import quizzesRouter  from './routes/quizzes.js';
import usersRouter    from './routes/users.js';
import sessionsRouter from './routes/sessions.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT      = process.env.PORT ?? 3001;

const app = express();

// ── Core middleware ───────────────────────────────────────────────────────────

app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite default
    'http://localhost:3000',
    'http://localhost:4173',  // Vite preview
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev only) ─────────────────────────────────────────────────

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'QuizBlast API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    db: 'local-json',
  });
});

// ── API routes ────────────────────────────────────────────────────────────────

app.use('/api/quizzes',  quizzesRouter);
app.use('/api/users',    usersRouter);
app.use('/api/sessions', sessionsRouter);

// ── API index (route map) ─────────────────────────────────────────────────────

app.get('/api', (_req, res) => {
  res.json({
    success: true,
    service: 'QuizBlast API',
    version: '1.0.0',
    endpoints: {
      health:   'GET  /health',
      quizzes:  [
        'GET    /api/quizzes',
        'GET    /api/quizzes/:id',
        'POST   /api/quizzes',
        'PUT    /api/quizzes/:id',
        'DELETE /api/quizzes/:id',
      ],
      users: [
        'GET    /api/users',
        'GET    /api/users/:id',
        'POST   /api/users',
        'PUT    /api/users/:id',
        'DELETE /api/users/:id',
      ],
      sessions: [
        'POST   /api/sessions',
        'GET    /api/sessions/:code',
        'PUT    /api/sessions/:code/join',
        'PUT    /api/sessions/:code/start',
        'PUT    /api/sessions/:code/end',
        'DELETE /api/sessions/:code',
      ],
    },
  });
});

// ── 404 & error handlers (must be last) ──────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🎮  QuizBlast API running on http://localhost:${PORT}`);
  console.log(`📋  Route map:  http://localhost:${PORT}/api`);
  console.log(`❤️   Health:     http://localhost:${PORT}/health`);
  console.log(`📁  Database:   ../db/*.json\n`);
});

export default app;
