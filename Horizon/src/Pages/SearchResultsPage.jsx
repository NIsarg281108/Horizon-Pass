import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useEvents } from "../Context/EventContext";
import { useReviews } from "../Context/ReviewContext";
import EventCard from "../Components/Common/EventCard";
import FilterBar from "../Components/Common/FilterBar";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { state } = useEvents();
  const { getAverageRating } = useReviews();
  const [filters, setFilters] = useState({
    priceRange: "all",
    availability: "all",
    rating: "all",
  });
  const [sortBy, setSortBy] = useState("relevant");

  const filteredEvents = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();

    let events = state.events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.venue.toLowerCase().includes(lowerQuery) ||
        event.category.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery),
    );

    // Apply filters
    events = events.filter((event) => {
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
        case "date": {
          return new Date(a.date) - new Date(b.date);
        }
        case "relevant":
        default: {
          const aTitleMatch = a.title.toLowerCase().includes(lowerQuery);
          const bTitleMatch = b.title.toLowerCase().includes(lowerQuery);
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;
          return 0;
        }
      }
    });

    return events;
  }, [state.events, query, filters, sortBy, getAverageRating]);

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results</h1>
        <p className="search-query">
          {query ? `"${query}"` : "All events"} • {filteredEvents.length}{" "}
          results found
        </p>
      </div>

      <div className="search-content">
        <div className="search-sidebar">
          <FilterBar
            onFilterChange={setFilters}
            onSortChange={setSortBy}
            totalCount={filteredEvents.length}
          />
        </div>

        <div className="search-results">
          {filteredEvents.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No results found</h3>
              <p className="text-muted">
                {query
                  ? `No events match "${query}". Try different keywords or adjust your filters.`
                  : "Try adjusting your filters to see more results."}
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setFilters({
                    priceRange: "all",
                    availability: "all",
                    rating: "all",
                  });
                  setSortBy("relevant");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="results-grid">
              {filteredEvents.map((event) => (
                <div key={event.id} className="result-item">
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

export default SearchResultsPage;
