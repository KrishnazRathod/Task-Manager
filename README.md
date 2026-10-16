Task Manager

Users can create tasks, edit them, move them through **To do → In progress → Done**, set priority and due date, search, and delete.

## Stack

- **MongoDB** — task documents
- **Express** — REST API (`/api/tasks`)
- **React** (Vite) — UI
- **Node.js**

## Run locally

**1. Start MongoDB** (pick one)

```bash
docker compose up -d
```

Or use a local MongoDB at `mongodb://127.0.0.1:27017/taskmanager`, or set `MONGO_URI` in `server/.env` to an Atlas connection string.

**2. Install and start**

```bash
npm run install:all
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:5000/api/health

Copy `server/.env.example` to `server/.env` if you need to change ports or the database URI.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness |
| GET | `/api/tasks?status=&q=&priority=` | List / filter / search |
| POST | `/api/tasks` | Create |
| GET | `/api/tasks/:id` | Read one |
| PATCH | `/api/tasks/:id` | Update |
| DELETE | `/api/tasks/:id` | Delete |

Task fields: `title`, `description`, `status` (`todo` \| `in_progress` \| `done`), `priority` (`low` \| `medium` \| `high`), `dueDate`, `createdAt`, `updatedAt`.

## Project layout

```
client/   React + Vite UI
server/   Express + Mongoose API
docker-compose.yml   local MongoDB
```
