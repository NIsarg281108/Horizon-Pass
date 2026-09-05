// src/Components/Profile/FoodOrderModal.jsx
import { useState } from 'react';
import { useBookings } from '../../Context/BookingContext';
import { mockFoodMenu } from '../../Data/mockFoodMenu';

function FoodOrderModal({ bookingId, onClose }) {
  const { dispatch } = useBookings();
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, quantity: 1 }]
    );
  };

  const updateQuantity = (itemId, quantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item.');
      return;
    }
    const foodOrder = {
      items: selectedItems,
      total: total,
      orderDate: new Date().toISOString(),
      status: 'placed',
    };
    dispatch({
      type: 'ADD_FOOD_ORDER',
      payload: { bookingId, foodOrder },
    });
    onClose();
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
            <div className="row">
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
                        value={
                          selectedItems.find((i) => i.id === item.id).quantity
                        }
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        style={{ width: '60px' }}
                        className="form-control form-control-sm"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-end">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodOrderModal;