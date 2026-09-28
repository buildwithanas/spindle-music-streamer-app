import { create } from 'zustand';
import { storage, KEYS } from '../services/storage.js';
import { defaultPlaylists } from '../data/tracks.js';

const persistPlaylists = (playlists) => storage.set(KEYS.PLAYLISTS, playlists);

const makeId = () => `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const usePlaylistStore = create((set, get) => ({
  playlists: defaultPlaylists,
  activePlaylistId: 'p-all',
  hydrated: false,

  async hydrate() {
    const saved = await storage.get(KEYS.PLAYLISTS);
    set({
      playlists: saved && saved.length ? saved : defaultPlaylists,
      hydrated: true,
    });
  },

  setActivePlaylist(id) {
    set({ activePlaylistId: id });
  },

  createPlaylist(name) {
    const playlist = { id: makeId(), name: name.trim() || 'Untitled playlist', trackIds: [], isSystem: false };
    set((s) => ({ playlists: [...s.playlists, playlist] }));
    persistPlaylists(get().playlists);
    return playlist.id;
  },

  deletePlaylist(id) {
    set((s) => ({
      playlists: s.playlists.filter((p) => p.id !== id || p.isSystem),
      activePlaylistId: s.activePlaylistId === id ? 'p-all' : s.activePlaylistId,
    }));
    persistPlaylists(get().playlists);
  },

  addTrackToPlaylist(playlistId, trackId) {
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId] }
          : p
      ),
    }));
    persistPlaylists(get().playlists);
  },

  removeTrackFromPlaylist(playlistId, trackId) {
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
      ),
    }));
    persistPlaylists(get().playlists);
  },
}));
