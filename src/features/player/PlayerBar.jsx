import { usePlayerStore } from '../../store/usePlayerStore.js';
import { IconButton } from '../../components/IconButton.jsx';
import { Slider } from '../../components/Slider.jsx';
import { Scrubber } from './Scrubber.jsx';

export function PlayerBar({ track, currentTime, duration, seekTo }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrev = usePlayerStore((s) => s.playPrev);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  return (
    <footer className="player-bar">
      <div className="player-bar__meta">
        {track ? (
          <>
            <img src={track.art} alt="" className="player-bar__art" />
            <div className="player-bar__text">
              <p className="player-bar__title">{track.title}</p>
              <p className="player-bar__artist">{track.artist}</p>
            </div>
          </>
        ) : (
          <p className="player-bar__empty">Nothing queued — pick a track from the library</p>
        )}
      </div>

      <div className="player-bar__center">
        <div className="transport-controls">
          <IconButton icon="shuffle" label="Shuffle" active={shuffle} onClick={toggleShuffle} />
          <IconButton icon="prev" label="Previous" size={20} onClick={playPrev} />
          <button
            type="button"
            className="transport-controls__play"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            disabled={!track}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {isPlaying ? (
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              ) : (
                <path d="M5 3.5v17l15-8.5z" />
              )}
            </svg>
          </button>
          <IconButton icon="next" label="Next" size={20} onClick={playNext} />
          <IconButton
            icon={repeat === 'one' ? 'repeat-one' : 'repeat'}
            label="Repeat"
            active={repeat !== 'off'}
            onClick={cycleRepeat}
          />
        </div>
        <Scrubber trackId={track?.id} currentTime={currentTime} duration={duration} onSeek={seekTo} />
      </div>

      <div className="player-bar__volume">
        <IconButton icon={volume === 0 ? 'volume-mute' : 'volume'} label="Volume" />
        <Slider value={volume} onChange={setVolume} label="Volume" />
      </div>
    </footer>
  );
}
