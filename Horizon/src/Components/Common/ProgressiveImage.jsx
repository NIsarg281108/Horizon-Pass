import { useState, useEffect } from "react";
import { createPlaceholderImage } from "../../Utils/Helpers";

function ProgressiveImage({ src, alt, className, style, ...props }) {
  const fallbackSrc = createPlaceholderImage(alt || "Event", [
    "#6d5efb",
    "#3ecf8e",
  ]);
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const safeSrc = src || fallbackSrc;
    const img = new Image();

    img.onload = () => {
      setImageSrc(safeSrc);
      setImageLoaded(true);
      setImageError(false);
    };

    img.onerror = () => {
      setImageSrc(fallbackSrc);
      setImageLoaded(true);
      setImageError(true);
    };

    img.src = safeSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <div className="progressive-image-wrapper" style={style}>
      {!imageLoaded && (
        <div className="progressive-image-placeholder">
          <div className="placeholder-shimmer"></div>
        </div>
      )}
      <img
        src={imageSrc || fallbackSrc}
        alt={alt}
        className={`progressive-image ${imageLoaded ? "loaded" : ""} ${className || ""}`}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
          objectFit: "cover",
        }}
        onError={() => {
          setImageSrc(fallbackSrc);
          setImageLoaded(true);
          setImageError(true);
        }}
        {...props}
      />
      {imageError && <div className="sr-only">Image not available</div>}
    </div>
  );
}

export default ProgressiveImage;
