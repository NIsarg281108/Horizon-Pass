// src/Pages/EditEvent.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useEvents } from '../../Context/EventContext';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useEvents();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Movies',
    description: '',
    date: '',
    time: '',
    venue: '',
    price: 0,
    totalTickets: 0,
    imageUrl: '',
    showtimes: '',
    roomTypes: '',
    facilities: '',
  });

  useEffect(() => {
    const event = state.events.find((e) => e.id === id);
    if (event) {
      setFormData({
        title: event.title,
        category: event.category,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        price: event.price,
        totalTickets: event.totalTickets,
        imageUrl: event.imageUrl || '',
        showtimes: event.showtimes ? event.showtimes.join(', ') : '',
        roomTypes: event.roomTypes ? event.roomTypes.join(', ') : '',
        facilities: event.facilities ? event.facilities.join(', ') : '',
      });
    }
  }, [id, state.events]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEvent = {
      ...formData,
      id: id,
      availableTickets: Number(formData.totalTickets),
      price: Number(formData.price),
      totalTickets: Number(formData.totalTickets),
      showtimes: formData.showtimes ? formData.showtimes.split(',').map(s => s.trim()) : undefined,
      roomTypes: formData.roomTypes ? formData.roomTypes.split(',').map(r => r.trim()) : undefined,
      facilities: formData.facilities ? formData.facilities.split(',').map(f => f.trim()) : undefined,
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Event',
    };
    dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
    alert('Event updated successfully!');
    navigate('/admin');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          {/* Same form fields as AddEvent, but with formData values */}
          <div className="row">
            <div className="col-md-6 mb-2">
              <input name="title" className="form-control" placeholder="Title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option>Movies</option>
                <option>Plays</option>
                <option>Activities</option>
                <option>Shows</option>
                <option>Resorts & Hotels</option>
              </select>
            </div>
            <div className="col-12 mb-2">
              <textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div className="col-md-4 mb-2">
              <input name="date" type="date" className="form-control" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-2">
              <input name="time" type="time" className="form-control" value={formData.time} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-2">
              <input name="venue" className="form-control" placeholder="Venue" value={formData.venue} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-2">
              <input name="price" type="number" className="form-control" placeholder="Price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-2">
              <input name="totalTickets" type="number" className="form-control" placeholder="Total Tickets" value={formData.totalTickets} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-2">
              <input name="imageUrl" className="form-control" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={handleChange} />
            </div>
            {formData.category === 'Movies' || formData.category === 'Plays' || formData.category === 'Shows' || formData.category === 'Activities' ? (
              <div className="col-12 mb-2">
                <input name="showtimes" className="form-control" placeholder="Showtimes (comma separated)" value={formData.showtimes} onChange={handleChange} />
              </div>
            ) : null}
            {formData.category === 'Resorts & Hotels' ? (
              <>
                <div className="col-12 mb-2">
                  <input name="roomTypes" className="form-control" placeholder="Room types (comma separated)" value={formData.roomTypes} onChange={handleChange} />
                </div>
                <div className="col-12 mb-2">
                  <input name="facilities" className="form-control" placeholder="Facilities (comma separated)" value={formData.facilities} onChange={handleChange} />
                </div>
              </>
            ) : null}
          </div>
          <button type="submit" className="btn btn-primary">Update Event</button>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;