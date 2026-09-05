import { useMemo } from 'react';
import { useEvents } from '../Context/EventContext';
import EventCard from '../Components/Common/EventCard';

function MoviesPage() {
  const { state } = useEvents();
  const movies = useMemo(
    () => state.events.filter((event) => event.category === 'Resorts & Hotels'),
    [state.events]
  );

  return (
    <div>
      <h2 className="mb-4">Movies</h2>
      <div className="row g-4">
        {movies.map((event) => (
          <div className="col-md-4 col-lg-3" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoviesPage;