import { useState, useMemo } from 'react';
import { useBookings } from '../../Context/BookingContext';
import { mockFoodMenu } from '../../data/mockFoodMenu';

// ==================== CONFIGURATION ====================
const MERCHANT_UPI_ID = '9987645607@fam';
const MERCHANT_NAME = 'Horizon Pass Food Order';
// ======================================================

function FoodOrderModal({ bookingId, onClose }) {
  const { dispatch } = useBookings();

  // Food items state
  const [selectedItems, setSelectedItems] = useState([]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isPaying, setIsPaying] = useState(false);

  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Errors
  const [errors, setErrors] = useState({});

  // Calculate total
  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Build UPI QR code URL
  const upiQrUrl = useMemo(() => {
    if (paymentMethod === 'upi' && total > 0) {
      const amount = total.toFixed(2);
      const upiString = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    }
    return '';
  }, [paymentMethod, total]);

  // Toggle item selection
  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, quantity: 1 }]
    );
  };

  // Update quantity of selected item
  const updateQuantity = (itemId, quantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Validate credit card fields
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

  // Handle order placement
  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item.');
      return;
    }

    if (isPaying) return;

    // Validate payment method
    if (paymentMethod === 'credit') {
      const validationErrors = validateCreditCard();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    } else if (paymentMethod === 'upi') {
      // For UPI, just proceed (the QR code is the payment)
      // In a real app, you would wait for payment confirmation
    } else if (paymentMethod === 'paypal') {
      // Simulated
    }

    setErrors({});
    setIsPaying(true);

    // Simulate payment processing
    setTimeout(() => {
      const foodOrder = {
        items: selectedItems,
        total: total,
        orderDate: new Date().toISOString(),
        status: 'paid',
        paymentMethod: paymentMethod,
      };
      dispatch({
        type: 'ADD_FOOD_ORDER',
        payload: { bookingId, foodOrder },
      });
      setIsPaying(false);
      onClose();
    }, 1500);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Food & Beverages</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Food Items Selection */}
            <h6>Select Items</h6>
            <div className="row mb-4">
              {mockFoodMenu.map((item) => (
                <div className="col-md-6 mb-2" key={item.id}>
                  <div className="d-flex align-items-center justify-content-between border rounded p-2">
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedItems.some((i) => i.id === item.id)}
                        onChange={() => toggleItem(item)}
                        className="me-2"
                      />
                      <span>{item.name} - ${item.price}</span>
                    </div>
                    {selectedItems.some((i) => i.id === item.id) && (
                      <input
                        type="number"
                        min="1"
                        value={selectedItems.find((i) => i.id === item.id).quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        style={{ width: '60px' }}
                        className="form-control form-control-sm"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Selection */}
            <h6>Payment Method</h6>
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="foodPayment"
                  id="foodCredit"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label className="form-check-label" htmlFor="foodCredit">Credit Card</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="foodPayment"
                  id="foodUpi"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label className="form-check-label" htmlFor="foodUpi">UPI</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="foodPayment"
                  id="foodPaypal"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label className="form-check-label" htmlFor="foodPaypal">PayPal</label>
              </div>
            </div>

            {/* Conditional Payment Fields */}
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
                <p className="mb-2">Scan this QR code to pay:</p>
                <img
                  src={upiQrUrl}
                  alt="UPI QR Code"
                  style={{ width: '200px', height: '200px' }}
                />
                <p className="mt-2">
                  Merchant UPI ID: <strong>{MERCHANT_UPI_ID}</strong>
                </p>
                <p className="text-muted">Amount: ${total.toFixed(2)}</p>
                <div className="alert alert-info mt-2">
                  <small>
                    <strong>Note:</strong> This QR code is real and will send payment directly to your UPI ID when scanned.
                  </small>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="alert alert-info mt-2">
                You will be redirected to PayPal to complete the payment.
              </div>
            )}

            {/* Total */}
            <div className="text-end mb-3">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handlePlaceOrder}
              disabled={isPaying}
            >
              {isPaying ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodOrderModal;