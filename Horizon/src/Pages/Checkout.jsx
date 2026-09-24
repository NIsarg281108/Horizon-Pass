import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

const MERCHANT_UPI_ID = '9987645607@fam';
const MERCHANT_NAME = 'Horizon Pass';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const [errors, setErrors] = useState({});

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
      <div className="checkout-error">
        <div className="error-content">
          <h3>⚠️ No booking data found</h3>
          <p>Please go back and select an event to book.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const validateCreditCard = () => {
    const newErrors = {};
    const cardNumberClean = cardNumber.replace(/\s+/g, '');
    
    if (!cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
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

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      let validationErrors = {};
      if (paymentMethod === 'credit') {
        validationErrors = validateCreditCard();
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      setCurrentStep(3);
    }
  };

  const handlePayment = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    setTimeout(() => {
      navigate('/payment-success', { state: { bookingData } });
    }, 2000);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  const steps = [
    { number: 1, title: 'Order Summary' },
    { number: 2, title: 'Payment' },
    { number: 3, title: 'Confirm' },
  ];

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="progress-steps">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {/* Step 1: Order Summary */}
          {currentStep === 1 && (
            <div className="checkout-card">
              <h2>Order Summary</h2>
              <div className="order-summary">
                <div className="order-item">
                  <img
                    src={bookingData.imageUrl}
                    alt={bookingData.title}
                    className="order-image"
                  />
                  <div className="order-details">
                    <h3>{bookingData.title}</h3>
                    <p className="order-meta">
                      {bookingData.venue} • {bookingData.date} • {bookingData.time}
                    </p>
                    <div className="order-specs">
                      <span className="spec-item">
                        <strong>Tier:</strong> {bookingData.tier}
                      </span>
                      <span className="spec-item">
                        <strong>Quantity:</strong> {bookingData.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-breakdown">
                  <div className="breakdown-row">
                    <span>Base Price</span>
                    <span>${(bookingData.totalPrice / bookingData.quantity).toFixed(2)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Quantity</span>
                    <span>x{bookingData.quantity}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Service Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="breakdown-row total">
                    <strong>Total</strong>
                    <strong className="total-amount">${bookingData.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <div className="checkout-actions">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={handleNextStep}>
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="checkout-card">
              <h2>Payment Method</h2>
              
              <div className="payment-methods">
                <div
                  className={`payment-method ${paymentMethod === 'credit' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('credit')}
                >
                  <div className="payment-icon">💳</div>
                  <div className="payment-info">
                    <strong>Credit / Debit Card</strong>
                    <p className="text-muted">Pay securely with your card</p>
                  </div>
                  <div className="payment-radio">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'credit'}
                      onChange={() => handlePaymentMethodChange('credit')}
                    />
                  </div>
                </div>

                <div
                  className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('upi')}
                >
                  <div className="payment-icon">📱</div>
                  <div className="payment-info">
                    <strong>UPI Payment</strong>
                    <p className="text-muted">Scan QR code with any UPI app</p>
                  </div>
                  <div className="payment-radio">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => handlePaymentMethodChange('upi')}
                    />
                  </div>
                </div>

                <div
                  className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('paypal')}
                >
                  <div className="payment-icon">🅿️</div>
                  <div className="payment-info">
                    <strong>PayPal</strong>
                    <p className="text-muted">Pay with your PayPal account</p>
                  </div>
                  <div className="payment-radio">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => handlePaymentMethodChange('paypal')}
                    />
                  </div>
                </div>
              </div>

              {paymentMethod === 'credit' && (
                <div className="card-details">
                  <h3>Card Details</h3>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                    {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(value);
                      }}
                      maxLength="19"
                    />
                    {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            setExpiry(value.slice(0, 2) + '/' + value.slice(2, 4));
                          } else {
                            setExpiry(value);
                          }
                        }}
                        maxLength="5"
                      />
                      {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength="3"
                      />
                      {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-details">
                  <h3>Scan to Pay</h3>
                  <div className="qr-container">
                    <img src={upiQrUrl} alt="UPI QR Code" className="qr-code" />
                  </div>
                  <div className="upi-info">
                    <p><strong>Merchant UPI ID:</strong> {MERCHANT_UPI_ID}</p>
                    <p><strong>Amount:</strong> ${bookingData.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="alert alert-info">
                    <small>
                      <strong>Note:</strong> This QR code is real and will directly send the payment to your UPI ID when scanned.
                    </small>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="paypal-details">
                  <div className="alert alert-info">
                    <p className="mb-0">You will be redirected to PayPal to complete the payment securely.</p>
                  </div>
                </div>
              )}

              <div className="checkout-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={handleNextStep}>
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <div className="checkout-card">
              <h2>Confirm Your Order</h2>
              
              <div className="order-confirmation">
                <div className="confirm-item">
                  <span className="confirm-label">Event</span>
                  <span className="confirm-value">{bookingData.title}</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Venue</span>
                  <span className="confirm-value">{bookingData.venue}</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Date & Time</span>
                  <span className="confirm-value">{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Tier</span>
                  <span className="confirm-value">{bookingData.tier}</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Quantity</span>
                  <span className="confirm-value">{bookingData.quantity} ticket(s)</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Payment Method</span>
                  <span className="confirm-value">
                    {paymentMethod === 'credit' ? 'Credit/Debit Card' : 
                     paymentMethod === 'upi' ? 'UPI' : 'PayPal'}
                  </span>
                </div>
                <div className="confirm-item total">
                  <span className="confirm-label">Total Amount</span>
                  <span className="confirm-value total-amount">${bookingData.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="terms-checkbox">
                <label className="form-check">
                  <input type="checkbox" required />
                  <span className="form-check-label">
                    I agree to the Terms & Conditions and Cancellation Policy
                  </span>
                </label>
              </div>

              <div className="checkout-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  Back
                </button>
                <button
                  className="btn btn-success btn-lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    `Pay $${bookingData.totalPrice.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="sidebar-card">
            <h3>Order Summary</h3>
            <div className="sidebar-item">
              <img
                src={bookingData.imageUrl}
                alt={bookingData.title}
                className="sidebar-image"
              />
              <div className="sidebar-details">
                <strong>{bookingData.title}</strong>
                <p className="text-muted mb-0">{bookingData.venue}</p>
              </div>
            </div>
            <div className="sidebar-breakdown">
              <div className="breakdown-row">
                <span>{bookingData.quantity}x {bookingData.tier}</span>
                <span>${bookingData.totalPrice.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span>Service Fee</span>
                <span>$0.00</span>
              </div>
              <div className="breakdown-row total">
                <strong>Total</strong>
                <strong>${bookingData.totalPrice.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="sidebar-card security-info">
            <h4>🔒 Secure Payment</h4>
            <p className="text-muted mb-0">
              Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;