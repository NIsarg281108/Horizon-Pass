import { Link } from "react-router";
import { useAuth } from "../../Context/AuthContext";

const YEAR = new Date().getFullYear();

function Footer() {
  const { user } = useAuth();

  const explore = [
    { label: "Movies", to: "/movies" },
    { label: "Plays", to: "/plays" },
    { label: "Shows", to: "/shows" },
    { label: "Activities", to: "/activities" },
    { label: "Resorts", to: "/resorts" },
  ];

  const account = user
    ? [
        { label: "My profile", to: "/profile" },
        { label: "My wishlist", to: "/wishlist" },
        { label: "My bookings", to: "/profile" },
      ]
    : [
        { label: "Log in", to: "/login" },
        { label: "Create account", to: "/register" },
      ];

  const help = [
    { label: "Search events", to: "/search" },
    { label: "Booking help", to: "/profile" },
    { label: "Contact us", href: "mailto:support@horizonpass.example" },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brand-icon">🎭</span>
              <span className="footer-logo-text">Horizon – Pass</span>
            </div>
            <p className="footer-tagline">
              <span className="footer-tagline-main">Book the show.</span>
              <span className="footer-tagline-sub">
                Stay the night. <em>Chase the Horizon.</em>
              </span>
            </p>
          </div>

          <FooterColumn title="Explore" links={explore} />
          <FooterColumn title="Account" links={account} />
          <FooterColumn title="Help" links={help} />
        </div>

        <div className="footer-bottom">
          <span>© {YEAR} Horizon – Pass. All rights reserved.</span>
          <span className="footer-legal">
            <Link to="/">Privacy</Link>
            <Link to="/">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="footer-col">
      <h6>{title}</h6>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a href={link.href}>{link.label}</a>
            ) : (
              <Link to={link.to}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;