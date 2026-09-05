// src/context/EventContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockEvents } from '../Data/mockEvents';

const EventContext = createContext();

const initialState = {
  events: mockEvents,
};

function eventReducer(state, action) {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    default:
      return state;
  }
}

// Load from localStorage if available
const storedEvents = localStorage.getItem('horizon_events');
const initialEvents = storedEvents
  ? { events: JSON.parse(storedEvents) }
  : initialState;

export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, initialEvents);

  useEffect(() => {
    localStorage.setItem('horizon_events', JSON.stringify(state.events));
  }, [state.events]);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}