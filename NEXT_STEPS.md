# Next steps

This is an MVP focused on the booking motor. If this moved towards a real product,
the next things I would add, roughly in order:

## Persistence
- Replace the in-memory repositories with a database (for example Postgres). Because
  storage sits behind repository ports, this is a new adapter, not a rewrite of the
  use cases.

## Domain
- Make the price a value object with a currency, instead of a plain number.
- Model the license as a value object that knows how to check validity.
- Add a real user concept instead of a plain user id string.

## API
- Input validation with a schema (for example zod or joi) at the edge.
- Pagination and filtering on availability.
- An endpoint to list or cancel a user's bookings.

## Frontend
- Pick a car from a proper list instead of typing the car id (the Book button
  already carries the id, this would remove the manual field).
- Loading and disabled states, and form-level validation messages.
- Basic styling; the current UI is intentionally plain to focus on functionality.

## Quality
- More edge case tests (leap years, very long ranges crossing several seasons).
- End to end test of the availability to booking flow.
- CI running the test suite on every push.
