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

## Tests

Server tests (Jest + Supertest):

```powershell
cd e:\coffee-tea-shop\server
npm i
npm run test
```
> server@1.0.0 test
> cross-env NODE_ENV=test jest --runInBand

 PASS  tests/orders.test.js
  ● Console

    console.log
      [dotenv@17.2.1] injecting env (2) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env
' }

      at _log (node_modules/dotenv/lib/main.js:139:11)


Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.576 s, estimated 1 s


## Environment
- `server/.env`
```
DATABASE_URL="postgresql://app:app@localhost:5433/coffee_tea?schema=public"
CLIENT_ORIGINS=http://localhost:5173
PORT=4000
```


