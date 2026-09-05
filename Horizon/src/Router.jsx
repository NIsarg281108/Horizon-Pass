// src/Router.jsx
import { createBrowserRouter } from 'react-router';
import Layout from './Components/Common/Layout';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MoviesPage from './Pages/MoviesPage';
import PlaysPage from './Pages/PlaysPage';
import ActivitiesPage from './Pages/ActivitiesPage';
import ShowsPage from './Pages/ShowsPage';
import ResortsPage from './Pages/ResortsPage';
import EventDetails from './Pages/EventDetails';
import Checkout from './Pages/Checkout';
import PaymentSuccess from './Pages/PaymentSuccess';
import Profile from './Pages/Profile';
import ProtectedRoute from './Components/Common/ProtectedRoute';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AddEvent from './Components/Admin/AddEvent';
import ManageEvents from './Components/Admin/ManageEvents';
import EditEvent from './Components/Admin/EditEvent';
import ManageUsers from './Components/Admin/ManageUsers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'movies', element: <ProtectedRoute><MoviesPage /></ProtectedRoute> },
      { path: 'plays', element: <ProtectedRoute><PlaysPage /></ProtectedRoute> },
      { path: 'activities', element: <ProtectedRoute><ActivitiesPage /></ProtectedRoute> },
      { path: 'shows', element: <ProtectedRoute><ShowsPage /></ProtectedRoute> },
      { path: 'resorts', element: <ProtectedRoute><ResortsPage /></ProtectedRoute> },
      { path: 'event/:id', element: <ProtectedRoute><EventDetails /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'payment-success', element: <ProtectedRoute><PaymentSuccess /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      // Admin routes
      { path: 'admin', element: <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute> },
      { path: 'admin/add-event', element: <ProtectedRoute role="admin"><AddEvent /></ProtectedRoute> },
      { path: 'admin/edit-event/:id', element: <ProtectedRoute role="admin"><EditEvent /></ProtectedRoute> },
      { path: 'admin/manage-events', element: <ProtectedRoute role="admin"><ManageEvents /></ProtectedRoute> },
      { path: 'admin/manage-users', element: <ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute> },
    ],
  },
]);

export default router;