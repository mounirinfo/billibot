/**
 * Formater un temps en secondes vers format MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculer le pourcentage de progression
 */
export function calculateProgress(current: number, total: number): number {
  return Math.round((current / total) * 100);
}

/**
 * Obtenir une couleur en fonction d'un pourcentage
 */
export function getColorByPercentage(percentage: number): string {
  if (percentage >= 75) return '#2D9B94'; // Vert
  if (percentage >= 50) return '#FFD93D'; // Jaune
  if (percentage >= 25) return '#FF9800'; // Orange
  return '#FF6B9D'; // Rose
}

/**
 * Valider un email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Formater une date au format français
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Générer un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Délai asynchrone (pour simulations)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mélanger un tableau (shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sauvegarder dans le localStorage
 */
export function saveToLocalStorage(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

/**
 * Récupérer du localStorage
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }
  return defaultValue;
}

/**
 * Supprimer du localStorage
 */
export function removeFromLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}