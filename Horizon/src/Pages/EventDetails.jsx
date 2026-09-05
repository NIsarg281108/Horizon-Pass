import { useParams, useNavigate } from 'react-router';
import { useMemo, useState } from 'react';
import { useEvents } from '../Context/EventContext';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useEvents();

  const event = useMemo(
    () => state.events.find((e) => e.id === id),
    [state.events, id]
  );

  

  const [tier, setTier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');

  if (!event) {
    return (
      <div className="alert alert-warning">
        Event not found. <a href="/">Go home</a>
      </div>
    );
  }

  const tierOptions = event.roomTypes || ['Standard', 'Premium', 'VIP'];

  if (!tier) {
    setTier(tierOptions[0]);
  }

  if (!selectedTime && event.showtimes) {
    setSelectedTime(event.showtimes[0]);
  }

  const getMultiplier = (selectedTier) => {
    if (event.roomTypes) {
      if (selectedTier === 'Suite') return 2;
      if (selectedTier === 'Deluxe') return 1.5;
      return 1;
    }
    if (selectedTier === 'Premium') return 1.5;
    if (selectedTier === 'VIP') return 2;
    return 1;
  };

  const totalPrice = event.price * quantity * getMultiplier(tier);

  const handleBookNow = () => {
    const bookingData = {
      eventId: event.id,
      title: event.title,
      category: event.category,
      venue: event.venue,
      date: event.date,
      time: selectedTime || event.time,
      tier,
      quantity,
      totalPrice,
      imageUrl: event.imageUrl,
    };
    navigate('/checkout', { state: { bookingData } });
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h2>{event.title}</h2>
          <p className="text-muted">{event.category}</p>
          <p>{event.description}</p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          <p>
            <strong>Date:</strong> {event.date}
          </p>
          <p>
            <strong>Time:</strong> {event.time}
          </p>
          {event.facilities && (
            <p>
              <strong>Facilities:</strong> {event.facilities.join(', ')}
            </p>
          )}
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <h4>Book Your Ticket</h4>
        <div className="row g-3">
          {/* Showtime selection if available */}
          {event.showtimes && (
            <div className="col-md-4">
              <label className="form-label">Showtime</label>
              <select
                className="form-select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                {event.showtimes.map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>
            </div>
          )}

          {/* Tier selection */}
          <div className="col-md-4">
            <label className="form-label">
              {event.roomTypes ? 'Room Type' : 'Tier'}
            </label>
            <select
              className="form-select"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              {tierOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="col-md-4">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              min="1"
              max={event.availableTickets}
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Total: <span className="text-primary">${totalPrice.toFixed(2)}</span>
          </h5>
          <button className="btn btn-success btn-lg" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;