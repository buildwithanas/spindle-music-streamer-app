import { useMemo, useRef, useState } from 'react';

// Deterministic pseudo-waveform so the same track always renders the same
// bars (no audio analysis needed — swap this for real peak data later if
// you decode the file, e.g. with the Web Audio API).
function useWaveform(seed, bars = 64) {
  return useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const out = [];
    for (let i = 0; i < bars; i++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      out.push(0.25 + (h % 1000) / 1000 * 0.75);
    }
    return out;
  }, [seed, bars]);
}

function formatTime(sec = 0) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Scrubber({ trackId, currentTime, duration, onSeek }) {
  const bars = useWaveform(trackId || 'silence');
  const trackRef = useRef(null);
  const [dragRatio, setDragRatio] = useState(null); // 0..1 while dragging

  const ratio = dragRatio ?? (duration ? currentTime / duration : 0);

  const ratioFromEvent = (e) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return Math.min(1, Math.max(0, x / rect.width));
  };

  const handlePointerDown = (e) => {
    setDragRatio(ratioFromEvent(e));
    const handleMove = (ev) => setDragRatio(ratioFromEvent(ev));
    const handleUp = (ev) => {
      const r = ratioFromEvent(ev);
      onSeek(r * duration);
      setDragRatio(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <div className="scrubber">
      <span className="scrubber__time">{formatTime(currentTime)}</span>
      <div
        className="scrubber__track"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5));
          if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5));
        }}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="scrubber__bar"
            style={{
              height: `${h * 100}%`,
              background: i / bars.length <= ratio ? 'var(--amber)' : 'var(--line)',
            }}
          />
        ))}
      </div>
      <span className="scrubber__time">{formatTime(duration)}</span>
    </div>
  );
}
