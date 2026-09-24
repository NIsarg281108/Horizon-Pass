export const createPlaceholderImage = (
  label,
  colors = ["#6d5efb", "#3ecf8e"],
) => {
  const safeLabel = label
    .replace(/&/g, "and")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="100%" stop-color="${colors[1]}" />
        </linearGradient>
      </defs>
      <rect width="800" height="520" fill="url(#g)" rx="28" />
      <circle cx="120" cy="110" r="70" fill="rgba(255,255,255,0.18)" />
      <circle cx="700" cy="420" r="120" fill="rgba(255,255,255,0.12)" />
      <path d="M0 420C150 380 180 300 300 330C430 360 470 430 610 386C700 356 740 330 800 320V520H0Z" fill="rgba(255,255,255,0.10)" />
      <text x="50%" y="52%" font-size="52" font-family="Arial, sans-serif" font-weight="700" fill="white" text-anchor="middle">${safeLabel}</text>
      <text x="50%" y="63%" font-size="24" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.8)" text-anchor="middle">Horizon Pass</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
