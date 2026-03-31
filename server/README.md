# QuizBlast — Express API Server

A lightweight Express.js REST API backed by local JSON files (no MongoDB or any external database required).

## Folder Structure

```
server/
├── index.js              ← Entry point (Express app)
├── package.json          ← Server dependencies
├── lib/
│   └── db.js             ← Local JSON ORM (find / insert / update / remove)
├── middleware/
│   └── errorHandler.js   ← 404 + error handlers
└── routes/
    ├── quizzes.js        ← /api/quizzes  (full CRUD)
    ├── users.js          ← /api/users    (full CRUD)
    └── sessions.js       ← /api/sessions (game lifecycle)

db/                       ← Lives at the project root
├── quizzes.json
├── users.json
└── sessions.json
```

## Running the Server

From the **project root** (where `package.json` lives):

```bash
# Development (auto-restarts on file changes — requires Node ≥ 18.11)
pnpm server

# Production / one-shot
pnpm server:start
```

The server starts at **http://localhost:3001**.

## Available Endpoints

| Method | Path                           | Description              |
|--------|--------------------------------|--------------------------|
| GET    | /health                        | Health check             |
| GET    | /api                           | Route map                |
| GET    | /api/quizzes                   | List all quizzes         |
| GET    | /api/quizzes/:id               | Single quiz              |
| POST   | /api/quizzes                   | Create quiz              |
| PUT    | /api/quizzes/:id               | Update quiz              |
| DELETE | /api/quizzes/:id               | Delete quiz              |
| GET    | /api/users                     | List all users           |
| GET    | /api/users/:id                 | Single user              |
| POST   | /api/users                     | Create user              |
| PUT    | /api/users/:id                 | Update user              |
| DELETE | /api/users/:id                 | Delete user              |
| POST   | /api/sessions                  | Create game session      |
| GET    | /api/sessions/:code            | Get session by room code |
| PUT    | /api/sessions/:code/join       | Player joins session     |
| PUT    | /api/sessions/:code/start      | Host starts game         |
| PUT    | /api/sessions/:code/end        | Host ends game           |
| DELETE | /api/sessions/:code            | Delete session           |

## JSON Database ORM

```js
import { getCollection } from './server/lib/db.js';

const quizzes = getCollection('quizzes');

quizzes.find();                       // all records
quizzes.find(q => q.category === 'Science'); // filtered
quizzes.findById('some-id');          // by id
quizzes.findOne(q => q.title === 'X'); // first match
quizzes.insert({ title: 'My Quiz', questions: [] });
quizzes.update('some-id', { title: 'Updated' });
quizzes.remove('some-id');
quizzes.count();
```

## Notes

- All data is stored in `db/*.json` at the project root.
- The Vite dev server proxies `/api/*` → `http://localhost:3001` automatically.
- No external database is needed — everything is plain JSON on disk.
