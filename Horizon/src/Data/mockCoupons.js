// Demo coupon codes. Add or change codes here.
export const mockCoupons = [
  {
    code: "HORIZON10",
    type: "percent",
    value: 10,
    minTickets: 1,
    description: "10% off your order",
  },
  {
    code: "SAVE5",
    type: "flat",
    value: 5,
    minTickets: 1,
    description: "$5 off your order",
  },
  {
    code: "GROUP20",
    type: "percent",
    value: 20,
    minTickets: 4,
    description: "20% off for 4 or more tickets",
  },
];

export function findCoupon(code) {
  const normalised = code.trim().toUpperCase();
  return mockCoupons.find((coupon) => coupon.code === normalised) || null;
}

export function calculateDiscount(coupon, subtotal, quantity) {
  if (!coupon || quantity < coupon.minTickets) return 0;

  const raw =
    coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;

  return Math.min(raw, subtotal);
}