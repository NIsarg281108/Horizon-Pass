import { useState } from "react";

const DEFAULT_FILTERS = {
  dateRange: "any",
  minPrice: "",
  maxPrice: "",
  availability: "all",
  rating: "all",
};

function FilterBar({ onFilterChange, onSortChange, totalCount }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("popular");
  const [open, setOpen] = useState(false);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSortBy("popular");
    onFilterChange(DEFAULT_FILTERS);
    onSortChange("popular");
  };

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h5 className="mb-0">Filter & Sort</h5>
        <div className="filter-header-right">
          <span className="text-muted">{totalCount} events</span>
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? "Hide ▲" : "Filters ▼"}
          </button>
        </div>
      </div>

      <div className={`filter-body ${open ? "open" : ""}`}>
        <div className="filter-section">
          <label className="filter-label">Date</label>
          <select
            className="form-select filter-select"
            value={filters.dateRange}
            onChange={(e) => updateFilter("dateRange", e.target.value)}
          >
            <option value="any">Any date</option>
            <option value="7">Next 7 days</option>
            <option value="30">Next 30 days</option>
            <option value="90">Next 3 months</option>
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Price (₹ / $)</label>
          <div className="d-flex gap-2">
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Availability</label>
          <select
            className="form-select filter-select"
            value={filters.availability}
            onChange={(e) => updateFilter("availability", e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available now</option>
            <option value="limited">Limited tickets</option>
            <option value="sold-out">Sold out</option>
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Minimum rating</label>
          <select
            className="form-select filter-select"
            value={filters.rating}
            onChange={(e) => updateFilter("rating", e.target.value)}
          >
            <option value="all">All ratings</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Sort by</label>
          <select
            className="form-select filter-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="popular">Most popular</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Highest rated</option>
            <option value="date">Soonest date</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm w-100 mt-2"
          onClick={handleReset}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;