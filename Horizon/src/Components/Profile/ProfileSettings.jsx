// src/Components/Profile/ProfileSettings.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';

function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
  });
  const [age, setAge] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        dob: user.dob || '',
      });
      if (user.dob) {
        calculateAge(user.dob);
      }
    }
  }, [user]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'dob') {
      calculateAge(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage('Name is required');
      return;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setMessage('Enter a valid 10-digit phone number');
      return;
    }

    updateUser({
      name: formData.name,
      phone: formData.phone,
      dob: formData.dob,
      age: age,
    });
    setMessage('Profile updated successfully!');
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="mb-3">Profile Settings</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email Address (cannot be changed)</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {age !== null && (
            <small className="text-muted d-block mt-1">Age: {age} years</small>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default ProfileSettings;