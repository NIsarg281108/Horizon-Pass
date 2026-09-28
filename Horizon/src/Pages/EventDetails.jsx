import { useParams, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { useEvents } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { useReviews } from "../context/ReviewContext";
import { useWishlist } from "../context/WishlistContext";
import SocialShare from "../Components/Common/SocialShare";
import Recommendations from "../Components/Common/Recommendations";
import CalendarIntegration from "../Components/Common/CalendarIntegration";
import PriceChart from "../Components/Common/PriceChart";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useEvents();
  const { user } = useAuth();
  const { state: bookingState } = useBookings();
  const { addReview, getReviewsForEvent, getAverageRating } = useReviews();
  const { wishlist, toggleWishlist } = useWishlist();

  const event = useMemo(
    () => state.events.find((e) => e.id === id),
    [state.events, id],
  );

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const isWished = wishlist.includes(event?.id);

  const tierOptions = event?.roomTypes || ["Standard", "Premium", "VIP"];
  const [tier, setTier] = useState(tierOptions[0] || "");
  const [selectedTime, setSelectedTime] = useState(
    event?.showtimes?.[0] || event?.time || "",
  );

  const activeTier = tierOptions.includes(tier) ? tier : tierOptions[0] || "";
  const activeTime = event?.showtimes?.includes(selectedTime)
    ? selectedTime
    : event?.showtimes?.[0] || event?.time || "";

  if (!event) {
    return (
      <div className="alert alert-warning">
        Event not found. <a href="/">Go home</a>
      </div>
    );
  }

  const getMultiplier = (selectedTier) => {
    if (event.roomTypes) {
      if (selectedTier === "Suite") return 2;
      if (selectedTier === "Deluxe") return 1.5;
      return 1;
    }
    if (selectedTier === "Premium") return 1.5;
    if (selectedTier === "VIP") return 2;
    return 1;
  };

  const getGroupDiscount = () => {
    if (quantity >= 7) return 0.15; // 15% off for 7+ tickets
    if (quantity >= 5) return 0.1; // 10% off for 5-6 tickets
    if (quantity >= 4) return 0.05; // 5% off for 4 tickets
    return 0;
  };

  const basePrice = event.price * quantity * getMultiplier(activeTier);
  const groupDiscount = basePrice * getGroupDiscount();
  const totalPrice = basePrice - groupDiscount;

  const handleBookNow = () => {
    if (quantity > 10) {
      alert(
        "For group bookings larger than 10 tickets, please contact our support team.",
      );
      return;
    }
    const bookingData = {
      eventId: event.id,
      title: event.title,
      category: event.category,
      venue: event.venue,
      date: event.date,
      time: activeTime || event.time,
      tier: activeTier,
      quantity,
      totalPrice,
      imageUrl: event.imageUrl,
      isGroupBooking: quantity > 3,
    };
    navigate("/checkout", { state: { bookingData } });
  };

  const hasBooked = bookingState.bookings.some(
    (b) =>
      b.userId === user?.id &&
      b.eventId === event.id &&
      b.status === "confirmed",
  );

  const eventReviews = getReviewsForEvent(event.id);
  const avgRating = getAverageRating(event.id);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewRating < 1) {
      alert("Please select a rating.");
      return;
    }
    if (!user?.id) {
      alert("Please log in to leave a review.");
      return;
    }
    addReview(event.id, user.id, reviewRating, reviewComment);
    setReviewRating(0);
    setReviewComment("");
  };

  const imageGallery = [
    event.imageUrl,
    ...Array(3)
      .fill(0)
      .map(
        (_, i) =>
          `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=800&h=600&fit=crop`,
      ),
  ];

  return (
    <div className="event-details-page">
      <div className="event-details-header">
        <div className="event-breadcrumb">
          <span className="breadcrumb-item">{event.category}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">{event.title}</span>
        </div>
        <button
          className="btn btn-wishlist"
          onClick={() => toggleWishlist(event.id)}
        >
          {isWished ? "❤️ Saved" : "🤍 Save to Wishlist"}
        </button>
        <button
          className="btn btn-share"
          onClick={() => setShowShareModal(true)}
        >
          📤 Share
        </button>
        <button
          className="btn btn-calendar"
          onClick={() => setShowCalendarModal(true)}
        >
          📅 Add to Calendar
        </button>
      </div>

      <div className="event-details-content">
        <div className="event-main">
          {/* Image Gallery */}
          <div className="event-gallery">
            <div className="main-image">
              <img src={imageGallery[activeImage]} alt={event.title} />
            </div>
            <div className="thumbnail-grid">
              {imageGallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`thumbnail ${activeImage === idx ? "active" : ""}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* Event Info */}
          <div className="event-info-card">
            <div className="event-header">
              <h1 className="event-title">{event.title}</h1>
              <div className="event-meta">
                <span className="event-category-badge">{event.category}</span>
                <div className="event-rating">
                  <span className="rating-stars">
                    {"★".repeat(Math.round(avgRating))}
                    {"☆".repeat(5 - Math.round(avgRating))}
                  </span>
                  <span className="rating-score">({avgRating.toFixed(1)})</span>
                </div>
              </div>
            </div>

            <p className="event-description">{event.description}</p>

            <div className="event-details-grid">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div>
                  <strong>Venue</strong>
                  <p>{event.venue}</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <div>
                  <strong>Date</strong>
                  <p>{event.date}</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <div>
                  <strong>Time</strong>
                  <p>{event.time}</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🎫</span>
                <div>
                  <strong>Availability</strong>
                  <p>{event.availableTickets} tickets left</p>
                </div>
              </div>
            </div>

            {event.facilities && (
              <div className="event-facilities">
                <h4>Facilities & Amenities</h4>
                <div className="facilities-list">
                  {event.facilities.map((facility, idx) => (
                    <span key={idx} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h3>Reviews ({eventReviews.length})</h3>

            {hasBooked && (
              <div className="add-review-card">
                <h4>Write a Review</h4>
                <form onSubmit={handleSubmitReview}>
                  <div className="rating-input">
                    <label>Your Rating</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${star <= reviewRating ? "active" : ""}`}
                          onClick={() => setReviewRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="form-control"
                    placeholder="Share your experience (optional)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows="3"
                  ></textarea>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </form>
              </div>
            )}

            <div className="reviews-list">
              {eventReviews.length === 0 ? (
                <div className="no-reviews">
                  <p className="text-muted">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                eventReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <strong>User {review.userId}</strong>
                      <div className="review-rating">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="review-comment">{review.comment}</p>
                    )}
                    <small className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="event-sidebar">
          <div className="booking-card">
            <div className="booking-header">
              <h3>Book Tickets</h3>
              <div className="price-display">
                <span className="price-amount">${event.price}</span>
                {event.category === "Resorts & Hotels" && (
                  <span className="price-unit">/night</span>
                )}
              </div>
            </div>

            <div className="booking-form">
              {event.showtimes && (
                <div className="form-group">
                  <label>Showtime</label>
                  <div className="time-options">
                    {event.showtimes.map((time) => (
                      <button
                        key={time}
                        className={`time-option ${activeTime === time ? "active" : ""}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>{event.roomTypes ? "Room Type" : "Ticket Tier"}</label>
                <div className="tier-options">
                  {tierOptions.map((option) => (
                    <button
                      key={option}
                      className={`tier-option ${activeTier === option ? "active" : ""}`}
                      onClick={() => setTier(option)}
                    >
                      {option}
                      <span className="tier-multiplier">
                        x{getMultiplier(option)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <div className="quantity-selector">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    +
                  </button>
                </div>
                {quantity > 3 && (
                  <div className="group-discount-badge">
                    🎉 Group booking:{" "}
                    {quantity >= 7
                      ? "15% off"
                      : quantity >= 5
                        ? "10% off"
                        : "5% off"}
                  </div>
                )}
              </div>

              <div className="booking-summary">
                <div className="summary-row">
                  <span>Base Price</span>
                  <span>${event.price}</span>
                </div>
                <div className="summary-row">
                  <span>Multiplier</span>
                  <span>x{getMultiplier(activeTier)}</span>
                </div>
                <div className="summary-row">
                  <span>Quantity</span>
                  <span>x{quantity}</span>
                </div>
                {quantity > 3 && (
                  <div className="summary-row discount">
                    <span>Group Discount</span>
                    <span className="discount-amount">
                      -{getGroupDiscount() * 100}%
                    </span>
                  </div>
                )}
                <div className="summary-row total">
                  <strong>Total</strong>
                  <strong className="total-price">
                    ${totalPrice.toFixed(2)}
                  </strong>
                </div>
              </div>

              <button
                className="btn btn-book-now btn-lg w-100"
                onClick={handleBookNow}
                disabled={event.availableTickets === 0}
              >
                {event.availableTickets === 0 ? "Sold Out" : "Book Now"}
              </button>

              {event.availableTickets < 10 && event.availableTickets > 0 && (
                <div className="limited-availability">
                  ⚠️ Only {event.availableTickets} tickets left!
                </div>
              )}
            </div>
          </div>

          {/* Price Chart */}
          <div className="booking-card">
            <PriceChart event={event} />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <Recommendations currentEventId={event.id} limit={4} />

      {showShareModal && (
        <SocialShare event={event} onClose={() => setShowShareModal(false)} />
      )}

      {showCalendarModal && (
        <CalendarIntegration
          event={event}
          onClose={() => setShowCalendarModal(false)}
        />
      )}
    </div>
  );
}

export default EventDetails;
