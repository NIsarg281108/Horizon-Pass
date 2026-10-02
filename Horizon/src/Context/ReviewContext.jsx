import { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem('horizon_reviews');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('horizon_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (eventId, userId, rating, comment) => {
    const newReview = {
      id: Date.now().toString(),
      eventId,
      userId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [...prev, newReview]);
  };

  const getReviewsForEvent = (eventId) => {
    return reviews.filter((review) => review.eventId === eventId);
  };

  const getAverageRating = (eventId) => {
    const eventReviews = getReviewsForEvent(eventId);
    if (eventReviews.length === 0) return 0;
    const sum = eventReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / eventReviews.length;
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewsForEvent, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewContext);
}