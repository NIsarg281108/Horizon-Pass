/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from "react";

const BookingContext = createContext();

function bookingReducer(state, action) {
  switch (action.type) {
    case "ADD_BOOKING":
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };
    case "ADD_FOOD_ORDER":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.bookingId
            ? {
                ...booking,
                foodOrders: [
                  ...(booking.foodOrders || []),
                  action.payload.foodOrder,
                ],
              }
            : booking,
        ),
      };
    case "CANCEL_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload
            ? { ...booking, status: "cancelled" }
            : booking,
        ),
      };
    default:
      return state;
  }
}

// Safe JSON parsing of saved bookings
function loadBookings() {
  const stored = localStorage.getItem("horizon_bookings");
  if (!stored) return { bookings: [] };

  try {
    const parsed = JSON.parse(stored);
    if (!parsed.bookings || !Array.isArray(parsed.bookings)) {
      return { bookings: [] };
    }
    return parsed;
  } catch {
    return { bookings: [] };
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(
    bookingReducer,
    undefined,
    loadBookings,
  );

  useEffect(() => {
    localStorage.setItem("horizon_bookings", JSON.stringify(state));
  }, [state]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingContext);
}