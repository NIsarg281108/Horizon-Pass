// src/Components/Admin/ManageUsers.jsx
import { useAuth } from '../../Context/AuthContext';
import { mockUsers } from '../../data/mockUsers';

function ManageUsers() {
  const { registeredUsers, deleteUser } = useAuth();

  const allUsers = [...mockUsers, ...registeredUsers];

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => {
            const isRegistered = registeredUsers.some((reg) => reg.id === user.id);
            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '—'}</td>
                <td>{user.age || '—'}</td>
                <td>{user.role}</td>
                <td>
                  {isRegistered ? (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-muted">Demo</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;