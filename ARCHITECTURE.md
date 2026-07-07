# Architecture

The backend is organised in layers (a hexagonal / ports and adapters style). The
goal is to keep the business rules independent from Express and from how data is
stored, so they are easy to read and easy to test.

## Layers

```
interfaces/http  ->  application  ->  domain
       |                                 ^
       v                                 |
infrastructure  --------------------------
```

- **domain** - the core rules with no external dependency:
  - `car/Car`, `booking/Booking` - entities.
  - `car/CarRepository`, `booking/BookingRepository` - ports (interfaces) the
    application depends on.
  - `pricing/Season`, `pricing/PriceCalculator` - the season and price rules.
  - `errors` - validation, not found and conflict error types.
- **application** - one use case per user story:
  - `GetAvailableCars` (US1) and `CreateBooking` (US2). They orchestrate the
    domain and the repositories, and they own the business decisions.
- **infrastructure** - the adapters that implement the ports:
  - `InMemoryCarRepository`, `InMemoryBookingRepository` and the seed `data/cars`.
- **interfaces/http** - the delivery mechanism: Express server, routes and thin
  controllers that translate HTTP to use case calls and errors to status codes.
- **index.js** - the composition root: it builds every object and wires the graph
  in one place.

## Why this shape

- The domain and application layers can be unit tested without starting a server.
- The repositories are ports, so the in-memory storage can be replaced by a
  database later without touching the use cases (dependency inversion).
- Controllers stay thin: all the rules live in the use cases, not in HTTP handlers.

## SOLID and patterns in use

- **Single responsibility**: season resolution, price calculation, availability and
  booking each live in their own unit.
- **Dependency inversion**: use cases depend on repository ports, not on concrete
  storage. Dependencies are injected through the constructor.
- **Repository pattern**: data access is hidden behind `CarRepository` and
  `BookingRepository`.
- **Factory functions** build the controllers, keeping them decoupled from the
  wiring.

## Testing

Backend tests live in `backend/features` and follow a given/when/then style:

- `season` and `price` - pure domain unit tests.
- `availability` and `booking` - use case tests with the in-memory repositories.
- `availabilityApi` and `bookingApi` - HTTP tests with supertest.

The frontend has component tests next to the components (Vitest + Testing
Library, jsdom). They render `AvailabilitySearch` and `BookingForm` with the
API module mocked, and check the search results, the prefilled booking modal and
the confirmation and error messages.
