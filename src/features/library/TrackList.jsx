import { tracks } from '../../data/tracks.js';
import { usePlayerStore } from '../../store/usePlayerStore.js';
import { usePlaylistStore } from '../../store/usePlaylistStore.js';
import { IconButton } from '../../components/IconButton.jsx';
import { AddToPlaylistMenu } from './AddToPlaylistMenu.jsx';

function formatTime(sec = 0) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TrackList() {
  const playlists = usePlaylistStore((s) => s.playlists);
  const activePlaylistId = usePlaylistStore((s) => s.activePlaylistId);
  const removeTrackFromPlaylist = usePlaylistStore((s) => s.removeTrackFromPlaylist);

  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const setQueue = usePlayerStore((s) => s.setQueue);

  const playlist = playlists.find((p) => p.id === activePlaylistId);
  const list = playlist ? playlist.trackIds.map((id) => tracks.find((t) => t.id === id)).filter(Boolean) : [];

  const handlePlay = (trackId) => {
    if (trackId === currentTrackId) {
      togglePlay();
    } else {
      setQueue(list.map((t) => t.id));
      playTrack(trackId);
    }
  };

  return (
    <section className="track-list">
      <header className="track-list__head">
        <h2>{playlist?.name ?? 'Library'}</h2>
        <p>{list.length} track{list.length === 1 ? '' : 's'}</p>
      </header>

      {list.length === 0 ? (
        <div className="track-list__empty">
          No tracks here yet. Add tracks to this playlist from “All Tracks”.
        </div>
      ) : (
        <ol className="track-list__rows">
          {list.map((track, i) => {
            const isCurrent = track.id === currentTrackId;
            return (
              <li key={track.id} className={`track-row ${isCurrent ? 'track-row--active' : ''}`}>
                <button className="track-row__play" onClick={() => handlePlay(track.id)} aria-label="Play">
                  <span className="track-row__index">{i + 1}</span>
                  <svg className="track-row__icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    {isCurrent && isPlaying ? (
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    ) : (
                      <path d="M5 3.5v17l15-8.5z" />
                    )}
                  </svg>
                </button>
                <div className="track-row__title">
                  <span className="track-row__name">{track.title}</span>
                  <span className="track-row__artist">{track.artist}</span>
                </div>
                <span className="track-row__album">{track.album}</span>
                <span className="track-row__duration">{formatTime(track.duration)}</span>
                {playlist.isSystem ? (
                  <AddToPlaylistMenu trackId={track.id} />
                ) : (
                  <IconButton
                    icon="close"
                    label={`Remove ${track.title}`}
                    size={14}
                    onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
