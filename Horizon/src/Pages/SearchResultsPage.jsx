import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useEvents } from "../Context/EventContext";
import { useReviews } from "../Context/ReviewContext";
import EventCard from "../Components/Common/EventCard";
import FilterBar from "../Components/Common/FilterBar";
import {
  DEFAULT_FILTERS,
  applyEventFilters,
  sortEvents,
} from "../Utils/filters";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const { state } = useEvents();
  const { getAverageRating } = useReviews();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("popular");
  // Changing this remounts FilterBar so its controls reset too
  const [filterKey, setFilterKey] = useState(0);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();

    const matched = state.events.filter((event) =>
      [event.title, event.venue, event.category, event.description].some(
        (text) => text?.toLowerCase().includes(q),
      ),
    );

    const filtered = applyEventFilters(matched, filters, getAverageRating);
    return sortEvents(filtered, sortBy, getAverageRating);
  }, [query, state.events, filters, sortBy, getAverageRating]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSortBy("popular");
    setFilterKey((k) => k + 1);
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search results</h1>
        <p className="search-query">
          {query ? `"${query}"` : "Type something in the search bar"} •{" "}
          {results.length} results found
        </p>
      </div>

      <div className="search-content">
        <div className="search-sidebar">
          <FilterBar
            key={filterKey}
            onFilterChange={setFilters}
            onSortChange={setSortBy}
            totalCount={results.length}
          />
        </div>

        <div className="search-results">
          {results.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No results found</h3>
              <p className="text-muted">
                {query
                  ? `No events match "${query}". Try different keywords or adjust your filters.`
                  : "Search for a movie, play, show, activity or resort."}
              </p>
              {query && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="results-grid">
              {results.map((event) => (
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