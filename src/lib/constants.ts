// Couleurs du thème
export const COLORS = {
  primary: '#2D9B94',
  secondary: '#FFD93D',
  tertiary: '#4A90E2',
  accent: '#FF6B9D',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #2D9B94 0%, #1F7A72 100%)',
    secondary: 'linear-gradient(135deg, #FFD93D 0%, #FFC107 100%)',
    tertiary: 'linear-gradient(135deg, #4A90E2 0%, #2196F3 100%)',
    accent: 'linear-gradient(135deg, #FF6B9D 0%, #E91E63 100%)',
  }
} as const;

// Routes de l'application
export const ROUTES = {
  home: '/candidat',
  orientation: '/candidat/orientation',
  admission: '/candidat/admission',
  entretien: '/candidat/entretien',
  contact: '/candidat/contact',
} as const;

// Durées d'animation (en ms)
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Breakpoints responsive
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

// Contact information
export const CONTACT_INFO = {
  email: 'o.bouche@billieres.com',
  emailGeneral: 'admissions@billieres.com',
  phone: '+33 5 XX XX XX XX',
  address: '123 Avenue de Billières, 31000 Toulouse',
  responsable: {
    nom: 'Olivia Bouche',
    titre: 'Responsable Admissions',
    email: 'o.bouche@billieres.com',
  }
} as const;