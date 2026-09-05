import { useMemo } from 'react';
import { useEvents } from '../Context/EventContext';
import EventCard from '../Components/Common/EventCard';

function ResortsPage() {
  const { state } = useEvents();
  const resorts = useMemo(
    () => state.events.filter((event) => event.category === 'Resorts & Hotels'),
    [state.events]
  );

  return (
    <div>
      <h2 className="mb-4">Resorts & Hotels</h2>
      <div className="row g-4">
        {resorts.map((event) => (
          <div className="col-md-4 col-lg-3" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResortsPage;