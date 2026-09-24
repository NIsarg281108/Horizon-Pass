import { useMemo } from 'react';
import { useEvents } from '../../Context/EventContext';
import { useBookings } from '../../Context/BookingContext';
import { useReviews } from '../../Context/ReviewContext';
import { useWishlist } from '../../Context/WishlistContext';
import EventCard from './EventCard';

function Recommendations({ currentEventId, limit = 4 }) {
  const { state } = useEvents();
  const { state: bookingState } = useBookings();
  const { getAverageRating } = useReviews();
  const { wishlist } = useWishlist();

  const recommendations = useMemo(() => {
    if (!currentEventId) return [];

    const currentEvent = state.events.find(e => e.id === currentEventId);
    if (!currentEvent) return [];

    let events = state.events.filter(e => e.id !== currentEventId);

    // Scoring system for recommendations
    const scoredEvents = events.map(event => {
      let score = 0;

      // Same category bonus
      if (event.category === currentEvent.category) {
        score += 10;
      }

      // Similar price range
      const priceDiff = Math.abs(event.price - currentEvent.price);
      if (priceDiff < 20) score += 5;
      else if (priceDiff < 50) score += 3;

      // High rating bonus
      const rating = getAverageRating(event.id);
      if (rating >= 4) score += 5;
      else if (rating >= 3) score += 3;

      // Availability bonus (fewer tickets = more popular)
      const availabilityRatio = event.availableTickets / event.totalTickets;
      if (availabilityRatio < 0.3) score += 4;
      else if (availabilityRatio < 0.5) score += 2;

      // Wishlist bonus
      if (wishlist.includes(event.id)) score += 3;

      // User's booking history in same category
      const userBookingsInCategory = bookingState.bookings.filter(
        b => b.category === event.category
      ).length;
      score += userBookingsInCategory * 2;

      // Same venue bonus
      if (event.venue === currentEvent.venue) {
        score += 4;
      }

      // Date proximity (events within 7 days)
      const currentDate = new Date(currentEvent.date);
      const eventDate = new Date(event.date);
      const daysDiff = Math.abs((eventDate - currentDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 7) score += 3;
      else if (daysDiff <= 14) score += 1;

      return { event, score };
    });

    // Sort by score and return top recommendations
    return scoredEvents
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.event);
  }, [state.events, currentEventId, getAverageRating, wishlist, bookingState.bookings, limit]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h3>🎯 Recommended for You</h3>
        <p className="text-muted mb-0">Based on your preferences and this event</p>
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
