import { useWishlist } from '../Context/WishlistContext';
import { useEvents } from '../Context/EventContext';
import { useReviews } from '../Context/ReviewContext';
import { Link } from 'react-router';
import EventComparison from '../Components/Common/EventComparison';
import { useState } from 'react';

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { state } = useEvents();
  const { getAverageRating } = useReviews();
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  const wishlistEvents = state.events.filter(event => wishlist.includes(event.id));

  const handleRemoveFromWishlist = (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(eventId);
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="wishlist-title-section">
          <span className="wishlist-icon">❤️</span>
          <div>
            <h2 className="wishlist-title">My Wishlist</h2>
            <p className="wishlist-subtitle">
              {wishlistEvents.length} {wishlistEvents.length === 1 ? 'event' : 'events'} saved
            </p>
          </div>
        </div>
      </div>

      {wishlistEvents.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">💔</div>
          <h3>Your wishlist is empty</h3>
          <p className="text-muted mb-4">
            Start exploring and save events you're interested in!
          </p>
          <Link to="/movies" className="btn btn-primary">
            Explore Events
          </Link>
        </div>
      ) : (
        <>
          <div className="wishlist-actions">
            <div className="wishlist-summary">
              <span className="summary-item">
                <strong>{wishlistEvents.length}</strong> events saved
              </span>
              <span className="summary-item">
                <strong>
                  ${wishlistEvents.reduce((sum, event) => sum + event.price, 0).toFixed(2)}
                </strong>{' '}
                total value
              </span>
            </div>
            {wishlistEvents.length >= 2 && (
              <button
                className="btn btn-compare"
                onClick={() => {
                  setSelectedForComparison(wishlistEvents.slice(0, 4));
                  setShowComparison(true);
                }}
              >
                📊 Compare Events
              </button>
            )}
          </div>

          <div className="wishlist-grid">
            {wishlistEvents.map((event) => (
              <div key={event.id} className="wishlist-item">
                <div className="wishlist-item-content">
                  <Link to={`/event/${event.id}`} className="wishlist-item-link">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="wishlist-item-image"
                    />
                    <div className="wishlist-item-details">
                      <span className="wishlist-item-category">{event.category}</span>
                      <h4 className="wishlist-item-title">{event.title}</h4>
                      <p className="wishlist-item-venue">{event.venue}</p>
                      <div className="wishlist-item-meta">
                        <span className="wishlist-item-date">{event.date}</span>
                        <span className="wishlist-item-time">{event.time}</span>
                      </div>
                      <div className="wishlist-item-rating">
                        <span className="text-warning">
                          {'★'.repeat(Math.round(getAverageRating(event.id)))}
                          {'☆'.repeat(5 - Math.round(getAverageRating(event.id)))}
                        </span>
                        <span className="rating-score">
                          ({getAverageRating(event.id).toFixed(1)})
                        </span>
                      </div>
                      <div className="wishlist-item-price">
                        <span className="price-amount">${event.price}</span>
                        {event.category === 'Resorts & Hotels' && (
                          <span className="price-unit">/night</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm wishlist-remove-btn"
                    onClick={(e) => handleRemoveFromWishlist(e, event.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showComparison && (
        <EventComparison 
          events={selectedForComparison} 
          onClose={() => setShowComparison(false)} 
        />
      )}
    </div>
  );
}

export default Wishlist;
