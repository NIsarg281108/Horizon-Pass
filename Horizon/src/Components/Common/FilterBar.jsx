import { useState } from 'react';

function FilterBar({ onFilterChange, onSortChange, totalCount }) {
  const [filters, setFilters] = useState({
    priceRange: 'all',
    availability: 'all',
    rating: 'all',
  });
  const [sortBy, setSortBy] = useState('popular');

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h5 className="mb-0">Filter & Sort</h5>
        <span className="text-muted">{totalCount} events</span>
      </div>

      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        <select 
          className="form-select filter-select"
          value={filters.priceRange}
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="0-25">Under $25</option>
          <option value="25-50">$25 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100+">$100+</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Availability</label>
        <select 
          className="form-select filter-select"
          value={filters.availability}
          onChange={(e) => handleFilterChange('availability', e.target.value)}
        >
          <option value="all">All</option>
          <option value="available">Available Now</option>
          <option value="limited">Limited Tickets</option>
          <option value="sold-out">Sold Out</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Minimum Rating</label>
        <select 
          className="form-select filter-select"
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Sort By</label>
        <select 
          className="form-select filter-select"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="date">Soonest Date</option>
        </select>
      </div>

      <button 
        className="btn btn-outline-secondary btn-sm w-100 mt-2"
        onClick={() => {
          setFilters({ priceRange: 'all', availability: 'all', rating: 'all' });
          setSortBy('popular');
          onFilterChange({ priceRange: 'all', availability: 'all', rating: 'all' });
          onSortChange('popular');
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}

export default FilterBar;
