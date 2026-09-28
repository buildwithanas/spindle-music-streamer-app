import { tracks } from '../../data/tracks.js';
import { usePlayerStore } from '../../store/usePlayerStore.js';

export function QueueList() {
  const queue = usePlayerStore((s) => s.queue);
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const currentIdx = queue.indexOf(currentTrackId);
  const upcoming = queue.slice(currentIdx + 1).map((id) => tracks.find((t) => t.id === id)).filter(Boolean);

  return (
    <aside className="queue-panel">
      <h2 className="queue-panel__head">Up next</h2>
      {upcoming.length === 0 ? (
        <p className="queue-panel__empty">Queue is empty — end of playlist.</p>
      ) : (
        <ul className="queue-panel__list">
          {upcoming.map((track) => (
            <li key={track.id}>
              <button type="button" onClick={() => playTrack(track.id)}>
                <img src={track.art} alt="" />
                <span>
                  <span className="queue-panel__title">{track.title}</span>
                  <span className="queue-panel__artist">{track.artist}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
