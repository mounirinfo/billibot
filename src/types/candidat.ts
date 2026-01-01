// Type pour un module du dashboard
export interface Module {
  icon: any; // MUI Icon Component
  title: string;
  description: string;
  color: string;
  gradient: string;
  link: string;
}

// Type pour une option de quiz
export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
}

// Type pour une question de quiz
export interface QuizQuestion {
  title: string;
  options: QuizOption[];
}

// Type pour les réponses du quiz
export interface QuizAnswers {
  step1: string[];
  step2: string[];
  step3: string[];
}

// Type pour une formation
export interface Formation {
  name: string;
  fullName: string;
  emoji: string;
  description: string;
  profiles: string[];
  color: string;
}

// Type pour une étape de parcours
export interface ParcoursStep {
  icon: any;
  title: string;
  date: string;
  description: string;
  details: string[];
}

// Type pour une question d'entretien
export interface EntretienQuestion {
  question: string;
  conseils: string[];
  exemple: string;
  aEviter: string[];
}

// Type pour un salon/événement
export interface Salon {
  name: string;
  date: string;
  lieu: string;
  description: string;
  color: string;
}

// Type pour le formulaire de contact
export interface ContactForm {
  prenom: string;
  nom: string;
  email: string;
  date: string;
  message: string;
}