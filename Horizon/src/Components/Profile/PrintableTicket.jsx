import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

const TICKETS_PER_SHEET = 8; // 2 across × 4 down on A4

// Turns a booking code into a repeatable pattern of bar widths
function barcodePattern(code) {
  const source = String(code || "0000000000");
  const widths = [];

  for (let i = 0; i < source.length; i++) {
    const digit = Number(source[i]) || 0;
    widths.push(1 + (digit % 3));
    widths.push(1 + ((digit + i) % 2));
  }

  return widths;
}

// Split a list into chunks, e.g. 10 items → [8 items, 2 items]
function chunk(list, size) {
  const pages = [];
  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size));
  }
  return pages;
}

// One ticket, used in both the on-screen preview and the print sheet
function Ticket({ booking, seat, code, bars, pricePerTicket }) {
  return (
    <div className="tk-slot">
      <div className="tk-ticket">
        <div className="tk-main">
          <div className="tk-top">
            <span className="tk-brand">Horizon – Pass</span>
            <span className="tk-tier">{booking.tier}</span>
          </div>

          <h3 className="tk-title">{booking.title}</h3>
          <p className="tk-venue">{booking.venue}</p>

          <div className="tk-info">
            <div>
              <span>Date</span>
              <strong>{booking.date}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{booking.time}</strong>
            </div>
            <div>
              <span>Seat</span>
              <strong>{seat || "General"}</strong>
            </div>
            <div>
              <span>Price</span>
              <strong>${pricePerTicket.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="tk-stub">
          <div className="tk-barcode" aria-hidden="true">
            {bars.map((width, index) => (
              <span
                key={index}
                className={index % 2 === 0 ? "tk-bar" : "tk-gap"}
                style={{ width: `${width * 1.2}px` }}
              />
            ))}
          </div>
          <div className="tk-code">{code}</div>
        </div>
      </div>
    </div>
  );
}

function PrintableTicket({ booking, onClose }) {
  const total = Math.max(1, Number(booking.quantity) || 1);
  const pricePerTicket = (Number(booking.totalPrice) || 0) / total;
  const bars = useMemo(() => barcodePattern(booking.barcode), [booking.barcode]);

  // One entry per attendee: seat and code are unique to each person
  const tickets = useMemo(() => {
    const seats = booking.seats || [];
    const base = booking.barcode || "0000000000";
    return Array.from({ length: total }, (_, i) => ({
      seat: seats[i] || null,
      code: `${base}-${String(i + 1).padStart(2, "0")}`,
    }));
  }, [booking.barcode, booking.seats, total]);

  // Each A4 sheet holds up to 8 tickets
  const sheets = useMemo(() => chunk(tickets, TICKETS_PER_SHEET), [tickets]);

  // Stop the page behind from scrolling while the ticket is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return createPortal(
    <>
      <div className="tk-overlay" onClick={onClose}>
        <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
          <div className="tk-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              🖨 Print tickets
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <p className="tk-hint">
            {total} ticket{total === 1 ? "" : "s"} on {sheets.length} A4
            sheet{sheets.length === 1 ? "" : "s"}, {TICKETS_PER_SHEET} per
            sheet. In the print dialog set Scale to 100%, Margins to None, and
            untick Headers and footers.
          </p>

          <div className="tk-preview">
            {tickets.map((t) => (
              <Ticket
                key={t.code}
                booking={booking}
                seat={t.seat}
                code={t.code}
                bars={bars}
                pricePerTicket={pricePerTicket}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hidden on screen; one .tk-sheet per A4 page when printing */}
      <div className="tk-print-root">
        {sheets.map((sheet, sheetIndex) => (
          <div className="tk-sheet" key={`sheet-${sheetIndex}`}>
            {sheet.map((t) => (
              <Ticket
                key={`print-${t.code}`}
                booking={booking}
                seat={t.seat}
                code={t.code}
                bars={bars}
                pricePerTicket={pricePerTicket}
              />
            ))}
          </div>
        ))}
      </div>
    </>,
    document.body,
  );
}

export default PrintableTicket;