import { createConfig } from '@gluestack-ui/themed';

export const config = createConfig({
  aliases: {
    bg: 'backgroundColor',
    rounded: 'borderRadius',
  },
  tokens: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
    },
    space: {
      '0': 0,
      '1': 4,
      '2': 8,
      '3': 12,
      '4': 16,
      '5': 20,
      '6': 24,
      '8': 32,
      '10': 40,
      '12': 48,
      '16': 64,
      '20': 80,
      '24': 96,
    },
    fontSizes: {
      '2xs': 10,
      'xs': 12,
      'sm': 14,
      'md': 16,
      'lg': 18,
      'xl': 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
      '7xl': 72,
      '8xl': 96,
      '9xl': 128,
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    fontFamilies: {
      kenney: 'Kenney-Future',
    },
    radii: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      '2xl': 16,
      '3xl': 24,
      full: 9999,
    },
  },
  globalStyle: {
    variants: {
      hardShadow: {
        '1': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 1,
        },
        '2': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 2,
        },
        '3': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 3,
        },
        '4': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 4,
        },
        '5': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 5,
        },
      },
      softShadow: {
        '1': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        '2': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        '3': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        },
        '4': {
          shadowColor: '$backgroundLight800',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,
          elevation: 12,
        },
      },
    },
  },
});

type Config = typeof config;

declare module '@gluestack-ui/themed' {
  interface ICustomConfig extends Config {}
}
