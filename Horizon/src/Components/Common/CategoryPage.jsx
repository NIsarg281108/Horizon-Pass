import { useMemo, useState } from "react";
import { useEvents } from "../../Context/EventContext";
import { useReviews } from "../../Context/ReviewContext";
import EventCard from "./EventCard";
import FilterBar from "./FilterBar";
import {
  DEFAULT_FILTERS,
  applyEventFilters,
  sortEvents,
} from "../../Utils/filters";

function CategoryPage({ category, title, icon }) {
  const { state } = useEvents();
  const { getAverageRating } = useReviews();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("popular");

  const categoryEvents = useMemo(() => {
    const inCategory = state.events.filter((event) =>
      category === "Resorts"
        ? event.category === "Resorts & Hotels"
        : event.category === category,
    );
    const filtered = applyEventFilters(inCategory, filters, getAverageRating);
    return sortEvents(filtered, sortBy, getAverageRating);
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