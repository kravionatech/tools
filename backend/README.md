# Kraviona backend

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` and a long random `JWT_SECRET`.
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` only in the shell or local `.env`.
4. Run `npm install`.
5. Run `npm run create-admin` once.
6. Start with `npm run dev` locally or `npm start` in production.

The backend exposes:

- `GET /health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/analytics/events`
- `GET /api/analytics/summary` (admin token required)
- `GET/PATCH /api/settings` (admin token required)
- `GET/POST/PATCH /api/configured-apis` (admin token required)

Analytics stores a keyed hash of the visitor network address, not the raw IP address. Tool input and uploaded files are never sent to this backend.
