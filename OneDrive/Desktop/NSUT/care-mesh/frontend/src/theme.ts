/**
 * SoulCare design tokens — single source of truth for TS consumers.
 */
export const theme = {
  brand: 'SoulCare',
  tagline: 'A calmer place to talk, connect, and find support.',
  colors: {
    background: '#FCF9F8',
    surfaceLowest: '#FFFFFF',
    surfaceLow: '#F6F3F2',
    surface: '#F0EDED',
    surfaceHigh: '#EAE7E7',
    surfaceHighest: '#E4E2E1',
    primary: '#45614E',
    primaryContainer: '#5D7A66',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#EEFFF0',
    primaryFixed: '#CAEAD2',
    primaryFixedDim: '#AFCEB7',
    secondary: '#625E55',
    secondaryContainer: '#E8E2D6',
    tertiary: '#4E5F49',
    tertiaryContainer: '#667860',
    text: '#1B1C1C',
    textMuted: '#424843',
    outline: '#727973',
    outlineVariant: '#C2C8C1',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
  },
  fontFamily: {
    display: ['Outfit', 'Inter', 'ui-sans-serif', 'sans-serif'],
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  radii: {
    button: 16,
    input: 16,
    card: 24,
    large: 32,
    modal: 32,
  },
  shadows: {
    soft: '0 10px 30px rgba(69, 97, 78, 0.08)',
    card: '0 8px 24px rgba(69, 97, 78, 0.1)',
    lift: '0 14px 36px rgba(69, 97, 78, 0.12)',
  },
  motion: {
    duration: { fast: 200, base: 300, slow: 450 },
    ease: [0.4, 0, 0.2, 1] as const,
  },
  layout: {
    maxWidth: 1240,
    padDesktop: 40,
    padMobile: 20,
    sectionDesktop: 80,
    sectionMobile: 48,
    cardGap: 24,
  },
} as const;

export type Theme = typeof theme;
