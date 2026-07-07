import { useState } from "react";
import AvailabilitySearch from "./components/AvailabilitySearch";
import BookingForm from "./components/BookingForm";

function App() {
    const [draft, setDraft] = useState(null);
    const [refreshSignal, setRefreshSignal] = useState(0);

    return (
        <main className="page">
            <header className="hero">
                <span className="badge">BARCELONA</span>
                <h1>Carental</h1>
                <p className="tagline">
                    Pick your dates, see live pricing per season, book in one
                    step.
                </p>
            </header>

            <AvailabilitySearch onBook={setDraft} refreshSignal={refreshSignal} />
            <BookingForm
                draft={draft}
                onClose={() => setDraft(null)}
                onRefresh={() => setRefreshSignal((n) => n + 1)}
            />
        </main>
    );
}

export default App;
