const DAY = 86400000;

export const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

// Time windows for the selected range and the equal-length period before it
export function getWindows(range, now = new Date()) {
  if (range === "all") return null;

  const n = Number(range);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const today = start.getTime();

  const curFrom = today - (n - 1) * DAY;
  const prevTo = curFrom - DAY;
  const prevFrom = prevTo - (n - 1) * DAY;

  return {
    curFrom,
    curTo: today + DAY - 1,
    prevFrom,
    prevTo: prevTo + DAY - 1,
  };
}

const bookingTime = (b) =>
  new Date(`${b.bookingDate || b.date}T00:00:00`).getTime();

export function comparePeriods(bookings, range, now = new Date()) {
  const w = getWindows(range, now);
  if (!w) return { current: bookings, previous: [] };

  return {
    current: bookings.filter((b) => {
      const t = bookingTime(b);
      return t >= w.curFrom && t <= w.curTo;
    }),
    previous: bookings.filter((b) => {
      const t = bookingTime(b);
      return t >= w.prevFrom && t <= w.prevTo;
    }),
  };
}

// Registered users use a timestamp as their id, so their join date can be read from it
export function countUsersInRange(users, range, now = new Date()) {
  const w = getWindows(range, now);
  if (!w) return { current: users.length, previous: 0 };

  const countBetween = (from, to) =>
    users.filter((u) => {
      const t = Number(u.id);
      return t >= from && t <= to;
    }).length;

  return {
    current: countBetween(w.curFrom, w.curTo),
    previous: countBetween(w.prevFrom, w.prevTo),
  };
}

// Percentage change. Returns 100 when there was nothing before and something now.
export function growth(current, previous) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function fmtChange(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}