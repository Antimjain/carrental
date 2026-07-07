# Carental - Booking MVP

A small car rental booking engine built for the Bolttech Carental fullstack test.
The goal of this MVP is to show the booking motor: checking car availability for a
date range and creating bookings.

## Stack

- Backend: Node + Express (plain JavaScript)
- Frontend: React + Vite
- Tests: Jest

## Project structure

```
backend/
  src/
    domain/          business rules (cars, bookings, pricing) - no framework here
    application/     use cases, one per user story
    infrastructure/  adapters: in-memory repositories and seed data
    interfaces/http/ Express server, routes and controllers
    index.js         wires everything together and starts the server
  features/          Jest tests for the use cases
frontend/
  src/               React app: availability search and booking form
```

The backend follows a hexagonal / layered approach. The `domain` layer has no
dependency on Express or storage, so the rules can be tested on their own and the
outer adapters (HTTP, in-memory storage) can be swapped later.

## User stories

- US1: as a customer I want to see the availability of cars for a date range, with
  pricing and stock.
- US2: as a customer I want to create a booking for a car.

## Running

Backend:

```
cd backend
npm install
npm start        # API on http://localhost:3001
npm test         # run the Jest tests
```

Frontend:

```
cd frontend
npm install
npm run dev      # app on http://localhost:5173
```

## Seasons and pricing

- Peak: 1 June to 15 September
- Mid: 15 September to 31 October, and 1 March to 1 June
- Off: 1 November to 1 March

Each car has a price per day for each season. The booking price adds up the price of
every day in the range using the season of that day.
