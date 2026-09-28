import { useEffect } from 'react';
import { usePlayerStore } from './store/usePlayerStore.js';
import { usePlaylistStore } from './store/usePlaylistStore.js';
import { useAudioEngine } from './hooks/useAudioEngine.js';

import { Sidebar } from './features/library/Sidebar.jsx';
import { TrackList } from './features/library/TrackList.jsx';
import { NowPlaying } from './features/nowplaying/NowPlaying.jsx';
import { QueueList } from './features/queue/QueueList.jsx';
import { PlayerBar } from './features/player/PlayerBar.jsx';

import './features/library/library.css';
import './features/nowplaying/nowplaying.css';
import './features/queue/queue.css';
import './features/player/player.css';

export default function App() {
  const hydrate = usePlayerStore((s) => s.hydrate);
  const hydrated = usePlayerStore((s) => s.hydrated);
  const hydratePlaylists = usePlaylistStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    hydratePlaylists();
  }, [hydrate, hydratePlaylists]);

  const { track, currentTime, duration, seekTo } = useAudioEngine();

  if (!hydrated) return null; // avoid a flash of the wrong volume/track before storage loads

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-view">
        <NowPlaying track={track} />
        <TrackList />
      </main>
      <QueueList />
      <PlayerBar track={track} currentTime={currentTime} duration={duration} seekTo={seekTo} />
    </div>
  );
}
