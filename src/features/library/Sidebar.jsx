import { useState } from 'react';
import { usePlaylistStore } from '../../store/usePlaylistStore.js';
import { IconButton } from '../../components/IconButton.jsx';

export function Sidebar() {
  const playlists = usePlaylistStore((s) => s.playlists);
  const activePlaylistId = usePlaylistStore((s) => s.activePlaylistId);
  const setActivePlaylist = usePlaylistStore((s) => s.setActivePlaylist);
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist);
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const submitNew = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const id = createPlaylist(name);
      setActivePlaylist(id);
    }
    setName('');
    setCreating(false);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark" aria-hidden="true" />
        <span className="sidebar__brand-name">Spindle</span>
      </div>

      <div className="sidebar__section-head">
        <span>Playlists</span>
        <IconButton icon="plus" label="New playlist" size={16} onClick={() => setCreating(true)} />
      </div>

      {creating && (
        <form className="sidebar__new-form" onSubmit={submitNew}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => !name && setCreating(false)}
            placeholder="Playlist name"
          />
        </form>
      )}

      <ul className="sidebar__list">
        {playlists.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={`sidebar__item ${p.id === activePlaylistId ? 'sidebar__item--active' : ''}`}
              onClick={() => setActivePlaylist(p.id)}
            >
              <span>{p.name}</span>
              <span className="sidebar__item-count">{p.trackIds.length}</span>
            </button>
            {!p.isSystem && (
              <button
                type="button"
                className="sidebar__item-remove"
                aria-label={`Delete ${p.name}`}
                onClick={() => deletePlaylist(p.id)}
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
