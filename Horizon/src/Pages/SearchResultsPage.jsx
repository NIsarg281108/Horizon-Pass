import { useSearchParams } from 'react-router';
import { useMemo } from 'react';
import { useEvents } from '../Context/EventContext';
import EventCard from '../Components/Common/EventCard';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { state } = useEvents();

  const filteredEvents = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return state.events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.venue.toLowerCase().includes(lowerQuery) ||
        event.category.toLowerCase().includes(lowerQuery)
    );
  }, [state.events, query]);

  return (
    <div>
      <h2 className="mb-4">Search Results for "{query}"</h2>
      {filteredEvents.length === 0 ? (
        <p>No events found. Try a different keyword.</p>
      ) : (
        <div className="row g-4">
          {filteredEvents.map((event) => (
            <div className="col-md-4 col-lg-3" key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;