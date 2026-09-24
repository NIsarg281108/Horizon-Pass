import { useState } from 'react';

function CalendarIntegration({ event, onClose }) {
  const [selectedCalendar, setSelectedCalendar] = useState('google');
  const [reminderTime, setReminderTime] = useState('1day');

  const generateCalendarLinks = () => {
    const startDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 3); // Assume 3 hour event

    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nVenue: ${event.venue}\nCategory: ${event.category}`);
    const location = encodeURIComponent(event.venue);
    const dates = `${formatDate(startDate)}/${formatDate(endDate)}`;

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&location=${location}&body=${details}`,
      yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${formatDate(startDate)}&et=${formatDate(endDate)}&desc=${details}&in_loc=${location}`,
      ics: generateICS(startDate, endDate),
    };
  };

  const generateICS = (startDate, endDate) => {
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Horizon Pass//Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@horizonpass.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}\\n\\nVenue: ${event.venue}\\nCategory: ${event.category}`,
      `LOCATION:${event.venue}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  };

  const handleAddToCalendar = (calendarType) => {
    const links = generateCalendarLinks();
    const link = links[calendarType];

    if (calendarType === 'ics') {
      const a = document.createElement('a');
      a.href = link;
      a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(link, '_blank');
    }
  };

  const handleSetReminder = () => {
    // Calculate reminder time
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    let reminderDate;
    switch (reminderTime) {
      case '1hour':
        reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000);
        break;
      case '1day':
        reminderDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '3days':
        reminderDate = new Date(eventDate.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
      case '1week':
        reminderDate = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        reminderDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
    }

    // Store reminder in localStorage
    const reminders = JSON.parse(localStorage.getItem('horizon_reminders') || '[]');
    reminders.push({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      reminderDate: reminderDate.toISOString(),
      reminderTime: reminderTime,
      created: new Date().toISOString(),
    });
    localStorage.setItem('horizon_reminders', JSON.stringify(reminders));

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    alert(`Reminder set for ${reminderTime} before the event!`);
    onClose();
  };

  const calendars = [
    { id: 'google', name: 'Google Calendar', icon: '📅', color: '#4285f4' },
    { id: 'outlook', name: 'Outlook', icon: '📧', color: '#0078d4' },
    { id: 'yahoo', name: 'Yahoo Calendar', icon: '📆', color: '#6001d2' },
    { id: 'ics', name: 'Download ICS', icon: '📥', color: '#28a745' },
  ];

  const reminderOptions = [
    { value: '1hour', label: '1 hour before' },
    { value: '1day', label: '1 day before' },
    { value: '3days', label: '3 days before' },
    { value: '1week', label: '1 week before' },
  ];

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <h3>📅 Add to Calendar</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="event-summary">
          <h4>{event.title}</h4>
          <p className="event-details">
            📅 {event.date} at {event.time}<br />
            📍 {event.venue}
          </p>
        </div>

        <div className="calendar-section">
          <h4>Choose Calendar</h4>
          <div className="calendar-options">
            {calendars.map((calendar) => (
              <button
                key={calendar.id}
                className={`calendar-option ${selectedCalendar === calendar.id ? 'active' : ''}`}
                onClick={() => setSelectedCalendar(calendar.id)}
                style={{ '--calendar-color': calendar.color }}
              >
                <span className="calendar-icon">{calendar.icon}</span>
                <span className="calendar-name">{calendar.name}</span>
              </button>
            ))}
          </div>
          <button
            className="btn btn-add-calendar w-100"
            onClick={() => handleAddToCalendar(selectedCalendar)}
          >
            Add to {calendars.find(c => c.id === selectedCalendar)?.name}
          </button>
        </div>

        <div className="reminder-section">
          <h4>Set Reminder</h4>
          <div className="reminder-options">
            {reminderOptions.map((option) => (
              <label key={option.value} className="reminder-option">
                <input
                  type="radio"
                  name="reminder"
                  value={option.value}
                  checked={reminderTime === option.value}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <button
            className="btn btn-set-reminder w-100"
            onClick={handleSetReminder}
          >
            🔔 Set Reminder
          </button>
        </div>

        <div className="calendar-note">
          <small className="text-muted">
            💡 Tip: You can also manually add this event to any calendar app using the ICS file.
          </small>
        </div>
      </div>
    </div>
  );
}

export default CalendarIntegration;
