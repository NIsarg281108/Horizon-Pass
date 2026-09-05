import { useNavigate } from 'react-router-dom';

const ErrorFallBack = ({ resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleHome = () => {
    resetErrorBoundary();
    navigate('/');
  };

  return (
    <div className="text-center">
      <h2>Something went wrong!</h2>
      <button className="btn btn-primary" onClick={handleHome}>
        Go to Home
      </button>
    </div>
  );
};

export default ErrorFallBack;