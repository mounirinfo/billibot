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

export default function EntretienPage() {
  const router = useRouter();
  const [timer30, setTimer30] = useState(30);
  const [timer60, setTimer60] = useState(60);
  const [isRunning30, setIsRunning30] = useState(false);
  const [isRunning60, setIsRunning60] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState('');

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

        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>⏱️ Entraîne-toi</Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MotionCard variants={fadeInUp} whileHover={{ y: -8 }} sx={{ height: '100%', borderRadius: 4, border: `2px solid ${colors.primary}`, textAlign: 'center' }}>
                <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryDark})` }} />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>⚡ Pitch 30 secondes</Typography>
                  <Typography sx={{ color: '#666', mb: 3, fontSize: '0.9rem' }}>Présente-toi de manière concise</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                    <CircularProgress variant="determinate" value={(timer30 / 30) * 100} size={140} thickness={6} sx={{ color: getTimerColor(timer30, 30) }} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: getTimerColor(timer30, 30) }}>{timer30}s</Typography>
                    </Box>
                  </Box>
                  {timer30 === 0 && <Chip label="🎉 Terminé !" sx={{ mb: 2, background: colors.primary, color: '#fff', fontWeight: 700 }} />}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {!isRunning30 ? (
                      <Button variant="contained" startIcon={<PlayArrow />} onClick={() => setIsRunning30(true)} disabled={timer30 === 0} sx={{ flex: 1, background: colors.primary }}>Start</Button>
                    ) : (
                      <Button variant="contained" startIcon={<Stop />} onClick={() => setIsRunning30(false)} sx={{ flex: 1, background: colors.pink }}>Stop</Button>
                    )}
                    <Button variant="outlined" onClick={() => { setTimer30(30); setIsRunning30(false); }}><Refresh /></Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MotionCard variants={fadeInUp} whileHover={{ y: -8 }} sx={{ height: '100%', borderRadius: 4, border: `2px solid ${colors.blue}`, textAlign: 'center' }}>
                <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.blue}, #2196F3)` }} />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>🚀 Pitch 1 minute</Typography>
                  <Typography sx={{ color: '#666', mb: 3, fontSize: '0.9rem' }}>Développe ton parcours et projet</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                    <CircularProgress variant="determinate" value={(timer60 / 60) * 100} size={140} thickness={6} sx={{ color: getTimerColor(timer60, 60) }} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: getTimerColor(timer60, 60) }}>{timer60}s</Typography>
                    </Box>
                  </Box>
                  {timer60 === 0 && <Chip label="🎉 Terminé !" sx={{ mb: 2, background: colors.blue, color: '#fff', fontWeight: 700 }} />}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {!isRunning60 ? (
                      <Button variant="contained" startIcon={<PlayArrow />} onClick={() => setIsRunning60(true)} disabled={timer60 === 0} sx={{ flex: 1, background: colors.blue }}>Start</Button>
                    ) : (
                      <Button variant="contained" startIcon={<Stop />} onClick={() => setIsRunning60(false)} sx={{ flex: 1, background: colors.pink }}>Stop</Button>
                    )}
                    <Button variant="outlined" onClick={() => { setTimer60(60); setIsRunning60(false); }}><Refresh /></Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MotionCard variants={fadeInUp} whileHover={{ y: -8 }} sx={{ height: '100%', borderRadius: 4, border: `2px solid ${colors.pink}`, textAlign: 'center' }}>
                <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.pink}, #E91E63)` }} />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>🎲 Question surprise</Typography>
                  <Typography sx={{ color: '#666', mb: 3, fontSize: '0.9rem' }}>Entraîne-toi à répondre spontanément</Typography>
                  <Box sx={{ minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, mb: 3, background: randomQuestion ? '#FFF3E0' : '#f5f5f5', borderRadius: 3, border: randomQuestion ? `2px solid ${colors.pink}` : '2px dashed #ddd' }}>
                    {randomQuestion ? (
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', textAlign: 'center' }}>{randomQuestion}</Typography>
                    ) : (
                      <Typography sx={{ color: '#999' }}>Clique pour découvrir une question</Typography>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setRandomQuestion(questionsSurprise[Math.floor(Math.random() * questionsSurprise.length)])}
                    sx={{ py: 1.5, background: `linear-gradient(135deg, ${colors.pink}, #E91E63)`, fontWeight: 600 }}
                  >
                    Nouvelle question
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </MotionBox>

        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
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
