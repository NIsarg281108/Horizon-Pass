function PriceChart({ event }) {
  // Illustrative only: these values are generated from the current price,
  // because real price history isn't tracked yet.
  const priceHistory = [
    { date: "7 days ago", price: event.price * 0.9 },
    { date: "6 days ago", price: event.price * 0.92 },
    { date: "5 days ago", price: event.price * 0.88 },
    { date: "4 days ago", price: event.price * 0.95 },
    { date: "3 days ago", price: event.price * 0.93 },
    { date: "2 days ago", price: event.price * 0.97 },
    { date: "1 day ago", price: event.price * 0.98 },
    { date: "Today", price: event.price },
  ];

  const maxPrice = Math.max(...priceHistory.map((p) => p.price));
  const minPrice = Math.min(...priceHistory.map((p) => p.price));
  const priceRange = maxPrice - minPrice || 1;

  const getBarHeight = (price) => ((price - minPrice) / priceRange) * 100;

  const current = priceHistory[priceHistory.length - 1].price;
  const previous = priceHistory[priceHistory.length - 2].price;
  const priceChange = ((current - previous) / previous) * 100;

  return (
    <div className="price-chart-container">
      <div className="price-chart-header">
        <div className="d-flex align-items-center gap-2">
          <h4 className="mb-0">💰 Price trends</h4>
          <span className="simulated-badge">Simulated</span>
        </div>
        <div
          className={`price-change ${priceChange >= 0 ? "positive" : "negative"}`}
        >
          {priceChange >= 0 ? "↑" : "↓"} {Math.abs(priceChange).toFixed(1)}%
        </div>
      </div>

      <p className="simulated-note">
        Illustrative only. Real price history isn't tracked yet.
      </p>

      <div className="price-chart">
        <div className="chart-bars">
          {priceHistory.map((item, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{ height: `${getBarHeight(item.price)}%` }}
              >
                <span className="bar-value">${item.price.toFixed(2)}</span>
              </div>
              <span className="bar-label">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="price-chart-legend">
        <div className="legend-item">
          <div className="legend-color current"></div>
          <span>Current price</span>
        </div>
        <div className="legend-item">
          <div className="legend-color historical"></div>
          <span>Simulated history</span>
        </div>
      </div>

      <div className="price-insights">
        <h5>💡 Insights</h5>
        <ul>
          <li>
            Simulated price {priceChange >= 0 ? "rose" : "fell"} by{" "}
            {Math.abs(priceChange).toFixed(1)}% since yesterday
          </li>
          <li>Lowest simulated price this week: ${minPrice.toFixed(2)}</li>
          <li>Highest simulated price this week: ${maxPrice.toFixed(2)}</li>
          <li>
            Availability:{" "}
            {event.availableTickets < event.totalTickets * 0.3
              ? "in high demand"
              : "stable"}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PriceChart;