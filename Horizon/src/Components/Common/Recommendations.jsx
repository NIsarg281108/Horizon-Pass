import { useMemo } from "react";
import { useEvents } from "../../Context/EventContext";
import { useBookings } from "../../Context/BookingContext";
import { useReviews } from "../../Context/ReviewContext";
import { useWishlist } from "../../Context/WishlistContext";
import { useAuth } from "../../Context/AuthContext";
import EventCard from "./EventCard";

function Recommendations({ currentEventId, limit = 4 }) {
  const { state } = useEvents();
  const { state: bookingState } = useBookings();
  const { getAverageRating } = useReviews();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const recommendations = useMemo(() => {
    const currentEvent = state.events.find((e) => e.id === currentEventId);
    if (!currentEvent) return [];

    // What this user has already shown interest in
    const myBookings = bookingState.bookings.filter(
      (b) => b.userId === user?.id && b.status === "confirmed",
    );
    const bookedCategories = {};
    const bookedVenues = new Set();
    const bookedEventIds = new Set();
    myBookings.forEach((b) => {
      bookedCategories[b.category] = (bookedCategories[b.category] || 0) + 1;
      bookedVenues.add(b.venue);
      bookedEventIds.add(b.eventId);
    });

    const wishedCategories = {};
    state.events
      .filter((e) => wishlist.includes(e.id))
      .forEach((e) => {
        wishedCategories[e.category] = (wishedCategories[e.category] || 0) + 1;
      });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return state.events
      .filter(
        (event) =>
          event.id !== currentEventId &&
          event.availableTickets > 0 &&
          new Date(`${event.date}T00:00:00`) >= today,
      )
      .map((event) => {
        let score = 0;

        if (event.category === currentEvent.category) score += 8;
        score += Math.min(bookedCategories[event.category] || 0, 3) * 4;
        score += Math.min(wishedCategories[event.category] || 0, 3) * 3;

        if (event.venue === currentEvent.venue) score += 3;
        if (bookedVenues.has(event.venue)) score += 2;

        const priceDiff = Math.abs(event.price - currentEvent.price);
        if (priceDiff < 20) score += 4;
        else if (priceDiff < 50) score += 2;

        const rating = getAverageRating(event.id);
        if (rating >= 4) score += 4;
        else if (rating >= 3) score += 2;

        if (event.availableTickets / event.totalTickets < 0.3) score += 2;

        // Already booked: push it down rather than recommend it again
        if (bookedEventIds.has(event.id)) score -= 10;

        return { event, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.event);
  }, [
    state.events,
    currentEventId,
    getAverageRating,
    wishlist,
    bookingState.bookings,
    user?.id,
    limit,
  ]);

  if (recommendations.length === 0) return null;

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h3>🎯 Recommended for you</h3>
        <p className="text-muted mb-0">
          Based on your bookings, your wishlist and this event
        </p>
      </div>
      <div className="recommendations-grid">
        {recommendations.map((event) => (
          <div key={event.id} className="recommendation-item">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;