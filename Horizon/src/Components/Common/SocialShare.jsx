import { useState } from 'react';

function SocialShare({ event, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `Check out ${event.title} at ${event.venue} on ${event.date}!`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="social-share-overlay" onClick={onClose}>
      <div className="social-share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <h3>Share this event</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="share-preview">
          <img src={event.imageUrl} alt={event.title} className="share-image" />
          <div className="share-info">
            <h4>{event.title}</h4>
            <p>{event.venue} • {event.date}</p>
          </div>
        </div>

        {navigator.share && (
          <button className="btn btn-native-share w-100 mb-3" onClick={handleNativeShare}>
            📱 Share via...
          </button>
        )}

        <div className="share-buttons">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn facebook"
            onClick={onClose}
          >
            <span className="share-icon">📘</span>
            <span>Facebook</span>
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn twitter"
            onClick={onClose}
          >
            <span className="share-icon">🐦</span>
            <span>Twitter</span>
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn linkedin"
            onClick={onClose}
          >
            <span className="share-icon">💼</span>
            <span>LinkedIn</span>
          </a>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn whatsapp"
            onClick={onClose}
          >
            <span className="share-icon">💬</span>
            <span>WhatsApp</span>
          </a>
          <a
            href={shareLinks.email}
            className="share-btn email"
            onClick={onClose}
          >
            <span className="share-icon">📧</span>
            <span>Email</span>
          </a>
        </div>

        <div className="copy-link-section">
          <div className="copy-link-input">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="form-control"
            />
            <button
              className={`btn btn-copy ${copied ? 'copied' : ''}`}
              onClick={handleCopyLink}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialShare;
