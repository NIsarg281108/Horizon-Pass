import { RouterProvider } from "react-router";
import router from "./Router";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { EventProvider } from "./context/EventContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ReviewProvider } from "./context/ReviewContext";

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
