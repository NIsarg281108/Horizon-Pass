import { useWishlist } from "../../context/WishlistContext";
import { useReviews } from "../../context/ReviewContext";
import { Link } from "react-router";

function EventComparison({ events, onClose }) {
  const { toggleWishlist, wishlist } = useWishlist();
  const { getAverageRating } = useReviews();

  if (events.length === 0) {
    return null;
  }

  const formatPrice = (price, category) => {
    return category === "Resorts & Hotels" ? `$${price}/night` : `$${price}`;
  };

  return (
    <div className="comparison-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-header">
          <h3>📊 Compare Events</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="comparison-table">
          <div className="comparison-row header">
            <div className="comparison-label">Feature</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="event-thumb"
                />
                <span className="event-title-compare">{event.title}</span>
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Category</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                <span className="category-badge-small">{event.category}</span>
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Price</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                <strong>{formatPrice(event.price, event.category)}</strong>
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Rating</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                <div className="rating-compare">
                  <span className="stars">
                    {"★".repeat(Math.round(getAverageRating(event.id)))}
                    {"☆".repeat(5 - Math.round(getAverageRating(event.id)))}
                  </span>
                  <span className="rating-score">
                    ({getAverageRating(event.id).toFixed(1)})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Venue</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                {event.venue}
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Date</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                {event.date}
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Time</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                {event.time}
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Availability</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                <span
                  className={`availability-badge ${event.availableTickets < 10 ? "low" : "good"}`}
                >
                  {event.availableTickets} tickets
                </span>
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Facilities</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                {event.facilities ? (
                  <div className="facilities-compare">
                    {event.facilities.slice(0, 3).map((facility, idx) => (
                      <span key={idx} className="facility-tag-small">
                        {facility}
                      </span>
                    ))}
                    {event.facilities.length > 3 && (
                      <span className="more-facilities">
                        +{event.facilities.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </div>
            ))}
          </div>

          <div className="comparison-row actions">
            <div className="comparison-label">Actions</div>
            {events.map((event) => (
              <div key={event.id} className="comparison-value">
                <div className="action-buttons">
                  <button
                    className="btn btn-compare-wishlist"
                    onClick={() => toggleWishlist(event.id)}
                  >
                    {wishlist.includes(event.id) ? "❤️ Saved" : "🤍 Save"}
                  </button>
                  <Link
                    to={`/event/${event.id}`}
                    className="btn btn-compare-view"
                    onClick={onClose}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-footer">
          <p className="text-muted mb-0">
            💡 Tip: Click on any event to view full details and make a booking.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventComparison;
