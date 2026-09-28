import { useMemo, useState } from "react";
import { useEvents } from "../../Context/EventContext";
import { useReviews } from "../../Context/ReviewContext";
import EventCard from "./EventCard";
import FilterBar from "./FilterBar";

function CategoryPage({ category, title, icon }) {
  const { state } = useEvents();
  const { getAverageRating } = useReviews();
  const [filters, setFilters] = useState({
    priceRange: "all",
    availability: "all",
    rating: "all",
  });
  const [sortBy, setSortBy] = useState("popular");

  const categoryEvents = useMemo(() => {
    let events = state.events.filter((event) => {
      if (category === "Resorts") {
        return event.category === "Resorts & Hotels";
      }
      return event.category === category;
    });

    // Apply filters
    events = events.filter((event) => {
      // Price filter
      if (filters.priceRange !== "all") {
        if (filters.priceRange === "0-25" && event.price >= 25) return false;
        if (
          filters.priceRange === "25-50" &&
          (event.price < 25 || event.price >= 50)
        )
          return false;
        if (
          filters.priceRange === "50-100" &&
          (event.price < 50 || event.price >= 100)
        )
          return false;
        if (filters.priceRange === "100+" && event.price < 100) return false;
      }

      // Availability filter
      if (filters.availability !== "all") {
        if (
          filters.availability === "available" &&
          event.availableTickets === 0
        )
          return false;
        if (
          filters.availability === "limited" &&
          event.availableTickets >= event.totalTickets * 0.3
        )
          return false;
        if (filters.availability === "sold-out" && event.availableTickets > 0)
          return false;
      }

      // Rating filter
      if (filters.rating !== "all") {
        const rating = getAverageRating(event.id);
        if (filters.rating === "4" && rating < 4) return false;
        if (filters.rating === "3" && rating < 3) return false;
        if (filters.rating === "2" && rating < 2) return false;
      }

      return true;
    });

    // Apply sorting
    events = [...events].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return getAverageRating(b.id) - getAverageRating(a.id);
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "popular":
        default:
          return (
            b.totalTickets -
            b.availableTickets -
            (a.totalTickets - a.availableTickets)
          );
      }
    });

    return events;
  }, [state.events, category, filters, sortBy, getAverageRating]);

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-title-section">
          <span className="category-icon-large">{icon}</span>
          <div>
            <h2 className="category-title">{title}</h2>
            <p className="category-subtitle">
              {categoryEvents.length} events available
            </p>
          </div>
        </div>
      </div>

      <div className="category-content">
        <div className="category-sidebar">
          <FilterBar
            onFilterChange={setFilters}
            onSortChange={setSortBy}
            totalCount={categoryEvents.length}
          />
        </div>

        <div className="category-events">
          {categoryEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">🎭</div>
              <h3>No events found</h3>
              <p className="text-muted">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {categoryEvents.map((event) => (
                <div key={event.id} className="event-card-wrapper">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
