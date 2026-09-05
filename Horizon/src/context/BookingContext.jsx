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

// Load initial state from localStorage
const storedBookings = localStorage.getItem('horizon_bookings');
const initialBookings = storedBookings ? JSON.parse(storedBookings) : initialState;

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookings);

  // Save to localStorage whenever state changes
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