export function NowPlaying({ track }) {
  if (!track) {
    return (
      <div className="now-playing now-playing--empty">
        <p>Nothing playing. Choose a track below to get started.</p>
      </div>
    );
  }
  return (
    <div className="now-playing">
      <img src={track.art} alt="" className="now-playing__art" />
      <div className="now-playing__info">
        <p className="now-playing__eyebrow">Now playing</p>
        <h1 className="now-playing__title">{track.title}</h1>
        <p className="now-playing__artist">
          {track.artist} <span className="now-playing__dot">·</span> {track.album}
        </p>
      </div>
    </div>
  );
}
