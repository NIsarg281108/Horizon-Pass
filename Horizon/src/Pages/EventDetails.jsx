import { useParams, useNavigate } from 'react-router';
import { useMemo, useState, useEffect } from 'react';
import { useEvents } from '../Context/EventContext';
import { useAuth } from '../Context/AuthContext';
import { useBookings } from '../Context/BookingContext';
import { useReviews } from '../Context/ReviewContext';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useEvents();
  const { user } = useAuth();
  const { state: bookingState } = useBookings();
  const { addReview, getReviewsForEvent, getAverageRating } = useReviews();

  const event = useMemo(
    () => state.events.find((e) => e.id === id),
    [state.events, id]
  );

  const [tier, setTier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (event) {
      const tierOptions = event.roomTypes || ['Standard', 'Premium', 'VIP'];
      setTier(tierOptions[0]);
      if (event.showtimes && event.showtimes.length > 0) {
        setSelectedTime(event.showtimes[0]);
      }
    }
  }, [event]);

  if (!event) {
    return (
      <div className="alert alert-warning">
        Event not found. <a href="/">Go home</a>
      </div>
    );
  }

  const tierOptions = event.roomTypes || ['Standard', 'Premium', 'VIP'];

  const getMultiplier = (selectedTier) => {
    if (event.roomTypes) {
      if (selectedTier === 'Suite') return 2;
      if (selectedTier === 'Deluxe') return 1.5;
      return 1;
    }
    if (selectedTier === 'Premium') return 1.5;
    if (selectedTier === 'VIP') return 2;
    return 1;
  };

  const totalPrice = event.price * quantity * getMultiplier(tier);

  const handleBookNow = () => {
    if (quantity > 3) {
      alert('You can book a maximum of 3 tickets at a time.');
      return;
    }
    const bookingData = {
      eventId: event.id,
      title: event.title,
      category: event.category,
      venue: event.venue,
      date: event.date,
      time: selectedTime || event.time,
      tier,
      quantity,
      totalPrice,
      imageUrl: event.imageUrl,
    };
    navigate('/checkout', { state: { bookingData } });
  };

  // Check if user has a confirmed booking for this event
  const hasBooked = bookingState.bookings.some(
    (b) => b.userId === user?.id && b.eventId === event.id && b.status === 'confirmed'
  );

  const eventReviews = getReviewsForEvent(event.id);
  const avgRating = getAverageRating(event.id);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewRating < 1) {
      alert('Please select a rating.');
      return;
    }
    addReview(event.id, user.id, reviewRating, reviewComment);
    setReviewRating(0);
    setReviewComment('');
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <img src={event.imageUrl} alt={event.title} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2>{event.title}</h2>
          <p className="text-muted">{event.category}</p>
          <p>{event.description}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          {event.facilities && <p><strong>Facilities:</strong> {event.facilities.join(', ')}</p>}
          <div className="d-flex align-items-center mb-2">
            <span className="me-2">Rating:</span>
            <span className="text-warning">
              {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
            </span>
            <span className="ms-2">({avgRating.toFixed(1)})</span>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm mb-4">
        <h4>Book Your Ticket</h4>
        <div className="row g-3">
          {event.showtimes && (
            <div className="col-md-4">
              <label className="form-label">Showtime</label>
              <select className="form-select" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                {event.showtimes.map((time) => <option key={time}>{time}</option>)}
              </select>
            </div>
          )}

          <div className="col-md-4">
            <label className="form-label">{event.roomTypes ? 'Room Type' : 'Tier'}</label>
            <select className="form-select" value={tier} onChange={(e) => setTier(e.target.value)}>
              {tierOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Quantity (max 3)</label>
            <input
              type="number"
              min="1"
              max="3"
              className="form-control"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > 3) setQuantity(3);
                else if (val < 1) setQuantity(1);
                else setQuantity(val);
              }}
            />
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Total: <span className="text-primary">${totalPrice.toFixed(2)}</span>
          </h5>
          <button className="btn btn-success btn-lg" onClick={handleBookNow}>Book Now</button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card p-4 shadow-sm">
        <h4>Reviews</h4>
        {hasBooked && (
          <form onSubmit={handleSubmitReview} className="mb-4">
            <div className="mb-2">
              <label className="form-label">Your Rating</label>
              <div>
                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                    onClick={() => setReviewRating(star)}
                  >
                    {star <= reviewRating ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Leave a comment (optional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}

        {eventReviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <div>
            {eventReviews.map((review) => (
              <div key={review.id} className="border-bottom mb-2 pb-2">
                <div className="d-flex justify-content-between">
                  <strong>User {review.userId}</strong>
                  <span className="text-warning">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && <p className="mb-1">{review.comment}</p>}
                <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;