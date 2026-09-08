import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
    return calculatedAge;
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Weak';
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const strengthCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    if (password.length >= 8 && strengthCount >= 4) return 'Strong';
    if (password.length >= 8 && strengthCount >= 2) return 'Medium';
    return 'Weak';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });

    if (name === 'dob' && value) {
      const calcAge = calculateAge(value);
      if (calcAge !== null && calcAge < 13) {
        setErrors((prev) => ({ ...prev, dob: 'You must be at least 13 years old' }));
      } else {
        setErrors((prev) => ({ ...prev, dob: '' }));
      }
    }

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
      if (formData.confirmPassword && formData.confirmPassword !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit mobile number starting with 6-9';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (formData.email.length > 50) {
      newErrors.email = 'Email must be less than 50 characters';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address (e.g., name@example.com)';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      if (birthDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      } else {
        const calcAge = calculateAge(formData.dob);
        if (calcAge < 13) {
          newErrors.dob = 'You must be at least 13 years old to register';
        }
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agree) {
      newErrors.agree = 'You must accept the Terms & Conditions';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = register({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      dob: formData.dob,
      age: age,
      password: formData.password,
    });

    if (result.success) {
      setShowSuccess(true);
      setErrors({});
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setErrors({ email: result.message });
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-6">
        <h2 className="mb-3">Create Your Account</h2>
        <p className="text-muted">Join Horizon – Pass to book events, movies, and more.</p>

        {showSuccess && (
          <div className="alert alert-success">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g., John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="10-digit mobile number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
            {age !== null && !errors.dob && (
              <small className="text-muted">Age: {age} years</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Min 8 characters with upper, lower, number, special"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            {passwordStrength && !errors.password && (
              <small className={`text-${passwordStrength === 'Strong' ? 'success' : passwordStrength === 'Medium' ? 'warning' : 'danger'}`}>
                Password Strength: {passwordStrength}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password *</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Re-enter your password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className={`form-check-input ${errors.agree ? 'is-invalid' : ''}`}
              id="agree"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="agree">
              I agree to the Terms & Conditions and Privacy Policy *
            </label>
            {errors.agree && <div className="invalid-feedback d-block">{errors.agree}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Create Account
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;