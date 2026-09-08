import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

// ==================== CONFIGURATION ====================
// YOUR REAL MERCHANT UPI ID
const MERCHANT_UPI_ID = '9987645607@fam';
const MERCHANT_NAME = 'Horizon Pass';
// ======================================================

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI
  const [upiId, setUpiId] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Generate a random user UPI ID (optional, just for display)
  useEffect(() => {
    const randomPart = Math.random().toString(36).substring(2, 8);
    setUpiId(`user${randomPart}@horizonpass`);
  }, []);

  // Build UPI deep link for QR code
  const upiQrUrl = useMemo(() => {
    if (paymentMethod === 'upi' && bookingData) {
      const amount = bookingData.totalPrice.toFixed(2);
      const upiString = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    }
    return '';
  }, [paymentMethod, bookingData]);

  if (!bookingData) {
    return (
      <div className="alert alert-warning">
        No booking data found. <a href="/">Go back to home</a>
      </div>
    );
  }

  const validateCreditCard = () => {
    const newErrors = {};
    const cardNumberClean = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
      newErrors.expiry = 'Expiry must be MM/YY';
    } else {
      const [month, year] = expiry.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiry = 'Card is expired';
      }
    }

    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    return newErrors;
  };

  const handlePayment = () => {
    if (isProcessing) return;

    let validationErrors = {};
    if (paymentMethod === 'credit') {
      validationErrors = validateCreditCard();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);

    // Simulate payment processing (no actual transfer verification)
    setTimeout(() => {
      navigate('/payment-success', { state: { bookingData } });
    }, 1500);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
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
                <p className="mb-1">{bookingData.venue} • {bookingData.date} • {bookingData.time}</p>
                <p className="mb-1">Tier: {bookingData.tier}</p>
                <p className="mb-1">Quantity: {bookingData.quantity}</p>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span>Total Amount</span>
              <strong>${bookingData.totalPrice.toFixed(2)}</strong>
            </div>

            <h6>Payment Method</h6>
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="credit"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label className="form-check-label" htmlFor="credit">Credit Card</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="paypal"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label className="form-check-label" htmlFor="paypal">PayPal</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="upi"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label className="form-check-label" htmlFor="upi">UPI</label>
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <div className="mt-2">
                <div className="mb-2">
                  <input
                    className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                </div>
                <div className="row">
                  <div className="col">
                    <input
                      className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                    {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                  </div>
                  <div className="col">
                    <input
                      className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                    {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="mt-2 text-center">
                <p className="mb-2">Scan this QR code with any UPI app to pay:</p>
                <img
                  src={upiQrUrl}
                  alt="UPI QR Code"
                  style={{ width: '200px', height: '200px' }}
                />
                <p className="mt-2">
                  Merchant UPI ID: <strong>{MERCHANT_UPI_ID}</strong>
                </p>
                <p className="text-muted">Amount: ${bookingData.totalPrice.toFixed(2)}</p>
                <div className="alert alert-info mt-2">
                  <small>
                    <strong>Note:</strong> This QR code is real and will directly send the payment to your UPI ID when scanned.
                  </small>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="alert alert-info mt-2">
                You will be redirected to PayPal to complete the payment.
              </div>
            )}
          </div>
          <div className="card-footer bg-white">
            <button
              className="btn btn-success w-100"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${bookingData.totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;