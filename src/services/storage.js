/**
 * Persistence layer.
 *
 * Every read/write in the app goes through this file instead of touching
 * localStorage directly. That means swapping to a real backend later
 * (Node/Express/MySQL, a REST API, whatever) is a change in ONE place:
 * write a new driver below with the same three methods and export it
 * instead of `localStorageDriver`. Nothing in the stores or components
 * needs to change.
 *
 * Example future driver:
 *
 *   const apiDriver = {
 *     async get(key) {
 *       const res = await fetch(`/api/state/${key}`);
 *       return res.ok ? res.json() : null;
 *     },
 *     async set(key, value) {
 *       await fetch(`/api/state/${key}`, {
 *         method: 'PUT',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(value),
 *       });
 *     },
 *     async remove(key) {
 *       await fetch(`/api/state/${key}`, { method: 'DELETE' });
 *     },
 *   };
 *   export const storage = apiDriver;
 */

const PREFIX = 'spindle:';

const localStorageDriver = {
  async get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — fail silently, playback still works
    }
  },
  async remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* noop */
    }
  },
};

export const storage = localStorageDriver;

// Central place to name every key the app persists, so nothing collides
// and it's obvious at a glance what gets saved.
export const KEYS = {
  PLAYLISTS: 'playlists',
  QUEUE: 'queue',
  TRACK_PROGRESS: 'track-progress', // { [trackId]: seconds }
  PLAYER_PREFS: 'player-prefs', // { volume, shuffle, repeat, lastTrackId }
};
