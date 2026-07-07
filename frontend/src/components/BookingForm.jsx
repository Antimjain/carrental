import { useState, useEffect } from 'react';
import { createBooking } from '../api';

const emptyForm = { carId: '', userId: '', startDate: '', endDate: '', licenseValidUntil: '' };

const today = new Date().toISOString().slice(0, 10);

function BookingForm({ draft, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (draft) {
      setForm({
        ...emptyForm,
        carId: String(draft.carId),
        startDate: draft.startDate,
        endDate: draft.endDate
      });
      setMessage('');
      setError('');
    }
  }, [draft]);

  if (!draft) {
    return null;
  }

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
      } else {
        setError(booking.message || 'Could not create the booking');
      }
    } catch (err) {
      setError('Could not reach the server');
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Book {draft.label}</h2>
          <button type="button" className="close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="book-user">User</label>
            <input id="book-user" type="text" value={form.userId} onChange={(e) => update('userId', e.target.value)} required />
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="book-pickup">Pick-up</label>
              <input id="book-pickup" type="date" min={today} value={form.startDate} onChange={(e) => update('startDate', e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="book-return">Return</label>
              <input id="book-return" type="date" min={form.startDate || today} value={form.endDate} onChange={(e) => update('endDate', e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="book-license">License valid until</label>
            <input id="book-license" type="date" min={form.endDate || today} value={form.licenseValidUntil} onChange={(e) => update('licenseValidUntil', e.target.value)} required />
          </div>
          <button type="submit" className="btn primary block">Confirm booking</button>
        </form>

        {message && <p className="notice success">{message}</p>}
        {error && <p className="notice error">{error}</p>}
      </div>
    </div>
  );
}

export default BookingForm;
