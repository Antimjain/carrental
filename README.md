# Carental - Booking MVP

A small car rental booking engine built for the Bolttech Carental fullstack test.
The MVP shows the booking motor: checking car availability for a date range and
creating bookings, with seasonal pricing.

## Stack

- Backend: Node + Express (plain JavaScript)
- Frontend: React + Vite
- Tests: Jest (+ supertest) for the backend, Vitest + Testing Library for the frontend

## Project structure

```
backend/
  src/
    domain/          business rules (cars, bookings, pricing, errors) - no framework here
    application/     use cases, one per user story
    infrastructure/  adapters: in-memory repositories and seed data
    interfaces/http/ Express server, routes and controllers
    index.js         wires everything together and starts the server
  features/          Jest tests for the domain, the use cases and the API
frontend/
  src/               React app: availability search and booking form
```

See `ARCHITECTURE.md` for the reasoning behind the layers, and `NEXT_STEPS.md`
for what a follow-up iteration would add.

## Running

Backend:

```
cd backend
npm install
npm start        # API on http://localhost:3001
npm test         # run the Jest tests
```

Frontend (in a second terminal):

```
cd frontend
npm install
npm run dev      # app on http://localhost:5173
npm test         # run the Vitest component tests
```

The frontend talks to the backend at `http://localhost:3001` by default.

## Deployment

The app is two deployables: the Express API and the static frontend build.

- **API (Render)** - `render.yaml` describes a free Node web service rooted in
  `backend`. It uses `PORT` (set by the host) and, optionally, `CORS_ORIGIN` to
  restrict which frontend origin may call it. Health check: `/health`.
- **Frontend (Vercel)** - `frontend/vercel.json` builds with Vite. Set
  `VITE_API_URL` to the deployed API URL (see `frontend/.env.example`); it is
  read at build time and falls back to `http://localhost:3001` locally.

Data is in-memory, so it resets whenever the API restarts.

## User stories

- US1: as a customer I want to see the availability of cars for a date range, with
  pricing and stock.
- US2: as a customer I want to create a booking for a car.

## API

### GET /cars/availability

Query parameters: `startDate`, `endDate` (ISO dates, `YYYY-MM-DD`).

Returns the cars that still have stock for the whole slot, each with its total
booking price and average day price.

```
GET /cars/availability?startDate=2026-06-10&endDate=2026-06-13

200 OK
[
  { "id": 1, "brand": "Toyota", "model": "Yaris", "availableStock": 3, "totalPrice": 295.29, "averageDayPrice": 98.43 },
  ...
]
```

### POST /bookings

Body:

```
{
  "carId": 1,
  "userId": "u1",
  "startDate": "2026-06-10",
  "endDate": "2026-06-13",
  "licenseValidUntil": "2027-01-01"
}

201 Created
{ "id": 1, "carId": 1, "userId": "u1", "startDate": "2026-06-10", "endDate": "2026-06-13", "licenseValidUntil": "2027-01-01", "totalPrice": 295.29 }
```

Error responses:

- `400` invalid input (missing fields, start not before end, license does not cover the period)
- `404` car does not exist
- `409` no stock for the dates, or the user already has a booking on overlapping dates

## Business rules

### Seasons

- Peak: 1 June to 15 September
- Mid: 1 March to 31 May, and 16 September to 31 October
- Off: 1 November to end of February

The ranges in the brief overlap on the boundary days; here they are made
non-overlapping so every day belongs to exactly one season.

### Pricing

Each car has a price per day for each season. The booking price adds up the price
of every day in the range using the season of that day. A slot counts the days from
the start up to (not including) the end, so 10th to 13th is 3 days. The average day
price is the total divided by the number of days.

### Booking rules

- A user can only hold one booking for a given set of dates: a new booking is
  refused if it overlaps a booking the same user already has.
- The driving license must be valid until at least the end of the slot.
- A car can only be booked while it still has stock for the requested dates.

## Storage

By default the API keeps everything in memory, so data resets when it restarts.
To use PostgreSQL instead, the repositories have a second implementation and the
storage is chosen at startup:

```
DB_DRIVER=postgres
DATABASE_URL=postgres://postgres:dev@localhost:5432/carental
```

Create the tables and seed the cars once:

```
psql "$DATABASE_URL" -f backend/db/schema.sql
```

The domain and the use cases are unchanged - only the repository adapter and one
wiring line differ. The database-backed tests in `features/pgRepository.test.js`
run only when `DB_DRIVER=postgres` is set, and are skipped otherwise.

## Notes

- In-memory storage keeps the MVP simple; the PostgreSQL adapter above shows how
  little changes when the storage does, thanks to the repository boundary.
