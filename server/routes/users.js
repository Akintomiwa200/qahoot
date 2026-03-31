/**
 * routes/users.js
 *
 * GET    /api/users            – list all users
 * GET    /api/users/:id        – get a single user
 * POST   /api/users            – create a user
 * PUT    /api/users/:id        – update a user
 * DELETE /api/users/:id        – delete a user
 */

import { Router } from 'express';
import { usersDB } from '../lib/db.js';

const router = Router();

// ── GET /api/users ───────────────────────────────────────────────────────────

router.get('/', (_req, res) => {
  const users = usersDB.find();
  // Never expose passwords
  const safe = users.map(({ password: _p, ...u }) => u);
  res.json({ success: true, count: safe.length, data: safe });
});

// ── GET /api/users/:id ───────────────────────────────────────────────────────

router.get('/:id', (req, res) => {
  const user = usersDB.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  const { password: _p, ...safe } = user;
  res.json({ success: true, data: safe });
});

// ── POST /api/users ──────────────────────────────────────────────────────────

router.post('/', (req, res) => {
  const { username, email, role } = req.body;

  if (!username || !email) {
    return res.status(400).json({ success: false, error: 'username and email are required' });
  }

  // Prevent duplicate usernames / emails
  const duplicate = usersDB.findOne(
    u => u.username === username || u.email === email
  );
  if (duplicate) {
    return res.status(409).json({ success: false, error: 'username or email already exists' });
  }

  const user = usersDB.insert({ username, email, role: role ?? 'player' });
  const { password: _p, ...safe } = user;
  res.status(201).json({ success: true, data: safe });
});

// ── PUT /api/users/:id ───────────────────────────────────────────────────────

router.put('/:id', (req, res) => {
  const existing = usersDB.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'User not found' });

  const updated = usersDB.update(req.params.id, req.body);
  const { password: _p, ...safe } = updated;
  res.json({ success: true, data: safe });
});

// ── DELETE /api/users/:id ────────────────────────────────────────────────────

router.delete('/:id', (req, res) => {
  const removed = usersDB.remove(req.params.id);
  if (!removed) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, message: 'User deleted' });
});

export default router;
