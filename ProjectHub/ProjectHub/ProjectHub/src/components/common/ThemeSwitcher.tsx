import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { WeatherMoon20Regular, WeatherSunny20Regular } from '@fluentui/react-icons';
import { useTheme } from '../../contexts/useTheme';

const useStyles = makeStyles({
  themeSwitcher: {
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForegroundOnBrand,
    minWidth: 'unset',
    width: '32px',
    height: '32px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

export const ThemeSwitcher: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();
  const styles = useStyles();
  
  return (
    <Button
      className={styles.themeSwitcher}
      appearance="subtle"
      onClick={toggleTheme}
      icon={themeMode === 'light' ? <WeatherMoon20Regular /> : <WeatherSunny20Regular />}
      aria-label={themeMode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      title={themeMode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    />
  );
};
