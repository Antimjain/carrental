import { useState, useEffect } from 'react';
import { getAvailability } from '../api';

function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.round((end - start) / 86400000);
}

const today = new Date().toISOString().slice(0, 10);

function AvailabilitySearch({ onBook, refreshSignal }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cars, setCars] = useState([]);
  const [range, setRange] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function loadAvailability(start, end) {
    setError('');
    try {
      const result = await getAvailability(start, end);
      if (Array.isArray(result)) {
        setCars(result);
        setRange({ startDate: start, endDate: end });
      } else {
        setError(result.message || 'Could not load availability');
        setCars([]);
      }
      setSearched(true);
    } catch (err) {
      setError('Could not reach the server');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    loadAvailability(startDate, endDate);
  }

  // Refresh the results after a booking so the stock reflects it.
  useEffect(() => {
    if (refreshSignal > 0 && range) {
      loadAvailability(range.startDate, range.endDate);
    }
  }, [refreshSignal]);

  const days = range ? daysBetween(range.startDate, range.endDate) : 0;

  return (
    <section>
      <form className="search-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="pickup">Pick-up</label>
          <input id="pickup" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="return">Return</label>
          <input id="return" type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn primary">Check availability</button>
      </form>

      {error && <p className="notice error">{error}</p>}

      {searched && !error && cars.length === 0 && (
        <p className="notice">No cars available for these dates.</p>
      )}

      {cars.length > 0 && range && (
        <>
          <h2 className="results-title">
            {cars.length} car{cars.length > 1 ? 's' : ''} available · {range.startDate} → {range.endDate}
          </h2>
          <div className="car-grid">
            {cars.map((car) => (
              <article className="car-card" key={car.id}>
                <div className="car-head">
                  <h3>{car.brand} {car.model}</h3>
                  <span className="stock">{car.availableStock} left</span>
                </div>
                <p className="price">${car.totalPrice}</p>
                <p className="price-sub">${car.averageDayPrice} / day avg · {days} days</p>
                <button
                  type="button"
                  className="btn primary block"
                  onClick={() => onBook({
                    carId: car.id,
                    label: `${car.brand} ${car.model}`,
                    startDate: range.startDate,
                    endDate: range.endDate
                  })}
                >
                  Book this car
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default AvailabilitySearch;
