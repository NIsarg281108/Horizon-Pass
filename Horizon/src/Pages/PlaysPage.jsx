import { useMemo } from 'react';
import { useEvents } from '../Context/EventContext';
import EventCard from '../Components/Common/EventCard';

function PlaysPage() {
  const { state } = useEvents();
  const plays = useMemo(
    () => state.events.filter((event) => event.category === 'Plays'),
    [state.events]
  );

  return (
    <div>
      <h2 className="mb-4">Plays</h2>
      <div className="row g-4">
        {plays.map((event) => (
          <div className="col-md-4 col-lg-3" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaysPage;