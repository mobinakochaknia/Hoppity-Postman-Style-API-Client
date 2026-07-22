import { useTheme } from '@/hooks/useTheme';
import { MoonIcon, SunIcon } from '@/components/UI/Icons';

/** A button that toggles between light and dark themes. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
