/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from "react";
import { mockEvents } from "../Data/mockEvents";
import { getEventImages } from "../Data/eventImages";

const EventContext = createContext();
const STORAGE_KEY = "horizon_events";

// Generated placeholders are SVG data URLs, which start with "data:image/svg"
const isGeneratedPlaceholder = (url) =>
  typeof url === "string" && url.startsWith("data:image/svg");

// Mock events get their photo, even when a saved copy has the old placeholder.
// Images set by an admin are left alone.
function refreshImages(events) {
  const mockIds = new Set(mockEvents.map((e) => e.id));
  return events.map((event) => {
    if (!mockIds.has(event.id)) return event;
    if (!event.imageUrl || isGeneratedPlaceholder(event.imageUrl)) {
      return { ...event, imageUrl: getEventImages(event).main };
    }
    return event;
  });
}

function loadEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return refreshImages(stored);
  } catch {
    // Corrupt or missing data: fall back to the mock list
  }
  return refreshImages(mockEvents);
}

function eventReducer(state, action) {
  switch (action.type) {
    case "ADD_EVENT":
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event,
        ),
      };
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case "UPDATE_TICKETS":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                availableTickets: action.payload.availableTickets,
              }
            : event,
        ),
      };
    case "ADJUST_TICKETS":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                availableTickets: Math.min(
                  event.totalTickets,
                  Math.max(0, event.availableTickets + action.payload.delta),
                ),
              }
            : event,
        ),
      };
    default:
      return state;
  }
}

export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(
    eventReducer,
    undefined,
    () => ({ events: loadEvents() }),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
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