import { Link } from 'react-router-dom';

function EventCard({ event }) {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={event.imageUrl}
        className="card-img-top"
        alt={event.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-primary">{event.category}</span>
          {event.availableTickets < 20 && (
            <span className="badge bg-warning text-dark">Few left</span>
          )}
        </div>
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text text-muted small mb-1">{event.venue}</p>
        <p className="card-text small text-muted">
          {event.date} • {event.time}
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">
            ${event.price}
            {event.category === 'Resorts & Hotels' ? '/night' : ''}
          </span>
          <Link to={`/event/${event.id}`} className="btn btn-sm btn-outline-primary">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;