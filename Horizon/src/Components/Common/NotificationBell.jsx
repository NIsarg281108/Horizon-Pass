import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import { useBookings } from "../../Context/BookingContext";

const DISMISSED_KEY = "horizon_dismissed_notifications";
const REMINDERS_KEY = "horizon_reminders";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function NotificationBell() {
  const { user } = useAuth();
  const { state } = useBookings();
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState(() => readJson(REMINDERS_KEY, []));
  const [dismissed, setDismissed] = useState(() => readJson(DISMISSED_KEY, []));
  const ref = useRef(null);

  // Reload reminders each time the panel opens, in case they were set elsewhere
  useEffect(() => {
    if (open) setReminders(readJson(REMINDERS_KEY, []));
  }, [open]);

  // Close when clicking outside the panel
  useEffect(() => {
    if (!open) return;
    const handleDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [open]);

  const items = useMemo(() => {
    if (!user) return [];

    const now = Date.now();
    const weekAhead = now + 7 * 86400000;
    const list = [];

    // Reminders that are due and whose event hasn't started yet
    reminders.forEach((r) => {
      const eventTime = new Date(
        `${r.eventDate}T${r.eventTime || "00:00"}`,
      ).getTime();
      const due = new Date(r.reminderDate).getTime();
      if (due <= now && eventTime >= now) {
        list.push({
          id: `rem-${r.eventId}-${r.eventDate}-${r.eventTime}`,
          icon: "⏰",
          title: `Reminder: ${r.eventTitle}`,
          text: `Starts ${r.eventDate} at ${r.eventTime}`,
        });
      }
    });

    // Confirmed bookings starting within the next 7 days
    state.bookings.forEach((b) => {
      if (b.userId !== user.id || b.status !== "confirmed") return;
      const start = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
      if (start >= now && start <= weekAhead) {
        list.push({
          id: `bk-${b.id}`,
          icon: "🎟",
          title: b.title,
          text: `Upcoming: ${b.date} at ${b.time}`,
        });
      }
    });

    return list.filter((item) => !dismissed.includes(item.id));
  }, [user, reminders, state.bookings, dismissed]);

  if (!user) return null;

  const dismissAll = () => {
    const ids = [...dismissed, ...items.map((i) => i.id)];
    setDismissed(ids);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  };

  const dismissOne = (id) => {
    const ids = [...dismissed, id];
    setDismissed(ids);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  };

  return (
    <div className="notif" ref={ref}>
      <button
        type="button"
        className="theme-toggle-btn notif-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        🔔
        {items.length > 0 && <span className="action-badge">{items.length}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-head">
            <strong>Notifications</strong>
            {items.length > 0 && (
              <button type="button" className="notif-link-btn" onClick={dismissAll}>
                Clear all
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="notif-empty">You're all caught up.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="notif-item">
                <span className="notif-icon">{item.icon}</span>
                <div className="notif-body">
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
                <button
                  type="button"
                  className="notif-link-btn"
                  onClick={() => dismissOne(item.id)}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            ))
          )}

          <Link
            to="/profile"
            className="notif-foot"
            onClick={() => setOpen(false)}
          >
            View my bookings
          </Link>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;