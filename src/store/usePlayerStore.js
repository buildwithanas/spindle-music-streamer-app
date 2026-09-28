import { create } from 'zustand';
import { storage, KEYS } from '../services/storage.js';
import { tracks } from '../data/tracks.js';

const persistPrefs = (state) => {
  storage.set(KEYS.PLAYER_PREFS, {
    volume: state.volume,
    shuffle: state.shuffle,
    repeat: state.repeat,
    lastTrackId: state.currentTrackId,
  });
};

const persistProgress = (progressByTrack) => {
  storage.set(KEYS.TRACK_PROGRESS, progressByTrack);
};

export const usePlayerStore = create((set, get) => ({
  // --- state ---
  currentTrackId: null,
  isPlaying: false,
  volume: 0.8,
  shuffle: false,
  repeat: 'off', // 'off' | 'all' | 'one'
  queue: tracks.map((t) => t.id), // ordered list of track ids
  progressByTrack: {}, // { [trackId]: seconds }
  hydrated: false,

  // --- derived helpers ---
  currentTrack: () => tracks.find((t) => t.id === get().currentTrackId) || null,

  // --- actions ---
  async hydrate() {
    const [prefs, progress] = await Promise.all([
      storage.get(KEYS.PLAYER_PREFS),
      storage.get(KEYS.TRACK_PROGRESS),
    ]);
    set({
      volume: prefs?.volume ?? 0.8,
      shuffle: prefs?.shuffle ?? false,
      repeat: prefs?.repeat ?? 'off',
      currentTrackId: prefs?.lastTrackId ?? null,
      progressByTrack: progress ?? {},
      hydrated: true,
    });
  },

  playTrack(trackId) {
    set({ currentTrackId: trackId, isPlaying: true });
    persistPrefs(get());
  },

  togglePlay() {
    set((s) => ({ isPlaying: !s.isPlaying }));
  },

  pause() {
    set({ isPlaying: false });
  },

  setQueue(trackIds) {
    set({ queue: trackIds });
  },

  playNext() {
    const { queue, currentTrackId, shuffle, repeat } = get();
    if (queue.length === 0) return;
    if (repeat === 'one') {
      set({ isPlaying: true });
      return;
    }
    const idx = queue.indexOf(currentTrackId);
    let nextIdx;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = idx + 1;
      if (nextIdx >= queue.length) {
        if (repeat === 'all') nextIdx = 0;
        else {
          set({ isPlaying: false });
          return;
        }
      }
    }
    set({ currentTrackId: queue[nextIdx], isPlaying: true });
    persistPrefs(get());
  },

  playPrev() {
    const { queue, currentTrackId } = get();
    const idx = queue.indexOf(currentTrackId);
    const prevIdx = idx <= 0 ? 0 : idx - 1;
    set({ currentTrackId: queue[prevIdx], isPlaying: true });
    persistPrefs(get());
  },

  setVolume(volume) {
    set({ volume });
    persistPrefs(get());
  },

  toggleShuffle() {
    set((s) => ({ shuffle: !s.shuffle }));
    persistPrefs(get());
  },

  cycleRepeat() {
    const order = ['off', 'all', 'one'];
    set((s) => ({ repeat: order[(order.indexOf(s.repeat) + 1) % order.length] }));
    persistPrefs(get());
  },

  // Called frequently (timeupdate) — cheap in-memory update.
  setLiveProgress(trackId, seconds) {
    set((s) => ({ progressByTrack: { ...s.progressByTrack, [trackId]: seconds } }));
  },

  // Called occasionally (pause, seek-end, unload) — writes to storage.
  commitProgress() {
    persistProgress(get().progressByTrack);
  },
}));
