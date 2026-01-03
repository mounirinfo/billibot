'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Chip
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, EmojiObjects, Refresh } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

const colors = {
  primary: '#2D9B94',
  secondary: '#FFD93D',
  primaryDark: '#1F7A72'
};

const steps = ['Ce que tu aimes', 'Ton style', 'Ton niveau'];

const questionData = {
  step1: {
    title: '1️⃣ Ce que tu aimes le PLUS faire',
    subtitle: 'Tu peux choisir jusqu\'à 2 réponses',
    options: [
      { id: 'A', label: 'Vendre, conseiller, convaincre', emoji: '💼' },
      { id: 'B', label: 'Communiquer, créer, réseaux sociaux', emoji: '📱' },
      { id: 'C', label: 'Organiser, gérer', emoji: '📊' },
      { id: 'D', label: 'Langues, international', emoji: '🌍' },
      { id: 'E', label: 'Analyser, droit, économie', emoji: '⚖️' },
      { id: 'F', label: 'Je ne sais pas trop', emoji: '🤔' }
    ]
  },
  step2: {
    title: '2️⃣ Ton style de travail',
    subtitle: 'Choisis une réponse',
    options: [
      { id: 'A', label: 'Terrain, action, contact', emoji: '🏃' },
      { id: 'B', label: 'Bureau, stratégie, analyse', emoji: '💻' },
      { id: 'C', label: 'Créatif, projets variés', emoji: '🎨' },
      { id: 'D', label: 'Équipe, collaboration', emoji: '👥' },
      { id: 'E', label: 'Autonomie, indépendance', emoji: '🚀' }
    ]
  },
  step3: {
    title: '3️⃣ Ton niveau actuel',
    subtitle: 'Choisis une réponse',
    options: [
      { id: 'A', label: 'Terminale (bac en cours)', emoji: '📚' },
      { id: 'B', label: 'Bac obtenu', emoji: '🎓' },
      { id: 'C', label: 'Réorientation (bac+1/2)', emoji: '🔄' },
      { id: 'D', label: 'Autre situation', emoji: '✨' }
    ]
  }
};

const formations = [
  { name: 'BTS MCO', fullName: 'Management Commercial Opérationnel', emoji: '🏪', description: 'Gestion d\'unité commerciale, relation client, management', profiles: ['A', 'C'], color: '#2D9B94' },
  { name: 'BTS NDRC', fullName: 'Négociation et Digitalisation', emoji: '💼', description: 'Vente, négociation, stratégie commerciale digitale', profiles: ['A', 'B'], color: '#4A90E2' },
  { name: 'BTS COM', fullName: 'Communication', emoji: '📱', description: 'Communication digitale, événementiel, réseaux sociaux', profiles: ['B'], color: '#FF6B9D' },
  { name: 'BTS SAM', fullName: 'Support à l\'Action Managériale', emoji: '📊', description: 'Assistance de direction, gestion de projets', profiles: ['C', 'D'], color: '#FFD93D' },
  { name: 'BTS GPME', fullName: 'Gestion de la PME', emoji: '🏢', description: 'Gestion administrative, commerciale et comptable', profiles: ['C', 'E'], color: '#9C27B0' }
];

export default function OrientationPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({ step1: [], step2: [], step3: [] });
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentStepKey = `step${activeStep + 1}` as keyof typeof questionData;
  const currentQuestion = questionData[currentStepKey];
  const maxSelections = activeStep === 0 ? 2 : 1;
  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleSelectOption = (optionId: string) => {
    const currentAnswers = answers[currentStepKey];
    if (currentAnswers.includes(optionId)) {
      setAnswers({ ...answers, [currentStepKey]: currentAnswers.filter(id => id !== optionId) });
    } else {
      if (maxSelections === 1) {
        setAnswers({ ...answers, [currentStepKey]: [optionId] });
      } else if (currentAnswers.length < maxSelections) {
        setAnswers({ ...answers, [currentStepKey]: [...currentAnswers, optionId] });
      }
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setShowResults(true); }, 2000);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const getRecommendedFormations = () => {
    return formations.filter(f => f.profiles.some(p => answers.step1.includes(p))).slice(0, 3);
  };

  const handleReset = () => {
    setShowResults(false);
    setActiveStep(0);
    setAnswers({ step1: [], step2: [], step3: [] });
  };

  if (showResults) {
    const recommended = getRecommendedFormations();
    return (
      <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>
        <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}, ${colors.secondary})`, pt: 6, pb: 12 }}>
          <Container maxWidth="md">
            <MotionBox initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 80, color: '#fff', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>🎉 Tes formations idéales !</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>Voici les formations qui correspondent à ton profil</Typography>
            </MotionBox>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ mt: -6, pb: 8 }}>
          {recommended.length > 0 ? (
            <Grid container spacing={3}>
              {recommended.map((formation, index) => (
                <Grid size={12} key={index}>
                  <MotionCard
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    sx={{ borderRadius: 4, border: `3px solid ${formation.color}`, overflow: 'hidden' }}
                  >
                    <Box sx={{ height: 6, background: formation.color }} />
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '3rem', mr: 2 }}>{formation.emoji}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: formation.color }}>{formation.name}</Typography>
                          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>{formation.fullName}</Typography>
                        </Box>
                        <Chip label={`Match ${90 - index * 10}%`} sx={{ background: formation.color, color: '#fff', fontWeight: 700 }} />
                      </Box>
                      <Typography sx={{ color: '#555', mb: 3 }}>{formation.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" sx={{ flex: 1, py: 1.5, background: formation.color, fontWeight: 600 }}>En savoir plus</Button>
                        <Button variant="outlined" sx={{ flex: 1, py: 1.5, borderColor: formation.color, color: formation.color, fontWeight: 600 }} onClick={() => router.push('/candidat/admission')}>Candidater</Button>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ textAlign: 'center', p: 4, borderRadius: 4 }}>
              <EmojiObjects sx={{ fontSize: 60, color: colors.secondary, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Toutes nos formations peuvent te correspondre !</Typography>
              <Button variant="contained" sx={{ background: colors.primary }}>Voir toutes les formations</Button>
            </Card>
          )}

          <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => router.push('/candidat')}>Retour au menu</Button>
            <Button variant="contained" startIcon={<Refresh />} onClick={handleReset} sx={{ background: colors.primary }}>Refaire le quiz</Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
        <MotionBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#fff' }}>Analyse de ton profil...</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {[0, 1, 2].map(i => (
              <MotionBox
                key={i}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                sx={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }}
              />
            ))}
          </Box>
        </MotionBox>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>
      <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}, ${colors.secondary})`, pt: 14, pb: 8 }}>
        <Container maxWidth="md">
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/candidat')} sx={{ color: '#fff', mb: 3 }}>Retour</Button>
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>🧭 Orientation Express</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Trouve ta formation idéale en 3 questions</Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -4, pb: 8 }}>
        <Card sx={{ borderRadius: 4, mb: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>
            <Box sx={{ mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` } }}
              />
              <Typography sx={{ textAlign: 'center', mt: 1, color: '#666', fontSize: '0.9rem' }}>{Math.round(progress)}% complété</Typography>
            </Box>
          </Box>
        </Card>

        <MotionCard
          key={activeStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          sx={{ borderRadius: 4, mb: 3 }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{currentQuestion.title}</Typography>
            <Typography sx={{ color: '#666', mb: 3 }}>{currentQuestion.subtitle}</Typography>

            <Grid container spacing={2}>
              {currentQuestion.options.map(option => {
                const isSelected = answers[currentStepKey].includes(option.id);
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={option.id}>
                    <MotionButton
                      fullWidth
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={() => handleSelectOption(option.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      sx={{
                        py: 2.5, px: 2, borderRadius: 3, textTransform: 'none', justifyContent: 'flex-start',
                        background: isSelected ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` : 'transparent',
                        borderColor: isSelected ? colors.primary : '#ddd',
                        color: isSelected ? '#fff' : '#333',
                        '&:hover': { borderColor: colors.primary, background: isSelected ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` : '#f5f5f5' }
                      }}
                    >
                      <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>{option.emoji}</Typography>
                      <Typography sx={{ fontSize: '0.95rem', textAlign: 'left' }}>{option.label}</Typography>
                    </MotionButton>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </MotionCard>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBack />}>Précédent</Button>
          <Button
            variant="contained"
            disabled={answers[currentStepKey].length === 0}
            onClick={handleNext}
            endIcon={<ArrowForward />}
            sx={{ px: 4, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
          >
            {activeStep === steps.length - 1 ? 'Voir mes résultats' : 'Suivant'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
