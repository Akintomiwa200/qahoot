/**
 * routes/quizzes.js
 *
 * GET    /api/quizzes          – list all quizzes (supports ?category=&difficulty= filters)
 * GET    /api/quizzes/:id      – get a single quiz
 * POST   /api/quizzes          – create a new quiz
 * PUT    /api/quizzes/:id      – replace/update a quiz
 * DELETE /api/quizzes/:id      – delete a quiz
 */

import { Router } from 'express';
import { quizzesDB } from '../lib/db.js';

const router = Router();

// ── GET /api/quizzes ─────────────────────────────────────────────────────────

router.get('/', (req, res) => {
  const { category, difficulty, search } = req.query;

  let quizzes = quizzesDB.find();

  if (category)   quizzes = quizzes.filter(q => q.category?.toLowerCase() === category.toLowerCase());
  if (difficulty) quizzes = quizzes.filter(q => q.difficulty?.toLowerCase() === difficulty.toLowerCase());
  if (search)     quizzes = quizzes.filter(q =>
    q.title?.toLowerCase().includes(search.toLowerCase()) ||
    q.description?.toLowerCase().includes(search.toLowerCase())
  );

  res.json({ success: true, count: quizzes.length, data: quizzes });
});

// ── GET /api/quizzes/:id ─────────────────────────────────────────────────────

router.get('/:id', (req, res) => {
  const quiz = quizzesDB.findById(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });
  res.json({ success: true, data: quiz });
});

// ── POST /api/quizzes ─────────────────────────────────────────────────────────

router.post('/', (req, res) => {
  const { title, description, category, difficulty, hostId, questions } = req.body;

  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'title and at least one question are required',
    });
  }

  const quiz = quizzesDB.insert({
    title,
    description: description ?? '',
    category:    category    ?? 'General',
    difficulty:  difficulty  ?? 'medium',
    hostId:      hostId      ?? 'guest',
    questions,
  });

  res.status(201).json({ success: true, data: quiz });
});

// ── PUT /api/quizzes/:id ─────────────────────────────────────────────────────

router.put('/:id', (req, res) => {
  const existing = quizzesDB.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Quiz not found' });

  const updated = quizzesDB.update(req.params.id, req.body);
  res.json({ success: true, data: updated });
});

// ── DELETE /api/quizzes/:id ──────────────────────────────────────────────────

router.delete('/:id', (req, res) => {
  const removed = quizzesDB.remove(req.params.id);
  if (!removed) return res.status(404).json({ success: false, error: 'Quiz not found' });
  res.json({ success: true, message: 'Quiz deleted' });
});

export default router;
