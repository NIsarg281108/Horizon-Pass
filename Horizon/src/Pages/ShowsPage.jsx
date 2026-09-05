import { useMemo } from 'react';
import { useEvents } from '../Context/EventContext';
import EventCard from '../Components/Common/EventCard';

function ShowsPage() {
  const { state } = useEvents();
  const shows = useMemo(
    () => state.events.filter((event) => event.category === 'Shows'),
    [state.events]
  );

  return (
    <div>
      <h2 className="mb-4">Shows</h2>
      <div className="row g-4">
        {shows.map((event) => (
          <div className="col-md-4 col-lg-3" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowsPage;