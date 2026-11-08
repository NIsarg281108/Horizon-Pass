// Photos for each event, keyed by event id.
// Each entry: a main image and a set of gallery thumbnails.
// Replace any URL with your own image (for example "/images/batman.jpg"
// after placing the file in the public folder).
const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=800&fit=crop`;

const CATEGORY_GALLERY = {
  Movies: [
    img("1489599849927-2ee91cede3ba"),
    img("1536440136628-849c177e76a1"),
    img("1517457373958-b7bdd4587205"),
    img("1485846234645-a62644f84728"),
  ],
  Plays: [
    img("1503095396549-807759245b35"),
    img("1507924538820-ede94a04019d"),
    img("1514306191717-452ec28c7814"),
    img("1507676184212-d03ab07a01bf"),
  ],
  Shows: [
    img("1459749411175-04bf5292ceea"),
    img("1470229722913-7c0e2dbbafd3"),
    img("1493225457124-a3eb161ffa5f"),
    img("1501281668745-f7f57925c3b4"),
  ],
  Activities: [
    img("1508739773434-c26b3d09e071"),
    img("1502680390469-be75c86b636f"),
    img("1530482817226-0b9b87ec6b49"),
    img("1500530855697-b586d89ba3ee"),
  ],
  "Resorts & Hotels": [
    img("1566073771259-6a8506099945"),
    img("1582719478250-c89cae4dc85b"),
    img("1520250497591-112f2f40a3f4"),
    img("1551882547-ff40c63fe5fa"),
  ],
};

// Per-event overrides, if you want a specific photo for one event
const EVENT_OVERRIDES = {
  // "1": { main: img("1489599849927-2ee91cede3ba"), gallery: [...] },
};

export function getEventImages(event) {
  const override = EVENT_OVERRIDES[event.id];
  const gallery = override?.gallery || CATEGORY_GALLERY[event.category] || CATEGORY_GALLERY.Movies;
  return {
    main: override?.main || gallery[0],
    gallery,
  };
}