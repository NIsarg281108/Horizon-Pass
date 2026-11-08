import { Link } from "react-router";
import { useWishlist } from "../../Context/WishlistContext";
import { useReviews } from "../../Context/ReviewContext";
import ProgressiveImage from "./ProgressiveImage";

function EventCard({ event }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { getAverageRating } = useReviews();

  const isWished = wishlist.includes(event.id);
  const avgRating = getAverageRating(event.id);
  const stars = Math.round(avgRating);
  const isResort = event.category === "Resorts & Hotels";
  const isSoldOut = event.availableTickets === 0;
  const isLimited = !isSoldOut && event.availableTickets < 20;

  return (
    <article className="event-card">
      <div className="event-card-media">
        <ProgressiveImage
          src={event.imageUrl}
          alt={event.title}
          className="event-card-img"
        />

        <span className="event-card-category">{event.category}</span>

        <button
          type="button"
          className={`event-card-wish ${isWished ? "active" : ""}`}
          onClick={() => toggleWishlist(event.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWished}
        >
          {isWished ? "♥" : "♡"}
        </button>

        {isLimited && <span className="event-card-flag">Few left</span>}
        {isSoldOut && <span className="event-card-flag sold">Sold out</span>}
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-meta">📍 {event.venue}</p>
        <p className="event-card-meta">
          🗓 {event.date}
          {event.time ? ` · ${event.time}` : ""}
        </p>

        <div className="event-card-footer">
          <div>
            <div className="event-card-price">
              ${event.price}
              {isResort && <span>/night</span>}
            </div>
            <div className="event-card-rating">
              {"★".repeat(stars)}
              {"☆".repeat(5 - stars)}
              <span>{avgRating.toFixed(1)}</span>
            </div>
          </div>

          <Link to={`/event/${event.id}`} className="event-card-btn">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;