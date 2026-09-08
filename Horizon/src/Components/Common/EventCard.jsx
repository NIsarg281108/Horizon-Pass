import { Link } from 'react-router';
import { useWishlist } from '../../Context/WishlistContext';
import { useReviews } from '../../Context/ReviewContext';

function EventCard({ event }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { getAverageRating } = useReviews();
  const isWished = wishlist.includes(event.id);
  const avgRating = getAverageRating(event.id);

  return (
    <div className="card h-100 shadow-sm position-relative">
      <button
        className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle"
        onClick={() => toggleWishlist(event.id)}
        style={{ zIndex: 10 }}
      >
        {isWished ? '❤️' : '🤍'}
      </button>
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
        <p className="card-text small text-muted">{event.date} • {event.time}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold">
              ${event.price}
              {event.category === 'Resorts & Hotels' ? '/night' : ''}
            </span>
            <div className="text-warning small">
              {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              <span className="text-muted ms-1">({avgRating.toFixed(1)})</span>
            </div>
          </div>
          <Link to={`/event/${event.id}`} className="btn btn-sm btn-outline-primary">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;