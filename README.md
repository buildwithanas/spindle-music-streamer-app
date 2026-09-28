# Spindle — music streaming UI

React + Vite music player with custom transport controls, playlists, and
progress persistence (per-track resume position, volume, shuffle/repeat —
all saved to localStorage right now).

## Run it

```bash
npm install
npm run dev
```

Then drop real audio files into `public/audio/` (see the README.txt in
that folder) or point `src/data/tracks.js` at hosted URLs / an API.

## How it's structured

```
src/
  data/tracks.js          sample library + default playlists
  services/storage.js     persistence layer — see below
  store/
    usePlayerStore.js     current track, transport state, queue, progress
    usePlaylistStore.js   playlists (create/delete/add/remove track)
  hooks/useAudioEngine.js the single <audio> element, wired to the store
  components/             generic UI atoms (Icon, IconButton, Slider)
  features/
    player/                transport bar + waveform scrubber
    library/                sidebar (playlists) + track list + "add to playlist"
    queue/                  up-next panel
    nowplaying/             hero showing the current track
```

## Adding a feature later

A few things were set up specifically so new features don't require
touching existing code:

- **Swap storage for a real backend**: everything is written and read
  through `src/services/storage.js`. To move from localStorage to your
  own Node/Express/MySQL API, write one new driver object with
  `get(key)` / `set(key, value)` / `remove(key)` methods in that file
  and export it instead — the stores and components don't change.

- **New persisted state**: add a key to `KEYS` in `storage.js`, then
  read/write it from whichever store owns that concern. Don't reach
  into `localStorage` directly from a component.

- **New playback feature** (e.g. crossfade, gapless playback, a mini
  player): lives in `hooks/useAudioEngine.js` alongside the existing
  `<audio>` wiring — it's the one place that touches the media element.

- **New library feature** (e.g. search, sort, tags, "liked" tracks):
  add it under `features/library/`. Playlists already follow a
  create/add/remove pattern in `usePlaylistStore.js` — a "liked
  tracks" feature is really just another playlist-shaped store.

- **New icons**: add a path to the `paths` map in
  `components/Icon.jsx` rather than pulling in an icon library.

- **Video support later**: the audio engine, scrubber, and transport
  bar are decoupled from "audio" specifically by working in seconds of
  playback, not by any audio-only API — swapping `useAudioEngine`'s
  `new Audio()` for a `<video>` ref and rendering the video element
  somewhere in the main view is the shape of that change.
