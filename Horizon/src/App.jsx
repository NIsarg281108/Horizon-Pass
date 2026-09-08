import { RouterProvider } from 'react-router';
import router from './Router';
import { AuthProvider } from './Context/AuthContext';
import { BookingProvider } from './Context/BookingContext';
import { EventProvider } from './Context/EventContext';
import { ThemeProvider } from './Context/ThemeContext';
import { ToastProvider } from './Context/ToastContext';
import { WishlistProvider } from './Context/WishlistContext';
import { ReviewProvider } from './Context/ReviewContext';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <EventProvider>
            <BookingProvider>
              <WishlistProvider>
                <ReviewProvider>
                  <RouterProvider router={router} />
                </ReviewProvider>
              </WishlistProvider>
            </BookingProvider>
          </EventProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;