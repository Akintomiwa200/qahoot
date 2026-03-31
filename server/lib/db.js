/**
 * db.js – A tiny local JSON ORM.
 *
 * Provides a Collection class with find / findById / insert / update / remove
 * backed by plain JSON files in the ../../db/ directory.
 *
 * Usage:
 *   import { getCollection } from '../lib/db.js';
 *   const quizzes = getCollection('quizzes');
 *   const all     = quizzes.find();
 *   const one     = quizzes.findById('abc');
 *   const created = quizzes.insert({ title: 'New Quiz', ... });
 *   const updated = quizzes.update('abc', { title: 'Updated' });
 *   const ok      = quizzes.remove('abc');
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR    = path.resolve(__dirname, '../../db');

/**
 * Ensure the db directory exists.
 */
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// ─── helpers ────────────────────────────────────────────────────────────────

function filePath(collection) {
  return path.join(DB_DIR, `${collection}.json`);
}

/**
 * Read all records from a collection file.
 * Returns an empty array if the file doesn't exist yet.
 */
function readAll(collection) {
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, '[]', 'utf-8');
    return [];
  }
  const raw = fs.readFileSync(fp, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Persist all records to a collection file.
 */
function writeAll(collection, data) {
  fs.writeFileSync(filePath(collection), JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Collection class ────────────────────────────────────────────────────────

class Collection {
  constructor(name) {
    this.name = name;
  }

  /** Return all records; optionally filter with a predicate function. */
  find(predicate = null) {
    const data = readAll(this.name);
    return predicate ? data.filter(predicate) : data;
  }

  /** Return first record matching a predicate. */
  findOne(predicate) {
    const data = readAll(this.name);
    return data.find(predicate) ?? null;
  }

  /** Return a single record by its `id` field. */
  findById(id) {
    return this.findOne(r => r.id === id);
  }

  /**
   * Insert a new record.
   * Automatically assigns `id` (uuid-like timestamp+random) and `createdAt`.
   * Returns the inserted record.
   */
  insert(record) {
    const data = readAll(this.name);
    const newRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...record,
    };
    data.push(newRecord);
    writeAll(this.name, data);
    return newRecord;
  }

  /**
   * Update an existing record by id.
   * Deep-merges `changes` into the existing record.
   * Returns the updated record, or null if not found.
   */
  update(id, changes) {
    const data = readAll(this.name);
    const idx  = data.findIndex(r => r.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...changes, updatedAt: new Date().toISOString() };
    writeAll(this.name, data);
    return data[idx];
  }

  /**
   * Remove a record by id.
   * Returns true if removed, false if not found.
   */
  remove(id) {
    const data    = readAll(this.name);
    const newData = data.filter(r => r.id !== id);
    if (newData.length === data.length) return false;
    writeAll(this.name, newData);
    return true;
  }

  /** Return the count of records (optionally filtered). */
  count(predicate = null) {
    return this.find(predicate).length;
  }
}

// ─── Singleton cache so we don't create multiple instances ───────────────────

const cache = {};

export function getCollection(name) {
  if (!cache[name]) cache[name] = new Collection(name);
  return cache[name];
}

// Convenience named exports
export const quizzesDB  = getCollection('quizzes');
export const usersDB    = getCollection('users');
export const sessionsDB = getCollection('sessions');
