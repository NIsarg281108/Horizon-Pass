// src/context/BookingContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const BookingContext = createContext();

const initialState = {
  bookings: [],
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };
    case 'ADD_FOOD_ORDER':
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
            : booking
        ),
      };
    default:
      return state;
  }
}

// Safe JSON parsing
const storedBookings = localStorage.getItem('horizon_bookings');
let initialBookings = { bookings: [] };
if (storedBookings) {
  try {
    initialBookings = JSON.parse(storedBookings);
    if (!initialBookings.bookings || !Array.isArray(initialBookings.bookings)) {
      initialBookings = { bookings: [] };
    }
  } catch (e) {
    initialBookings = { bookings: [] };
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookings);

  useEffect(() => {
    localStorage.setItem('horizon_bookings', JSON.stringify(state));
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