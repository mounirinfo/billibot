'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  ArrowBack,
  PlayArrow,
  Stop,
  Refresh,
  Lightbulb,
  Warning,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const colors = {
  primary: '#2D9B94',
  secondary: '#FFD93D',
  primaryDark: '#1F7A72',
  pink: '#FF6B9D',
  blue: '#4A90E2'
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const questionsFrequentes = [
  {
    question: 'Pourquoi avez-vous choisi cette formation ?',
    conseils: ['Montre que tu connais la formation', 'Explique le lien avec ton projet', 'Cite des aspects concrets'],
    exemple: 'J\'ai choisi le BTS MCO car je suis passionné par le commerce et la relation client. Cette formation me permettra d\'acquérir les compétences pour ouvrir ma propre boutique.',
    aEviter: ['Réponses vagues', 'Ne pas connaître le contenu', 'Dire que c\'est un choix par défaut']
  },
  {
    question: 'Quels sont vos points forts ?',
    conseils: ['Choisis 2-3 qualités pertinentes', 'Appuie par des exemples concrets', 'Reste humble et authentique'],
    exemple: 'Je suis très organisé - j\'ai coordonné un événement de 200 personnes pour mon lycée. Je suis aussi à l\'aise à l\'oral.',
    aEviter: ['Lister 10 qualités sans exemples', 'Être trop arrogant', 'Qualités non pertinentes']
  },
  {
    question: 'Où vous voyez-vous dans 5 ans ?',
    conseils: ['Montre que tu as réfléchi', 'Reste réaliste et cohérent', 'Exprime ton ambition'],
    exemple: 'Dans 5 ans, j\'aimerais être responsable d\'un point de vente. À plus long terme, je souhaite créer ma propre entreprise.',
    aEviter: ['Réponses irréalistes', 'Ne pas avoir de projet', 'Projet déconnecté de la formation']
  },
  {
    question: 'Pourquoi devrions-nous vous sélectionner ?',
    conseils: ['Mets en avant ce qui te différencie', 'Montre ta motivation', 'Fais le lien avec tes atouts'],
    exemple: 'Ma double passion pour le commerce et le digital est un atout. J\'ai créé un compte Instagram de 5000 abonnés.',
    aEviter: ['Dire que tu es \"le meilleur\"', 'Critiquer les autres', 'Pas d\'arguments concrets']
  }
];

const questionsSurprise = [
  'Décrivez un échec et ce que vous en avez appris',
  'Comment gérez-vous le stress ?',
  'Parlez d\'une situation de leadership',
  'Comment vous organisez-vous ?',
  'Pourquoi notre école plutôt qu\'une autre ?',
  'Racontez un projet dont vous êtes fier'
];

const templates = {
  STAR: {
    name: 'Méthode STAR',
    steps: [
      { label: 'Situation', desc: 'Contexte de l’action', icon: '📍' },
      { label: 'Task', desc: 'Objectif ou problème', icon: '🎯' },
      { label: 'Action', desc: 'Ce que TU as fait', icon: '⚡' },
      { label: 'Result', desc: 'Résultat / Apprentissage', icon: '🏆' }
    ]
  },
  '3C': {
    name: 'Méthode 3C',
    steps: [
      { label: 'Contexte', desc: 'Le cadre général', icon: '📽️' },
      { label: 'Compétences', desc: 'Tes atouts mobilisés', icon: '🛠️' },
      { label: 'Cible', desc: 'Pourquoi ici demain ?', icon: '🎯' }
    ]
  }
};

export default function EntretienPage() {
  const router = useRouter();
  const [timer30, setTimer30] = useState(30);
  const [timer60, setTimer60] = useState(60);
  const [isRunning30, setIsRunning30] = useState(false);
  const [isRunning60, setIsRunning60] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState('');

  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState<'STAR' | '3C' | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning30 && timer30 > 0) {
      interval = setInterval(() => setTimer30(prev => prev - 1), 1000);
    } else if (timer30 === 0) setIsRunning30(false);
    return () => clearInterval(interval);
  }, [isRunning30, timer30]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning60 && timer60 > 0) {
      interval = setInterval(() => setTimer60(prev => prev - 1), 1000);
    } else if (timer60 === 0) setIsRunning60(false);
    return () => clearInterval(interval);
  }, [isRunning60, timer60]);

  const getTimerColor = (time: number, max: number) => {
    const pct = (time / max) * 100;
    if (pct > 50) return colors.primary;
    if (pct > 25) return colors.secondary;
    return colors.pink;
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setSimStep(0);
    setRandomQuestion(questionsFrequentes[0].question);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>

      <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}, ${colors.secondary})`, pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <MotionBox
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          sx={{ position: 'absolute', top: '-30%', right: '-15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}
        />
        <Container maxWidth="lg">
          <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/candidat')} sx={{ color: '#fff', mb: 4 }}>Retour</Button>
          </MotionBox>
          <MotionBox initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
            <Chip label="Préparation Entretien" sx={{ mb: 3, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
            <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Prépare ton entretien 🎤
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1rem', md: '1.2rem' } }}>
              Coaching personnalisé pour réussir ton entretien de motivation
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>

        {isSimulating && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            sx={{
              position: 'fixed', inset: 0, zIndex: 1000, bgcolor: 'rgba(26,26,46,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3
            }}
          >
            <Container maxWidth="md">
              <Card sx={{ borderRadius: 6, p: 4, textAlign: 'center', bgcolor: '#fff', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#ff4444', animation: 'pulse 1.5s infinite' }} />
                  <Typography sx={{ fontWeight: 700, color: '#ff4444', fontSize: '0.8rem' }}>REC • CAMERA ON</Typography>
                </Box>
                <Button sx={{ position: 'absolute', top: 20, right: 20 }} onClick={() => setIsSimulating(false)}><Stop /></Button>

                <Typography variant="h6" sx={{ color: colors.primary, mb: 1, fontWeight: 700 }}>Question {simStep + 1}/5</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>{randomQuestion}</Typography>

                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={160} thickness={4} variant="indeterminate" sx={{ color: colors.primary }} />
                </Box>

                <Typography sx={{ color: '#666', mb: 4 }}>Observe ta posture et évite les tics de langage...</Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="outlined" onClick={() => setIsSimulating(false)}>Arrêter</Button>
                  <Button variant="contained" sx={{ px: 4, background: colors.primary }} onClick={() => {
                    if (simStep < 4) {
                      setSimStep(prev => prev + 1);
                      setRandomQuestion(questionsSurprise[Math.floor(Math.random() * 6)]);
                    } else {
                      setIsSimulating(false);
                      setFeedbackOpen(true);
                    }
                  }}>
                    {simStep === 4 ? 'Terminer & Analyser' : 'Question Suivante'}
                  </Button>
                </Box>
              </Card>
            </Container>
          </MotionBox>
        )}

        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>⚡ BilliCoach Tools</Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MotionCard variants={fadeInUp} whileHover={{ y: -8 }} sx={{ height: '100%', borderRadius: 4, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, color: '#fff' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>🎭 Simulation Live</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>Simulation d'entretien realiste avec camera activee.</Typography>
                  <Button variant="contained" size="large" fullWidth onClick={startSimulation} sx={{ background: colors.secondary, color: '#1a1a2e', fontWeight: 700 }}>Lancer la simulation</Button>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <MotionCard variants={fadeInUp} whileHover={{ y: -8 }} sx={{ height: '100%', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>🛠️ Méthodes de réponse</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {Object.keys(templates).map(t => (
                      <Button
                        key={t}
                        variant={activeTemplate === t ? 'contained' : 'outlined'}
                        onClick={() => setActiveTemplate(t as any)}
                        sx={{ flex: 1, py: 1.5, borderRadius: 2 }}
                      >
                        {t}
                      </Button>
                    ))}
                  </Box>
                  {activeTemplate && (
                    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                      {templates[activeTemplate].steps.map((s, i) => (
                        <Box key={i} sx={{ minWidth: 140, p: 2, bgcolor: '#f5f5f5', borderRadius: 3, textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '1.5rem', mb: 1 }}>{s.icon}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>{s.label}</Typography>
                          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>{s.desc}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {!activeTemplate && <Typography sx={{ color: '#999', textAlign: 'center', py: 4 }}>Choisis une méthode pour voir la structure de réponse idéale.</Typography>}
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <MotionCard variants={fadeInUp} sx={{ borderRadius: 4, border: `2px solid ${colors.blue}` }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant="determinate" value={(timer30 / 30) * 100} size={80} thickness={6} sx={{ color: getTimerColor(timer30, 30) }} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{timer30}s</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Pitch Flash</Typography>
                    <Typography variant="caption" sx={{ color: '#666', mb: 2, display: 'block' }}>Efficacité & Concision</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" onClick={() => setIsRunning30(!isRunning30)} sx={{ background: isRunning30 ? colors.pink : colors.primary }}>{isRunning30 ? 'Stop' : 'Start'}</Button>
                      <Button size="small" variant="outlined" onClick={() => setTimer30(30)}>Reset</Button>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <MotionCard variants={fadeInUp} sx={{ borderRadius: 4, border: `2px solid ${colors.pink}` }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant="determinate" value={(timer60 / 60) * 100} size={80} thickness={6} sx={{ color: getTimerColor(timer60, 60) }} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{timer60}s</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Pitch Expert</Typography>
                    <Typography variant="caption" sx={{ color: '#666', mb: 2, display: 'block' }}>Détails & Storytelling</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" onClick={() => setIsRunning60(!isRunning60)} sx={{ background: isRunning60 ? colors.pink : colors.blue }}>{isRunning60 ? 'Stop' : 'Start'}</Button>
                      <Button size="small" variant="outlined" onClick={() => setTimer60(60)}>Reset</Button>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </MotionBox>

        {feedbackOpen && (
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ mb: 8, p: 4, bgcolor: '#e8f5e9', borderRadius: 6, border: `2px solid ${colors.primary}` }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>🏆 Analyse BilliCoach</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary }}>Structure</Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>Bonne utilisation de la méthode STAR. Tes exemples sont percutants.</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: colors.blue }}>Débit Vocal</Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>Environ 130 mots/min. C’est parfait pour la clarté.</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: colors.pink }}>Tic de langage</Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>Attention au mot "Euh" (4 fois détecté). Respire plus !</Typography>
                </Box>
              </Grid>
            </Grid>
            <Button variant="contained" sx={{ mt: 3, background: colors.primary }} onClick={() => setFeedbackOpen(false)}>Continuer l'entraînement</Button>
          </MotionBox>
        )}

        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>📝 Questions fréquentes</Typography>
          {questionsFrequentes.map((item, index) => (
            <MotionBox key={index} variants={fadeInUp}>
              <Accordion sx={{ mb: 2, borderRadius: 3, '&:before': { display: 'none' }, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><Lightbulb sx={{ color: colors.secondary, mr: 1 }} /><Typography sx={{ fontWeight: 700 }}>Conseils</Typography></Box>
                    <Box component="ul" sx={{ pl: 2 }}>{item.conseils.map((c, i) => <li key={i}><Typography sx={{ color: '#555', fontSize: '0.95rem' }}>{c}</Typography></li>)}</Box>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><CheckCircle sx={{ color: colors.primary, mr: 1 }} /><Typography sx={{ fontWeight: 700 }}>Exemple</Typography></Box>
                    <Box sx={{ p: 2, background: '#E8F5E9', borderRadius: 2, borderLeft: `4px solid ${colors.primary}` }}>
                      <Typography sx={{ fontStyle: 'italic', color: '#555' }}>"{item.exemple}"</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><Warning sx={{ color: colors.pink, mr: 1 }} /><Typography sx={{ fontWeight: 700 }}>À éviter</Typography></Box>
                    <Box component="ul" sx={{ pl: 2 }}>{item.aEviter.map((a, i) => <li key={i}><Typography sx={{ color: '#555', fontSize: '0.95rem' }}>{a}</Typography></li>)}</Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </MotionBox>
          ))}
        </MotionBox>
      </Container>

      <Box sx={{ py: 8, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, textAlign: 'center' }}>
        <Container maxWidth="md">
          <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>💪 Prêt(e) pour l'entretien ?</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>N'hésite pas à t'entraîner plusieurs fois pour gagner en confiance</Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/candidat/contact')}
              endIcon={<ArrowForward />}
              sx={{ background: colors.secondary, color: '#1a1a2e', fontWeight: 700, px: 5, py: 1.5, borderRadius: 3 }}
            >
              Prendre RDV pour l'entretien
            </Button>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
