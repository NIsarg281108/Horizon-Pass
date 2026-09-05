import { useMemo } from 'react';
import { useEvents } from '../Context/EventContext';
import EventCard from '../Components/Common/EventCard';

function ActivitiesPage() {
  const { state } = useEvents();
  const activities = useMemo(
    () => state.events.filter((event) => event.category === 'Activities'),
    [state.events]
  );

  return (
    <div>
      <h2 className="mb-4">Activities</h2>
      <div className="row g-4">
        {activities.map((event) => (
          <div className="col-md-4 col-lg-3" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivitiesPage;