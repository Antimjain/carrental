import { useState } from 'react';
import AvailabilitySearch from './components/AvailabilitySearch';
import BookingForm from './components/BookingForm';

function App() {
  const [draft, setDraft] = useState(null);

  return (
    <main>
      <h1>Carental</h1>
      <AvailabilitySearch onBook={setDraft} />
      <BookingForm draft={draft} />
    </main>
  );
}

export default App;
