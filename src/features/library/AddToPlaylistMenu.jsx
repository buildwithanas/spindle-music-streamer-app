import { useState, useRef, useEffect } from 'react';
import { usePlaylistStore } from '../../store/usePlaylistStore.js';
import { IconButton } from '../../components/IconButton.jsx';

export function AddToPlaylistMenu({ trackId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const playlists = usePlaylistStore((s) => s.playlists.filter((p) => !p.isSystem));
  const addTrackToPlaylist = usePlaylistStore((s) => s.addTrackToPlaylist);
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="add-to-playlist" ref={ref}>
      <IconButton icon="plus" label="Add to playlist" size={14} onClick={() => setOpen((v) => !v)} />
      {open && (
        <div className="add-to-playlist__menu">
          {playlists.length === 0 && <p className="add-to-playlist__empty">No playlists yet</p>}
          {playlists.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                addTrackToPlaylist(p.id, trackId);
                setOpen(false);
              }}
            >
              {p.name}
            </button>
          ))}
          <button
            type="button"
            className="add-to-playlist__new"
            onClick={() => {
              const id = createPlaylist('New playlist');
              addTrackToPlaylist(id, trackId);
              setOpen(false);
            }}
          >
            + New playlist
          </button>
        </div>
      )}
    </div>
  );
}
