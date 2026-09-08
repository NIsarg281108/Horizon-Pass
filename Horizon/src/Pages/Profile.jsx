import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import MyTickets from '../Components/Profile/MyTickets';
import FoodOrderModal from '../Components/Profile/FoodOrderModal';
import ProfileSettings from '../Components/Profile/ProfileSettings';
import { useWishlist } from '../Context/WishlistContext';
import { useEvents } from '../Context/EventContext';
import EventCard from '../Components/Common/EventCard';

function Profile() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { state: eventState } = useEvents();
  const [activeTab, setActiveTab] = useState('tickets');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const favoriteEvents = eventState.events.filter((event) => wishlist.includes(event.id));

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
          <p className="mb-1"><strong>Email:</strong> {user.email}</p>
          <p className="mb-1"><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
          <p className="mb-1"><strong>Date of Birth:</strong> {user.dob || 'Not provided'}</p>
          <p className="mb-1"><strong>Age:</strong> {user.age !== undefined ? `${user.age} years` : 'Not provided'}</p>
          <p className="mb-0"><strong>Role:</strong> {user.role}</p>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
            My Tickets
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            Profile Settings
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
            My Favorites ({favoriteEvents.length})
          </button>
        </li>
      </ul>

      {activeTab === 'tickets' && <MyTickets onOrderFood={handleOrderFood} />}
      {activeTab === 'settings' && <ProfileSettings />}
      {activeTab === 'favorites' && (
        favoriteEvents.length === 0 ? <p>No favorites yet.</p> : (
          <div className="row g-4">
            {favoriteEvents.map((event) => (
              <div className="col-md-4 col-lg-3" key={event.id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )
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