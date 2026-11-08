// Shared filter and sort logic for category and search pages
export const DEFAULT_FILTERS = {
  dateRange: "any",
  minPrice: "",
  maxPrice: "",
  availability: "all",
  rating: "all",
};

export function applyEventFilters(events, filters, getAverageRating) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let limit = null;
  if (filters.dateRange !== "any") {
    limit = new Date(today);
    limit.setDate(limit.getDate() + Number(filters.dateRange));
  }

  const minPrice = filters.minPrice === "" ? null : Number(filters.minPrice);
  const maxPrice = filters.maxPrice === "" ? null : Number(filters.maxPrice);

  return events.filter((event) => {
    if (minPrice !== null && event.price < minPrice) return false;
    if (maxPrice !== null && event.price > maxPrice) return false;

    if (limit) {
      const eventDate = new Date(`${event.date}T00:00:00`);
      if (eventDate < today || eventDate > limit) return false;
    }

    if (filters.availability === "available" && event.availableTickets === 0) {
      return false;
    }
    if (
      filters.availability === "limited" &&
      event.availableTickets >= event.totalTickets * 0.3
    ) {
      return false;
    }
    if (filters.availability === "sold-out" && event.availableTickets > 0) {
      return false;
    }

    if (filters.rating !== "all") {
      if (getAverageRating(event.id) < Number(filters.rating)) return false;
    }

    return true;
  });
}

export function sortEvents(events, sortBy, getAverageRating) {
  const list = [...events];

  switch (sortBy) {
    case "price-low":
      return list.sort((a, b) => a.price - b.price);
    case "price-high":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort(
        (a, b) => getAverageRating(b.id) - getAverageRating(a.id),
      );
    case "date":
      return list.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "popular":
    default:
      return list.sort(
        (a, b) =>
          b.totalTickets -
          b.availableTickets -
          (a.totalTickets - a.availableTickets),
      );
  }
}