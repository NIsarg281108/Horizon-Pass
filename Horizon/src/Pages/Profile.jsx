// src/Pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useBookings } from '../Context/BookingContext';
import MyTickets from '../Components/Profile/MyTickets';
import FoodOrderModal from '../Components/Profile/FoodOrderModal';

function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  if (!user) {
    return <p>Please login to view your profile.</p>;
  }

  const handleOrderFood = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowFoodModal(true);
  };

  return (
    <div>
      <h2 className="mb-4">My Profile</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5>{user.name}</h5>
          <p className="mb-0">{user.email}</p>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            My Tickets
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Profile Settings
          </button>
        </li>
      </ul>

      {activeTab === 'tickets' && (
        <MyTickets onOrderFood={handleOrderFood} />
      )}

      {activeTab === 'settings' && (
        <div className="card p-4">
          <p>Profile settings coming soon.</p>
        </div>
      )}

      {showFoodModal && (
        <FoodOrderModal
          bookingId={selectedBookingId}
          onClose={() => setShowFoodModal(false)}
        />
      )}
    </div>
  );
}

export default Profile;