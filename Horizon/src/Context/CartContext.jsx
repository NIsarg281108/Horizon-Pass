// src/context/CartContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Initial state
const initialState = {
  cart: [],
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      // Check if item already exists (by event id and tier)
      const existingIndex = state.cart.findIndex(
        (item) =>
          item.event.id === action.payload.event.id &&
          item.tier === action.payload.tier &&
          item.time === action.payload.time
      );
      if (existingIndex !== -1) {
        // Increment quantity
        const updatedCart = state.cart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return { cart: updatedCart };
      }
      return { cart: [...state.cart, action.payload] };
    }

    case 'REMOVE_FROM_CART':
      return {
        cart: state.cart.filter((_, index) => index !== action.payload),
      };

    case 'CLEAR_CART':
      return { cart: [] };

    case 'UPDATE_QUANTITY':
      return {
        cart: state.cart.map((item, index) =>
          index === action.payload.index
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    default:
      return state;
  }
}

// Load cart from localStorage
const storedCart = localStorage.getItem('horizon_cart');
const initialCart = storedCart ? { cart: JSON.parse(storedCart) } : initialState;

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('horizon_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}