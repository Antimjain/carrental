import { useState } from 'react';
import AvailabilitySearch from './components/AvailabilitySearch';
import BookingForm from './components/BookingForm';

function App() {
  const [draft, setDraft] = useState(null);

  return (
    <main className="page">
      <header className="hero">
        <span className="badge">BARCELONA · MVP</span>
        <h1>Carental</h1>
        <p className="tagline">Pick your dates, see live pricing per season, book in one step.</p>
      </header>

      <AvailabilitySearch onBook={setDraft} />
      <BookingForm draft={draft} onClose={() => setDraft(null)} />
    </main>
  );
}

export default App;
