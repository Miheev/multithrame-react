import { ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';

export const appTheme: ThemeType = deepMerge({
  global: {
    font: {
      family: 'Roboto',
      size: '0.875rem',
      height: 'normal',
    },
    colors: {
      brand: 'var(--color-brand)',
      white: 'var(--color-white)',
      'status-error': 'var(--color-status-error)',
      'status-warning': 'var(--color-status-warning)',
      text: {
        // light: 'white',
      },
    },
    drop: {
      zIndex: '1000',
    },
    edgeSize: {
      xsmall: 'var(--offset-tiny)',
      small: 'var(--offset-small)',
      medium: 'var(--offset-middle)',
    },
  },
});

// console.log(base)
