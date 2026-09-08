import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockEvents } from '../data/mockEvents';

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
    case 'UPDATE_TICKETS':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                availableTickets: action.payload.availableTickets,
              }
            : event
        ),
      };
    default:
      return state;
  }
}

// Safe JSON parsing
const storedEvents = localStorage.getItem('horizon_events');
let initialEvents = { events: mockEvents };
if (storedEvents) {
  try {
    initialEvents = { events: JSON.parse(storedEvents) };
    if (!Array.isArray(initialEvents.events)) {
      initialEvents = { events: mockEvents };
    }
  } catch (e) {
    initialEvents = { events: mockEvents };
  }
}

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