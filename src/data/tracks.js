/**
 * Sample library. Replace `src` with real audio file paths (drop files in
 * /public/audio/) or point it at a streaming API later — the player only
 * cares that `src` resolves to something an <audio> tag can play.
 *
 * To add a track: add an object here (or fetch this shape from an API).
 * Nothing else in the app needs to change.
 */
export const tracks = [
  {
    id: 't1',
    title: 'Amber Static',
    artist: 'Late Fern',
    album: 'Room Tone',
    duration: 214,
    src: '/audio/sample-1.mp3',
    art: '/art/room-tone.svg',
  },
  {
    id: 't2',
    title: 'Low Tide Radio',
    artist: 'Coastal Drift',
    album: 'Harbor Lights',
    duration: 187,
    src: '/audio/sample-2.mp3',
    art: '/art/harbor-lights.svg',
  },
  {
    id: 't3',
    title: 'Spindle & Thread',
    artist: 'Late Fern',
    album: 'Room Tone',
    duration: 251,
    src: '/audio/sample-3.mp3',
    art: '/art/room-tone.svg',
  },
  {
    id: 't4',
    title: 'Copper Wire Hum',
    artist: 'Nine Volt Choir',
    album: 'Signal Path',
    duration: 198,
    src: '/audio/sample-4.mp3',
    art: '/art/signal-path.svg',
  },
  {
    id: 't5',
    title: 'Quiet Hours',
    artist: 'Coastal Drift',
    album: 'Harbor Lights',
    duration: 233,
    src: '/audio/sample-5.mp3',
    art: '/art/harbor-lights.svg',
  },
];

export const defaultPlaylists = [
  { id: 'p-all', name: 'All Tracks', trackIds: tracks.map((t) => t.id), isSystem: true },
  { id: 'p-late-fern', name: 'Late Fern, mostly', trackIds: ['t1', 't3'], isSystem: false },
];
