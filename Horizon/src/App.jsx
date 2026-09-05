// src/App.jsx
import { RouterProvider } from 'react-router-dom';
import router from './Router';
import { AuthProvider } from './Context/AuthContext';
import { BookingProvider } from './Context/BookingContext';
import { EventProvider } from './Context/EventContext';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BookingProvider>
          <RouterProvider router={router} />
        </BookingProvider>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;