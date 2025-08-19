# Leaf & Bean — Coffee & Tea Shop

A simple full‑stack demo app.

## Stack
- Client: React + Vite + React Router
- Server: Express + Prisma
- DB: PostgreSQL (Docker Compose)

## Quick start

1. Start PostgreSQL (Docker):

```powershell
cd e:\coffee-tea-shop
docker-compose up -d db
```

2. Server (first time):

```powershell
cd e:\coffee-tea-shop\server
# set envs
copy .env.example .env
# install deps
npm i
# generate prisma client & migrate & seed
npx prisma generate
npx prisma migrate dev -n init
node prisma/seed.js
# run server
npm start
```

3. Client:

```powershell
cd e:\coffee-tea-shop\client
npm i
$env:VITE_API_URL="http://localhost:4000/api"; npm run dev
```

Open http://localhost:5173

## Environment
- `server/.env`
```
DATABASE_URL="postgresql://app:app@localhost:5433/coffee_tea?schema=public"
CLIENT_ORIGINS=http://localhost:5173
PORT=4000
```

## Notes
- Reviews and auth are minimal; localStorage login for demo.
- Orders validate product existence and email and return totals.
- Update images in `server/public/images` or use remote URLs.
