import { Icon } from './Icon.jsx';

export function IconButton({ icon, label, active = false, size = 18, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={`icon-btn ${active ? 'icon-btn--active' : ''} ${className}`}
      {...props}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}
