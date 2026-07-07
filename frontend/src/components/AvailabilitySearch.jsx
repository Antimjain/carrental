import { useState } from 'react';
import { getAvailability } from '../api';

function AvailabilitySearch({ onBook }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const result = await getAvailability(startDate, endDate);
      if (Array.isArray(result)) {
        setCars(result);
      } else {
        setError(result.message || 'Could not load availability');
        setCars([]);
      }
      setSearched(true);
    } catch (err) {
      setError('Could not reach the server');
    }
  }

  return (
    <section>
      <h2>Search availability</h2>
      <form onSubmit={handleSubmit}>
        <label>
          From
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </label>
        <label>
          To
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </label>
        <button type="submit">Search</button>
      </form>

      {error && <p>{error}</p>}

      {searched && !error && cars.length === 0 && <p>No cars available for these dates.</p>}

      {cars.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Car</th>
              <th>Available</th>
              <th>Total price</th>
              <th>Average day price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.brand} {car.model}</td>
                <td>{car.availableStock}</td>
                <td>${car.totalPrice}</td>
                <td>${car.averageDayPrice}</td>
                <td>
                  <button type="button" onClick={() => onBook({ carId: car.id, startDate, endDate })}>
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default AvailabilitySearch;
