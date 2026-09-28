export function Slider({ value, min = 0, max = 1, step = 0.01, onChange, label }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      className="slider"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{ '--pct': `${pct}%` }}
    />
  );
}
