function PriceChart({ event }) {
  const priceHistory = [
    { date: '7 days ago', price: event.price * 0.9 },
    { date: '6 days ago', price: event.price * 0.92 },
    { date: '5 days ago', price: event.price * 0.88 },
    { date: '4 days ago', price: event.price * 0.95 },
    { date: '3 days ago', price: event.price * 0.93 },
    { date: '2 days ago', price: event.price * 0.97 },
    { date: '1 day ago', price: event.price * 0.98 },
    { date: 'Today', price: event.price },
  ];

  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));
  const priceRange = maxPrice - minPrice;

  const getBarHeight = (price) => {
    return ((price - minPrice) / priceRange) * 100;
  };

  const getPriceChange = () => {
    const current = priceHistory[priceHistory.length - 1].price;
    const previous = priceHistory[priceHistory.length - 2].price;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const priceChange = getPriceChange();

  return (
    <div className="price-chart-container">
      <div className="price-chart-header">
        <h4>💰 Price Trends</h4>
        <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
          {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}%
        </div>
      </div>

      <div className="price-chart">
        <div className="chart-bars">
          {priceHistory.map((item, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div 
                className="chart-bar"
                style={{ 
                  height: `${getBarHeight(item.price)}%`,
                  background: index === priceHistory.length - 1 ? '#667eea' : '#e0e0e0'
                }}
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
          <span>Current Price</span>
        </div>
        <div className="legend-item">
          <div className="legend-color historical"></div>
          <span>Historical</span>
        </div>
      </div>

      <div className="price-insights">
        <h5>💡 Price Insights</h5>
        <ul>
          <li>Price has {priceChange >= 0 ? 'increased' : 'decreased'} by {Math.abs(priceChange).toFixed(1)}% in the last 24 hours</li>
          <li>Lowest price in the last week: ${minPrice.toFixed(2)}</li>
          <li>Highest price in the last week: ${maxPrice.toFixed(2)}</li>
          <li>Current price is {event.availableTickets < event.totalTickets * 0.3 ? 'in high demand' : 'stable'}</li>
        </ul>
      </div>
    </div>
  );
}

export default PriceChart;
