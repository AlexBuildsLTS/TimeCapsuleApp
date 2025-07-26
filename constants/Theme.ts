export const Theme = {
  colors: {
    // Primary dark theme colors
    background: '#0A0A0F',
    surface: '#1A1A2E',
    surfaceVariant: '#2A2A3E',
    
    // Accent and interactive colors
    primary: '#00D9FF', // Bright cyan
    primaryVariant: '#0099CC',
    secondary: '#6C5CE7',
    
    // Text colors
    onBackground: '#FFFFFF',
    onSurface: '#E5E5E5',
    onSurfaceVariant: '#B8B8B8',
    
    // Status colors
    success: '#00E676',
    warning: '#FFB300',
    error: '#FF5252',
    
    // Gradients
    cosmicGradient: ['#0A0A0F', '#1A1A2E', '#2A2A3E'],
    accentGradient: ['#00D9FF', '#6C5CE7'],
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 38.4,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 28.8,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 21,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};