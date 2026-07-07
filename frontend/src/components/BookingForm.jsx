import { useState, useEffect } from 'react';
import { createBooking } from '../api';

const emptyForm = { carId: '', userId: '', startDate: '', endDate: '', licenseValidUntil: '' };

function BookingForm({ draft }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (draft) {
      setForm((current) => ({
        ...current,
        carId: String(draft.carId),
        startDate: draft.startDate,
        endDate: draft.endDate
      }));
    }
  }, [draft]);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const booking = await createBooking({ ...form, carId: Number(form.carId) });
      if (booking.id) {
        setMessage(`Booking #${booking.id} confirmed. Total price: $${booking.totalPrice}`);
        setForm(emptyForm);
      } else {
        setError(booking.message || 'Could not create the booking');
      }
    } catch (err) {
      setError('Could not reach the server');
    }
  }

  return (
    <section>
      <h2>Book a car</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Car id
          <input type="number" value={form.carId} onChange={(e) => update('carId', e.target.value)} required />
        </label>
        <label>
          User
          <input type="text" value={form.userId} onChange={(e) => update('userId', e.target.value)} required />
        </label>
        <label>
          From
          <input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} required />
        </label>
        <label>
          To
          <input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} required />
        </label>
        <label>
          License valid until
          <input type="date" value={form.licenseValidUntil} onChange={(e) => update('licenseValidUntil', e.target.value)} required />
        </label>
        <button type="submit">Book</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </section>
  );
}

export default BookingForm;
