import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', options = {}) => {
    const id = `toast-${toastCounter++}`;
    const duration = options.duration || 4000;
    const persistent = options.persistent || false;
    
    const newToast = {
      id,
      message,
      type,
      title: options.title || null,
      icon: options.icon || null,
      actions: options.actions || [],
      persistent,
    };

    setToasts((prev) => [...prev, newToast]);

    if (!persistent) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast-enhanced toast-${toast.type}`}
            role="alert"
          >
            <div className="toast-content">
              {toast.icon && <span className="toast-icon">{toast.icon}</span>}
              <div className="toast-message">
                {toast.title && <strong className="toast-title">{toast.title}</strong>}
                <span className="toast-text">{toast.message}</span>
              </div>
              <button 
                className="toast-close"
                onClick={() => removeToast(toast.id)}
              >
                ×
              </button>
            </div>
            {toast.actions.length > 0 && (
              <div className="toast-actions">
                {toast.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${action.className || 'btn-outline-light'}`}
                    onClick={() => {
                      action.handler();
                      if (action.closeOnClick !== false) {
                        removeToast(toast.id);
                      }
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}