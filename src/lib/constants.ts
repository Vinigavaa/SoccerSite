// Constantes para padronização de design do SELECAIXA
export const THEME = {
  // Cores principais
  colors: {
    purple: {
      darkest: '#4B0082', // Indigo (bordo-dark)
      dark: '#6A0DAD',    // Roxo escuro (bordo)
      medium: '#8A2BE2',  // Roxo médio (não usado ainda)
      light: '#9370DB',   // Roxo claro (adicionado)
      lightest: '#E6E6FA', // Lavanda (gold-light)
    },
    white: '#FFFFFF',      // Branco principal
    neutral: {
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    }
  },
  
  // Espaçamentos consistentes
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Transições
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  // Bordas arredondadas
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem',  // 8px
    lg: '1rem',    // 16px
    xl: '1.5rem',  // 24px
    full: '9999px',
  }
};

// Breakpoints para responsividade
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Constantes para animações
export const ANIMATIONS = {
  fadeIn: 'fade-in 0.5s ease-out forwards',
  float: 'float 3s ease-in-out infinite',
  pulse: 'pulse 2s ease-in-out infinite',
  slideUp: 'slide-up 0.5s ease-out forwards',
  slideDown: 'slide-down 0.5s ease-out forwards',
};

// Constantes para layout
export const LAYOUT = {
  maxWidth: '1400px',
  sectionPadding: '4rem 1rem',
}; 