// Minimal hand-rolled icon set — keeps the transport bar dependency-free.
// Add new icons here as the app grows (e.g. 'heart', 'download').
const paths = {
  play: 'M5 3.5v17l15-8.5z',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
  next: 'M5 4l11 8-11 8V4zM18 4h2v16h-2z',
  prev: 'M19 4L8 12l11 8V4zM6 4H4v16h2z',
  shuffle: 'M17 3l4 4-4 4M3 7h5l3 4M21 17l-4 4-4-4M3 17h5l8-11h5',
  repeat: 'M7 7h10a3 3 0 013 3v1M17 17H7a3 3 0 01-3-3v-1M9 5L7 7l2 2M15 19l2-2-2-2',
  'repeat-one': 'M7 7h10a3 3 0 013 3v1M17 17H7a3 3 0 01-3-3v-1M9 5L7 7l2 2M15 19l2-2-2-2M12 9v4',
  volume: 'M4 9v6h4l5 4V5L8 9H4z',
  'volume-mute': 'M4 9v6h4l5 4V5L8 9H4zM16 9l4 6M20 9l-4 6',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  queue: 'M4 6h12M4 12h12M4 18h8M18 15l3 3-3 3',
};

export function Icon({ name, size = 18, ...props }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={d} fill={name === 'play' || name === 'pause' ? 'currentColor' : 'none'} />
    </svg>
  );
}
