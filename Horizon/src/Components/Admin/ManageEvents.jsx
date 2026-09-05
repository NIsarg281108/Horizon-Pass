// src/Pages/ManageEvents.jsx
import { Link } from 'react-router';
import { useEvents } from '../../Context/EventContext';

function ManageEvents() {
  const { state, dispatch } = useEvents();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: id });
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Events</h2>
      <Link to="/admin/add-event" className="btn btn-primary mb-3">
        Add New Event
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.category}</td>
              <td>{event.date}</td>
              <td>${event.price}</td>
              <td>{event.availableTickets}/{event.totalTickets}</td>
              <td>
                <Link
                  to={`/admin/edit-event/${event.id}`}
                  className="btn btn-sm btn-warning me-1"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageEvents;