import { useEffect, useMemo, useState } from "react";
import { createPlaceholderImage } from "../../Utils/Helpers";

function ProgressiveImage({ src, alt, className = "", style, ...props }) {
  const fallbackSrc = useMemo(
    () => createPlaceholderImage(alt || "Event", ["#6d5efb", "#3ecf8e"]),
    [alt],
  );

  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const target = src || fallbackSrc;
    const img = new Image();

    img.onload = () => {
      setImageSrc(target);
      setLoaded(true);
    };
    img.onerror = () => {
      setImageSrc(fallbackSrc);
      setLoaded(true);
    };
    img.src = target;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <div className="progressive-image-wrapper" style={style}>
      {!loaded && (
        <div className="progressive-image-placeholder" aria-hidden="true" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className={`progressive-image ${loaded ? "loaded" : ""} ${className}`}
        onError={() => setImageSrc(fallbackSrc)}
        {...props}
      />
    </div>
  );
}

export default ProgressiveImage;