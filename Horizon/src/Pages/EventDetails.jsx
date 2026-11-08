import { useParams, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { useEvents } from "../Context/EventContext";
import { useAuth } from "../Context/AuthContext";
import { useBookings } from "../Context/BookingContext";
import { useReviews } from "../Context/ReviewContext";
import { useWishlist } from "../Context/WishlistContext";
import SocialShare from "../Components/Common/SocialShare";
import Recommendations from "../Components/Common/Recommendations";
import CalendarIntegration from "../Components/Common/CalendarIntegration";
import PriceChart from "../Components/Common/PriceChart";
import { SEAT_ROWS, SEATS_PER_ROW, getTakenSeats } from "../Utils/seats";
import { getEventImages } from "../Data/eventImages";

const MAX_SEATS = 10;
const SEAT_MAP_CATEGORIES = ["Movies", "Plays", "Shows"];

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
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

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

  const usesSeatMap = !!event && SEAT_MAP_CATEGORIES.includes(event.category);
  const images = event ? getEventImages(event) : null;

  const takenSeats = useMemo(
    () => getTakenSeats(bookingState.bookings, event?.id, activeTime),
    [bookingState.bookings, event?.id, activeTime],
  );

  // On seat-map events the quantity is whatever seats were picked
  const effectiveQuantity = usesSeatMap ? selectedSeats.length : quantity;

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

  const getGroupDiscount = (qty) => {
    if (qty >= 7) return 0.15;
    if (qty >= 5) return 0.1;
    if (qty >= 4) return 0.05;
    return 0;
  };

  const basePrice = event.price * effectiveQuantity * getMultiplier(activeTier);
  const groupDiscount = basePrice * getGroupDiscount(effectiveQuantity);
  const totalPrice = basePrice - groupDiscount;

  const toggleSeat = (seat) => {
    if (takenSeats.has(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      return;
    }
    if (selectedSeats.length >= MAX_SEATS) {
      alert(`You can book up to ${MAX_SEATS} seats at a time.`);
      return;
    }
    setSelectedSeats([...selectedSeats, seat]);
  };

  const selectShowtime = (time) => {
    setSelectedTime(time);
    // Taken seats differ by showtime, so clear the current selection
    setSelectedSeats([]);
  };

  const handleBookNow = () => {
    if (effectiveQuantity === 0) {
      alert(
        usesSeatMap
          ? "Please choose at least one seat."
          : "Please choose a quantity.",
      );
      return;
    }
    if (effectiveQuantity > 10) {
      alert(
        "For group bookings larger than 10 tickets, please contact our support team.",
      );
      return;
    }
    if (effectiveQuantity > event.availableTickets) {
      alert(`Only ${event.availableTickets} tickets are left.`);
      return;
    }
    if (selectedSeats.some((seat) => takenSeats.has(seat))) {
      alert("Some of those seats were just taken. Please choose again.");
      setSelectedSeats(selectedSeats.filter((seat) => !takenSeats.has(seat)));
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
      quantity: effectiveQuantity,
      totalPrice,
      imageUrl: event.imageUrl,
      isGroupBooking: effectiveQuantity > 3,
      ...(usesSeatMap ? { seats: [...selectedSeats] } : {}),
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
          {isWished ? "❤️ Saved" : "🤍 Save to wishlist"}
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
          📅 Add to calendar
        </button>
      </div>

      <div className="event-details-content">
        <div className="event-main">
          <div className="event-gallery">
            <div className="main-image">
              <img
                src={images.gallery[activeImage] || images.main}
                alt={event.title}
              />
            </div>
            <div className="thumbnail-grid">
              {images.gallery.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`${event.title} photo ${idx + 1}`}
                  className={`thumbnail ${activeImage === idx ? "active" : ""}`}
                  onClick={() => setActiveImage(idx)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

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
                <h4>Facilities & amenities</h4>
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

          <div className="reviews-section">
            <h3>Reviews ({eventReviews.length})</h3>

            {hasBooked && (
              <div className="add-review-card">
                <h4>Write a review</h4>
                <form onSubmit={handleSubmitReview}>
                  <div className="rating-input">
                    <label>Your rating</label>
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
                  <button type="submit" className="btn btn-primary mt-2">
                    Submit review
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

        <div className="event-sidebar">
          <div className="booking-card">
            <div className="booking-header">
              <h3>Book tickets</h3>
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
                        type="button"
                        className={`time-option ${activeTime === time ? "active" : ""}`}
                        onClick={() => selectShowtime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {usesSeatMap && (
                <div className="form-group">
                  <label>Choose seats (up to {MAX_SEATS})</label>
                  <div className="screen-bar">SCREEN</div>
                  <div className="seat-map">
                    {SEAT_ROWS.map((row) => (
                      <div key={row} className="seat-row">
                        <span className="seat-row-label">{row}</span>
                        {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                          const seat = `${row}${i + 1}`;
                          const isTaken = takenSeats.has(seat);
                          const isSelected = selectedSeats.includes(seat);
                          return (
                            <button
                              key={seat}
                              type="button"
                              className={`seat ${isTaken ? "taken" : ""} ${isSelected ? "selected" : ""}`}
                              disabled={isTaken}
                              onClick={() => toggleSeat(seat)}
                              aria-label={`Seat ${seat}${isTaken ? ", taken" : ""}`}
                              aria-pressed={isSelected}
                            >
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="seat-legend">
                    <span>
                      <i className="seat-key available"></i> Available
                    </span>
                    <span>
                      <i className="seat-key selected"></i> Selected
                    </span>
                    <span>
                      <i className="seat-key taken"></i> Taken
                    </span>
                  </div>
                  <p className="text-muted small mt-2 mb-0">
                    Selected:{" "}
                    {selectedSeats.length
                      ? selectedSeats.join(", ")
                      : "none yet"}
                  </p>
                </div>
              )}

              {!usesSeatMap && (
                <div className="form-group">
                  <label>{event.roomTypes ? "Room type" : "Ticket tier"}</label>
                  <div className="tier-options">
                    {tierOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
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
              )}

              {usesSeatMap && (
                <div className="form-group">
                  <label>Ticket tier</label>
                  <div className="tier-options">
                    {tierOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
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
              )}

              {!usesSeatMap && (
                <div className="form-group">
                  <label>Quantity</label>
                  <div className="quantity-selector">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {effectiveQuantity > 3 && (
                <div className="group-discount-badge">
                  🎉 Group booking:{" "}
                  {effectiveQuantity >= 7
                    ? "15% off"
                    : effectiveQuantity >= 5
                      ? "10% off"
                      : "5% off"}
                </div>
              )}

              <div className="booking-summary">
                <div className="summary-row">
                  <span>Base price</span>
                  <span>${event.price}</span>
                </div>
                <div className="summary-row">
                  <span>Multiplier</span>
                  <span>x{getMultiplier(activeTier)}</span>
                </div>
                <div className="summary-row">
                  <span>Quantity</span>
                  <span>x{effectiveQuantity}</span>
                </div>
                {effectiveQuantity > 3 && (
                  <div className="summary-row discount">
                    <span>Group discount</span>
                    <span className="discount-amount">
                      -{getGroupDiscount(effectiveQuantity) * 100}%
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
                type="button"
                className="btn btn-book-now btn-lg w-100"
                onClick={handleBookNow}
                disabled={
                  event.availableTickets === 0 ||
                  (usesSeatMap && effectiveQuantity === 0)
                }
              >
                {event.availableTickets === 0 ? "Sold out" : "Book now"}
              </button>

              {event.availableTickets < 10 && event.availableTickets > 0 && (
                <div className="limited-availability">
                  ⚠️ Only {event.availableTickets} tickets left!
                </div>
              )}
            </div>
          </div>

          <div className="booking-card">
            <PriceChart event={event} />
          </div>
        </div>
      </div>

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
