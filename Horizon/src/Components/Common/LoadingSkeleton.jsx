function LoadingSkeleton({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
              <div className="skeleton-footer">
                <div className="skeleton-price"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="skeleton-text-block">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        );
      case 'event':
        return (
          <div className="skeleton-event">
            <div className="skeleton-event-image"></div>
            <div className="skeleton-event-content">
              <div className="skeleton-badge"></div>
              <div className="skeleton-event-title"></div>
              <div className="skeleton-event-venue"></div>
              <div className="skeleton-event-meta"></div>
              <div className="skeleton-event-price"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="loading-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
