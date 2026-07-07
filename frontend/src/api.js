const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getAvailability(startDate, endDate) {
  const res = await fetch(`${BASE_URL}/cars/availability?startDate=${startDate}&endDate=${endDate}`);
  return res.json();
}

export async function createBooking(booking) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  return res.json();
}
