import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore.js';
import { tracks } from '../data/tracks.js';

/**
 * Owns the single <audio> element for the whole app and keeps it in sync
 * with usePlayerStore. Mount this once near the root (see App.jsx) and
 * read `currentTime` / `duration` from its return value wherever a
 * scrubber or time display needs them.
 */
export function useAudioEngine() {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const progressByTrack = usePlayerStore((s) => s.progressByTrack);
  const setLiveProgress = usePlayerStore((s) => s.setLiveProgress);
  const commitProgress = usePlayerStore((s) => s.commitProgress);
  const playNext = usePlayerStore((s) => s.playNext);
  const hydrated = usePlayerStore((s) => s.hydrated);

  const track = tracks.find((t) => t.id === currentTrackId) || null;

  // Create the audio element once.
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Swap source when the track changes; resume from saved progress.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track || !hydrated) return;
    audio.src = track.src;
    const resumeAt = progressByTrack[track.id] || 0;
    audio.currentTime = resumeAt;
    setCurrentTime(resumeAt);
    setDuration(track.duration || 0);
    if (isPlaying) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id, hydrated]);

  // Play/pause when isPlaying toggles.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      commitProgress();
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Volume sync.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Time updates -> live progress in store (persisted less often, see below).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (track) setLiveProgress(track.id, audio.currentTime);
    };
    const onLoadedMetadata = () => setDuration(audio.duration || track?.duration || 0);
    const onEnded = () => {
      if (track) setLiveProgress(track.id, 0);
      commitProgress();
      playNext();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [track?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist progress every 5s while playing, and on unload.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(commitProgress, 5000);
    return () => clearInterval(id);
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onUnload = () => commitProgress();
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const seekTo = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
    if (track) setLiveProgress(track.id, seconds);
    commitProgress();
  };

  return { track, currentTime, duration, seekTo };
}
