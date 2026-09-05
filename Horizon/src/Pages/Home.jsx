import { Link } from 'react-router';
import { useAuth } from '../Context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="hero-section text-center p-5 bg-light rounded">
      <h1 className="display-4">Horizon – Pass</h1>
      <p className="lead">Book the show. Stay the night. Chase the Horizon.</p>
      {user ? (
        <p>
          Welcome back, <strong>{user.name}</strong>! Explore categories above.
        </p>
      ) : (
        <p>
          <Link className="btn btn-primary btn-lg" to="/login">
            Login to Explore
          </Link>
        </p>
      )}
    </div>
  );
}

export default Home;