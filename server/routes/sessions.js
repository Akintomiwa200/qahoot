/**
 * routes/sessions.js
 *
 * Game session lifecycle:
 *   POST   /api/sessions            – create a new game session (host starts a quiz)
 *   GET    /api/sessions/:code      – get session by room-code
 *   PUT    /api/sessions/:code/join – a player joins the waiting room
 *   PUT    /api/sessions/:code/start – host starts the game
 *   PUT    /api/sessions/:code/end   – host ends the game + records scores
 *   DELETE /api/sessions/:code      – discard a session
 */

import { Router } from 'express';
import { sessionsDB, quizzesDB } from '../lib/db.js';

const router = Router();

/** Generate a 6-char uppercase room code */
function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ── POST /api/sessions ───────────────────────────────────────────────────────

router.post('/', (req, res) => {
  const { quizId, hostId } = req.body;

  if (!quizId || !hostId) {
    return res.status(400).json({ success: false, error: 'quizId and hostId are required' });
  }

  const quiz = quizzesDB.findById(quizId);
  if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });

  // Ensure room code is unique
  let code;
  do { code = makeRoomCode(); } while (sessionsDB.findOne(s => s.code === code));

  const session = sessionsDB.insert({
    code,
    quizId,
    hostId,
    status: 'waiting',      // waiting | active | ended
    players: [],             // [{ id, name, score }]
    currentQuestion: 0,
    startedAt: null,
    endedAt: null,
  });

  res.status(201).json({ success: true, data: session });
});

// ── GET /api/sessions/:code ──────────────────────────────────────────────────

router.get('/:code', (req, res) => {
  const session = sessionsDB.findOne(s => s.code === req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
  res.json({ success: true, data: session });
});

// ── PUT /api/sessions/:code/join ─────────────────────────────────────────────

router.put('/:code/join', (req, res) => {
  const { playerId, playerName } = req.body;
  if (!playerId || !playerName) {
    return res.status(400).json({ success: false, error: 'playerId and playerName are required' });
  }

  const session = sessionsDB.findOne(s => s.code === req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
  if (session.status !== 'waiting') {
    return res.status(409).json({ success: false, error: 'Game already started or ended' });
  }

  // Prevent duplicate players
  if (session.players.some(p => p.id === playerId)) {
    return res.json({ success: true, data: session, message: 'Already joined' });
  }

  const updatedPlayers = [...session.players, { id: playerId, name: playerName, score: 0 }];
  const updated = sessionsDB.update(session.id, { players: updatedPlayers });
  res.json({ success: true, data: updated });
});

// ── PUT /api/sessions/:code/start ────────────────────────────────────────────

router.put('/:code/start', (req, res) => {
  const session = sessionsDB.findOne(s => s.code === req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
  if (session.status !== 'waiting') {
    return res.status(409).json({ success: false, error: 'Session is not in waiting state' });
  }

  const updated = sessionsDB.update(session.id, {
    status: 'active',
    startedAt: new Date().toISOString(),
    currentQuestion: 0,
  });
  res.json({ success: true, data: updated });
});

// ── PUT /api/sessions/:code/end ──────────────────────────────────────────────

router.put('/:code/end', (req, res) => {
  const { scores } = req.body;   // optional: final scores array [{ id, score }]

  const session = sessionsDB.findOne(s => s.code === req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

  let players = session.players;
  if (Array.isArray(scores)) {
    players = players.map(p => {
      const entry = scores.find(s => s.id === p.id);
      return entry ? { ...p, score: entry.score } : p;
    });
  }

  const updated = sessionsDB.update(session.id, {
    status: 'ended',
    endedAt: new Date().toISOString(),
    players,
  });
  res.json({ success: true, data: updated });
});

// ── DELETE /api/sessions/:code ───────────────────────────────────────────────

router.delete('/:code', (req, res) => {
  const session = sessionsDB.findOne(s => s.code === req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
  sessionsDB.remove(session.id);
  res.json({ success: true, message: 'Session deleted' });
});

export default router;
