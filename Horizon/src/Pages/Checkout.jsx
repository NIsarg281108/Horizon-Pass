import { useLocation, useNavigate } from 'react-router';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  if (!bookingData) {
    return (
      <div className="alert alert-warning">
        No booking data found. <a href="/">Go back to home</a>
      </div>
    );
  }

  const handlePayment = () => {
    navigate('/payment-success', { state: { bookingData } });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4">Checkout</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Order Summary</h5>
            <hr />
            <div className="d-flex">
              <img
                src={bookingData.imageUrl}
                alt={bookingData.title}
                style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                className="me-3 rounded"
              />
              <div>
                <h6>{bookingData.title}</h6>
                <p className="mb-1">
                  {bookingData.venue} • {bookingData.date} • {bookingData.time}
                </p>
                <p className="mb-1">Tier: {bookingData.tier}</p>
                <p className="mb-1">Quantity: {bookingData.quantity}</p>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Total Amount</span>
              <strong>${bookingData.totalPrice.toFixed(2)}</strong>
            </div>
          </div>
          <div className="card-footer bg-white">
            <button className="btn btn-success w-100" onClick={handlePayment}>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;