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
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, EmojiObjects, Refresh, AutoAwesome } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOrientationStore } from '@/store/useOrientationStore';
import ParcoursupJournal from '@/components/candidat/ParcoursupJournal';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

const colors = {
  primary: '#2D9B94',
  secondary: '#FFD93D',
  primaryDark: '#1F7A72',
  blue: '#4A90E2',
  pink: '#FF6B9D'
};

const steps = ['Accueil', 'Ce que tu aimes', 'Ton style', 'Contraintes', 'Niveau', 'Non-négociables', 'Ajustement', 'Résultats'];

const questionData = {
  step0: {
    title: '👋 Bienvenue sur Orientation Express+',
    subtitle: 'Trouvons ensemble ta voie idéale en moins de 2 minutes.',
    content: 'Prêt(e) à découvrir les 3 pistes qui te correspondent vraiment ? On va passer par 7 petites étapes rapides.'
  },
  step1: {
    title: '1️⃣ Ce que tu aimes faire',
    subtitle: 'Quand tu t’éclates dans un projet, tu fais quoi exactement ?',
    isOpen: true,
    placeholder: 'Ex: J\'adore organiser des événements, convaincre des gens...',
    maxChars: 120,
    options: [
      { id: 'convaincre', label: 'Convaincre / Vendre', emoji: '💼' },
      { id: 'creer', label: 'Créer / Imaginer', emoji: '🎨' },
      { id: 'organiser', label: 'Organiser / Gérer', emoji: '📊' },
      { id: 'international', label: 'International / Langues', emoji: '🌍' },
      { id: 'analyser', label: 'Analyser / Comprendre', emoji: '🔍' }
    ]
  },
  step2: {
    title: '2️⃣ Ton style de travail',
    subtitle: 'Tire sur le curseur pour choisir ton style. (3 = Très important, 1 = Peu important)',
    sliders: [
      { id: 'crea', label: 'Créativité', emoji: '🎨' },
      { id: 'social', label: 'Relationnel', emoji: '👥' },
      { id: 'data', label: 'Données / Analyse', emoji: '📊' },
      { id: 'intl', label: 'International', emoji: '🌍' }
    ]
  },
  step3: {
    title: '3️⃣ Tes contraintes & envies',
    subtitle: 'Choisis jusqu\'à 3 options',
    options: [
      { id: 'apprenticeship', label: 'Alternance souhaitée', emoji: '🤝' },
      { id: 'proximity', label: 'Proximité géographique', emoji: '📍' },
      { id: 'practice', label: 'Beaucoup de pratique', emoji: '🛠️' },
      { id: 'hybrid', label: 'Mode Hybride OK', emoji: '🏠' },
      { id: 'budget', label: 'Budget à surveiller', emoji: '💰' }
    ]
  },
  step4: {
    title: '4️⃣ Ton niveau & contexte',
    subtitle: 'Où en es-tu aujourd\'hui ?',
    options: [
      { id: 'terminale', label: 'Terminale (Bac en cours)', emoji: '📚' },
      { id: 'bac', label: 'Bac obtenu', emoji: '🎓' },
      { id: 'reorient', label: 'Réorientation', emoji: '🔄' },
      { id: 'other', label: 'Autre situation', emoji: '✨' }
    ]
  },
  step5: {
    title: '5️⃣ Tes non-négociables',
    subtitle: 'Ce qui est impératif pour toi (max 2)',
    options: [
      { id: 'initiale_req', label: '100 % Initiale', emoji: '🏫' },
      { id: 'short_req', label: 'Formation courte ( 6 / 8 / 12 mois)', emoji: '⏱️' },
      { id: 'long_req', label: 'Formation Longue (Bac+2 , Bac+3, Bac+4, Bac+5)', emoji: '🎓' },
      { id: 'intl_req', label: 'International indispensable', emoji: '🌐' }
    ]
  },
  step6: {
    title: '6️⃣ Ajustement final',
    subtitle: 'En fonction de tes réponses, on a déjà une idée. Tu veux booster un critère ?',
    options: [
      { id: 'boost_crea', label: 'Booster Créativité', emoji: '🎨' },
      { id: 'boost_intl', label: 'Booster International', emoji: '🌍' },
      { id: 'boost_social', label: 'Booster Relationnel', emoji: '👥' },
      { id: 'all_good', label: 'Tout me semble parfait', emoji: '✅' }
    ]
  }
};

const formations = [
  {
    id: 'bts_mco',
    name: 'BTS MCO',
    fullName: 'Management Commercial Opérationnel',
    emoji: '🏪',
    description: 'Devenir un expert de la relation client et du management d\'unité.',
    tags: ['convaincre', 'organiser'],
    weights: { crea: 1, social: 3, data: 1, intl: 1 },
    options: { apprenticeship: true, practice: true },
    color: '#2D9B94',
    badges: ['Relation client', 'Management', 'Alternance']
  },
  {
    id: 'bts_ndrc',
    name: 'BTS NDRC',
    fullName: 'Négociation et Digitalisation',
    emoji: '💼',
    description: 'Maîtriser la vente et la relation client sous toutes ses formes digitales.',
    tags: ['convaincre', 'analyser'],
    weights: { crea: 1, social: 3, data: 2, intl: 1 },
    options: { apprenticeship: true, practice: true },
    color: '#4A90E2',
    badges: ['Vente', 'Digital', 'Négociation']
  },
  {
    id: 'bts_com',
    name: 'BTS COM',
    fullName: 'Communication',
    emoji: '📱',
    description: 'Concevoir et mettre en oeuvre des stratégies de communication créatives.',
    tags: ['creer', 'international'],
    weights: { crea: 3, social: 2, data: 1, intl: 2 },
    options: { apprenticeship: true, practice: true },
    color: '#FF6B9D',
    badges: ['Créativité', 'Médias', 'Stratégie']
  }
];

const getOptionLabel = (stepKey: string, id: string) => {
  const step = (questionData as any)[stepKey];
  if (!step) return id;
  if (step.options) {
    return step.options.find((o: any) => o.id === id)?.label || id;
  }
  if (step.sliders) {
    return step.sliders.find((s: any) => s.id === id)?.label || id;
  }
  return id;
};

export default function OrientationPage() {
  const router = useRouter();
  const { answers, setAnswers, resetQuiz, results, setResults, generateMistralPrompt, aiAnalysis, setAiAnalysis } = useOrientationStore();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Analyse de tes passions...",
    "Exploration des BTS en France...",
    "Calcul de tes affinités...",
    "BilliBot finalise ton futur !"
  ];

  const handleNext = async () => {
    if (activeStep === 6) {
      setLoading(true);
      setLoadingStep(0);


      const interval = setInterval(() => {
        setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 800);

      try {
        const response = await fetch('/api/orientation-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: generateMistralPrompt() })
        });
        const data = await response.json();

        if (data.formations) {
          setResults(data.formations);
        }
        if (data.globalAdvice) {
          setAiAnalysis(data.globalAdvice);
        }

        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setShowResults(true);
        }, 500);

      } catch (error) {
        console.error('Error generating AI results:', error);
        setLoading(false);
        setIsGenerating(false);
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const currentStepKey = `step${activeStep}` as keyof typeof questionData;
  const currentQuestion = (questionData as any)[currentStepKey] || { title: '...', subtitle: '', options: [], sliders: [], content: '' };
  const progress = (activeStep / (steps.length - 1)) * 100;

  const handleBack = () => setActiveStep(prev => prev - 1);

  const getRecommendedFormations = () => {
    return formations.map(f => {
      let score = 0;
      const userTags = answers?.step1?.tags || [];
      const tagMatch = f.tags.filter(t => userTags.includes(t)).length;
      score += tagMatch * 0.4;

      const userPrefs = answers?.step2 || { crea: 1, social: 1, data: 1, intl: 1 };
      const weightDiff = Math.abs((userPrefs.crea || 1) - f.weights.crea) +
        Math.abs((userPrefs.social || 1) - f.weights.social) +
        Math.abs((userPrefs.data || 1) - f.weights.data) +
        Math.abs((userPrefs.intl || 1) - f.weights.intl);
      score += (12 - weightDiff) / 12 * 0.3;

      const userStep3 = answers?.step3 || [];
      if (userStep3.includes('apprenticeship') && f.options.apprenticeship) score += 0.2;

      const userStep6 = answers?.step6 || [];
      if (userStep6.includes('boost_crea')) score += (f.weights.crea / 3) * 0.15;
      if (userStep6.includes('boost_intl')) score += (f.weights.intl / 3) * 0.15;
      if (userStep6.includes('boost_social')) score += (f.weights.social / 3) * 0.15;

      const userStep5 = answers?.step5 || [];
      if (userStep5.includes('alt_req') && !f.options.apprenticeship) score -= 0.5;

      return { ...f, match: Math.min(Math.round(score * 100), 99) };
    }).sort((a, b) => (b.match || 0) - (a.match || 0)).slice(0, 3);
  };

  const handleReset = () => {
    resetQuiz();
    setShowResults(false);
    setActiveStep(0);
  };

  if (showResults) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>
        <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}, ${colors.secondary})`, pt: 6, pb: 12 }}>
          <Container maxWidth="md">
            <MotionBox initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 80, color: '#fff', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>🎉 Tes formations idéales !</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>Découvre ton profil BilliBot et tes meilleures options</Typography>
            </MotionBox>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ mt: -6, pb: 8 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <MotionCard initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} sx={{ borderRadius: 4, mb: 4, borderLeft: `6px solid ${colors.secondary}`, overflow: 'visible' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    📑 Résumé de tes choix
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="textSecondary">Ce que tu aimes :</Typography>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>{answers.step1.freeText || 'Non précisé'}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {answers.step1.tags.map(t => <Chip key={t} label={getOptionLabel('step1', t)} size="small" />)}
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="textSecondary">Style de travail :</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip label={`🎨 Créa: ${answers.step2.crea}`} size="small" variant="outlined" />
                        <Chip label={`👥 Social: ${answers.step2.social}`} size="small" variant="outlined" />
                        <Chip label={`📊 Data: ${answers.step2.data}`} size="small" variant="outlined" />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        <Chip icon={<EmojiObjects />} label={getOptionLabel('step4', answers.step4)} color="primary" variant="outlined" />
                        {answers.step3.map(t => <Chip key={t} label={getOptionLabel('step3', t)} variant="outlined" />)}
                        {answers.step5.map(t => <Chip key={t} label={`⚠️ ${getOptionLabel('step5', t)}`} color="error" variant="outlined" />)}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <MotionCard
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                sx={{
                  borderRadius: 4,
                  mb: 4,
                  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  color: '#fff',
                  border: `2px solid ${colors.secondary}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: colors.secondary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    🤖 L'analyse personnalisée de BilliBot
                  </Typography>
                  <Typography
                    sx={{
                      lineHeight: 1.8,
                      fontSize: '1.1rem',
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.9)',
                      borderLeft: `4px solid ${colors.primary}`,
                      pl: 3,
                      py: 1
                    }}
                  >
                    {aiAnalysis || "Analyse en cours..."}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            {/* Floating Scroll Indicator - Fun BilliBot Guide */}
            <Box sx={{
              position: 'fixed',
              bottom: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2000,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <MotionBox
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                  bgcolor: '#fff',
                  py: 1, px: 2.5,
                  borderRadius: 8,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  border: `2px solid ${colors.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <Typography sx={{ fontSize: '1.2rem' }}>🤖</Typography>
                <Typography sx={{ fontWeight: 900, color: colors.primary, fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                  SCROLLE POUR LA SUITE ! 👇
                </Typography>
              </MotionBox>
            </Box>

            {
              results.map((formation: any, index: number) => (
                <Grid size={{ xs: 12 }} key={formation.id}>
                  <MotionCard
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{
                      y: -10,
                      boxShadow: `0 20px 40px ${formation.color}33`,
                    }}
                    sx={{
                      borderRadius: 6,
                      border: `1px solid ${formation.color}44`,
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      overflow: 'hidden',
                      mb: 4,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, height: '6px',
                        background: formation.color
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Box
                          sx={{
                            width: 80, height: 80,
                            borderRadius: 4,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem',
                            background: `${formation.color}15`,
                            border: `1px solid ${formation.color}33`,
                            boxShadow: `0 10px 20px ${formation.color}22`
                          }}
                        >
                          {formation.emoji}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: formation.color, letterSpacing: '-0.5px' }}>
                            {formation.name}
                          </Typography>
                          <Typography sx={{ color: '#555', fontWeight: 600, fontSize: '1rem' }}>
                            {formation.fullName}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h3" sx={{ fontWeight: 900, color: formation.color, lineHeight: 1 }}>
                            {formation.match}%
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>
                            Match Score
                          </Typography>
                        </Box>
                      </Box>

                      <Typography sx={{ color: '#444', mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                        {formation.description}
                      </Typography>

                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                          🚀 Pourquoi cet avenir ?
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {formation.badges.map((badge: string) => (
                            <Chip
                              key={badge}
                              label={badge}
                              sx={{
                                background: 'white',
                                color: formation.color,
                                fontWeight: 700,
                                border: `1px solid ${formation.color}44`,
                                px: 1,
                                '&:hover': { background: formation.color, color: 'white' }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MotionButton
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            variant="contained"
                            fullWidth
                            sx={{
                              py: 2,
                              background: `linear-gradient(135deg, ${formation.color}, ${formation.color}dd)`,
                              fontWeight: 800,
                              borderRadius: 3,
                              fontSize: '1rem',
                              boxShadow: `0 10px 20px ${formation.color}44`
                            }}
                          >
                            Candidater maintenant
                          </MotionButton>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MotionButton
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            variant="outlined"
                            fullWidth
                            sx={{
                              py: 2,
                              borderColor: formation.color,
                              color: formation.color,
                              fontWeight: 800,
                              borderRadius: 3,
                              fontSize: '1rem',
                              borderWidth: '2px',
                              '&:hover': { borderWidth: '2px', background: `${formation.color}05` }
                            }}
                          >
                            Détails de la formation
                          </MotionButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))
            }
          </Grid >

          <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => router.push('/candidat')}>Retour au menu</Button>
            <Button variant="contained" startIcon={<Refresh />} onClick={handleReset} sx={{ background: colors.primary }}>Refaire le quiz</Button>
            <Button
              variant="text"
              color="error"
              onClick={handleReset}
              sx={{ fontWeight: 600 }}
            >
              Supprimer mes réponses
            </Button>
          </Box>
        </Container >
      </Box >
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
        <MotionBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} sx={{ textAlign: 'center', width: '100%', maxWidth: 400, px: 3 }}>
          <Box sx={{ position: 'relative', mb: 4 }}>
            <CircularProgress size={80} sx={{ color: '#fff' }} />
            <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, color: '#fff' }}>
              {loadingStep + 1}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#fff' }}>
            {loadingMessages[loadingStep]}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(loadingStep + 1) * 25}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#fff' }
            }}
          />
          <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
            BilliBot prépare ton futur en France...
          </Typography>
        </MotionBox>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#FAFBFF',
      overflowX: 'hidden',
      /* Fun Custom Scrollbar */
      '&::-webkit-scrollbar': { width: '10px' },
      '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
      '&::-webkit-scrollbar-thumb': {
        background: `linear-gradient(${colors.primary}, ${colors.secondary})`,
        borderRadius: '10px',
        border: '2px solid #f1f1f1'
      },
      '&::-webkit-scrollbar-thumb:hover': { background: colors.primaryDark }
    }}>
      <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark}, ${colors.secondary})`, pt: 14, pb: 8 }}>
        <Container maxWidth="md">
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/candidat')} sx={{ color: '#fff', mb: 3 }}>Retour</Button>
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>🧭 Orientation Express+</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {activeStep === 0 ? 'Trouvons ta voie idéale' : `Étape ${activeStep} sur ${steps.length - 2}`}
            </Typography>
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

        <MotionCard key={activeStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} sx={{ borderRadius: 4, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {!currentQuestion ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ color: colors.primary }} />
                <Typography sx={{ mt: 2 }}>Préparation des résultats...</Typography>
              </Box>
            ) : activeStep === 0 ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>{currentQuestion.title}</Typography>
                <Typography sx={{ color: '#666', mb: 4, fontSize: '1.2rem' }}>{currentQuestion.subtitle}</Typography>
                <Typography sx={{ color: '#555', mb: 4 }}>{(currentQuestion as any).content}</Typography>
                <Button variant="contained" size="large" onClick={handleNext} sx={{ px: 6, py: 2, borderRadius: 4, background: colors.primary }}>C'est parti !</Button>
              </Box>
            ) : activeStep === 1 ? (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{currentQuestion.title}</Typography>
                <Typography sx={{ color: '#666', mb: 3 }}>{currentQuestion.subtitle}</Typography>
                <textarea
                  placeholder={(currentQuestion as any).placeholder}
                  value={answers.step1.freeText}
                  onChange={(e) => setAnswers('step1', { ...answers.step1, freeText: e.target.value })}
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', minHeight: '100px', marginBottom: '20px', fontFamily: 'inherit', outline: 'none' }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(currentQuestion as any).options.map((opt: any) => {
                    const isSelected = answers.step1.tags.includes(opt.id);
                    return (
                      <Chip
                        key={opt.id}
                        label={`${opt.emoji} ${opt.label}`}
                        onClick={() => {
                          const newTags = isSelected ? answers.step1.tags.filter((id: string) => id !== opt.id) : [...answers.step1.tags, opt.id];
                          setAnswers('step1', { ...answers.step1, tags: newTags });
                        }}
                        sx={{
                          p: 1.5, height: 40, cursor: 'pointer',
                          background: isSelected ? colors.primary : '#f0f0f0',
                          color: isSelected ? '#fff' : '#333',
                          '&:hover': { background: isSelected ? colors.primaryDark : '#e0e0e0' }
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            ) : activeStep === 2 ? (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1a1a2e' }}>{currentQuestion.title}</Typography>
                <Typography sx={{ color: '#666', mb: 4, fontWeight: 500 }}>{currentQuestion.subtitle}</Typography>

                {(currentQuestion as any).sliders.map((s: any) => {
                  const val = answers.step2[s.id as keyof typeof answers.step2];
                  return (
                    <Box key={s.id} sx={{ mb: 6, position: 'relative' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography sx={{ fontSize: '1.5rem' }}>{s.emoji}</Typography>
                          <Typography sx={{ fontWeight: 800, color: '#333', fontSize: '1.1rem' }}>{s.label}</Typography>
                        </Box>
                        <Chip
                          label={val === 3 ? "Priorité Max 🚀" : val === 1 ? "Secondaire ☁️" : "Important 👍"}
                          size="small"
                          sx={{
                            background: val === 3 ? colors.secondary : val === 1 ? '#eee' : colors.primary,
                            color: val === 3 ? '#000' : val === 1 ? '#666' : '#fff',
                            fontWeight: 800,
                            borderRadius: '8px'
                          }}
                        />
                      </Box>

                      <Box sx={{
                        position: 'relative',
                        height: 70, // Reduced height
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5, // Reduced margin
                        px: 0, // Removed large padding
                        boxSizing: 'border-box'
                      }}>
                        {/* Mechanical Rope/Track */}
                        <Box sx={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          height: 8,
                          background: '#e8e8e8',
                          borderRadius: 4,
                          overflow: 'hidden',
                          boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.1)'
                        }}>
                          <Box sx={{
                            height: '100%',
                            width: `${((val - 1) / 2) * 100}%`,
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                            transition: 'width 0.3s ease'
                          }} />
                        </Box>

                        {/* BilliBot THUMB - STRICT BOUNDARIES */}
                        <MotionBox
                          animate={{
                            left: `${((val - 1) / 2) * 100}%`,
                            translateX: `-${((val - 1) / 2) * 100}%` // EXACT MATH: Stays inside 0-100%
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          sx={{
                            position: 'absolute',
                            width: 80,
                            height: 70,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                            zIndex: 4,
                          }}
                        >
                          <MotionBox
                            animate={{
                              rotate: val > 1 ? [-10, 10, -10] : 0,
                              scale: val === 3 ? 1.2 : 1
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <svg width="55" height="55" viewBox="0 0 100 100">
                              <rect x="25" y="25" width="50" height="50" rx="10" fill={colors.primary} />
                              <circle cx="40" cy="40" r="4" fill="white" />
                              <circle cx="60" cy="40" r="4" fill="white" />
                              <path
                                d={val === 3 ? "M 35 60 Q 50 52 65 60" : "M 35 60 Q 50 68 65 60"}
                                stroke="white" strokeWidth="4" fill="none"
                              />
                            </svg>
                          </MotionBox>
                          <Typography sx={{
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            color: colors.primary,
                            bgcolor: '#fff',
                            px: 1.2, py: 0.3, borderRadius: '6px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            mt: -1,
                            whiteSpace: 'nowrap',
                            border: `1.5px solid ${colors.primary}`,
                            zIndex: 10
                          }}>
                            {val === 3 ? 'MAX ! 🔥' : val === 2 ? 'OUI ! ✊' : 'TIRE ! 🤖'}
                          </Typography>
                        </MotionBox>

                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="1"
                          value={val}
                          onChange={(e) => setAnswers('step2', { ...answers.step2, [s.id]: parseInt(e.target.value) })}
                          style={{
                            width: '100%',
                            position: 'relative',
                            zIndex: 10,
                            opacity: 0,
                            cursor: 'grab',
                            height: '50px'
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1a1a2e' }}>{currentQuestion.title}</Typography>
                <Typography sx={{ color: '#666', mb: 3, fontWeight: 500 }}>{currentQuestion.subtitle}</Typography>
                <Grid container spacing={2}>
                  {(currentQuestion as any).options?.map((option: any) => {
                    const stepAnswers = answers[currentStepKey as keyof typeof answers] as string[];
                    const isSelected = stepAnswers.includes(option.id);
                    return (
                      <Grid size={{ xs: 12, sm: 6 }} key={option.id}>
                        <MotionButton
                          fullWidth
                          variant={isSelected ? 'contained' : 'outlined'}
                          onClick={() => {
                            const limit = currentStepKey === 'step3' ? 3 : currentStepKey === 'step5' ? 2 : currentStepKey === 'step6' ? 1 : 99;
                            if (!isSelected && stepAnswers.length >= limit) {
                              setAlertMessage(`Attention : Limite de ${limit === 1 ? 'un seul choix possible' : limit + ' choix maximum'} ! 🛑`);
                              setShowAlert(true);
                              return;
                            }
                            const newArr = isSelected
                              ? stepAnswers.filter((id: string) => id !== option.id)
                              : [...stepAnswers, option.id];
                            setAnswers(currentStepKey, newArr);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          sx={{
                            py: 2.5, px: 3, borderRadius: '16px', textTransform: 'none', justifyContent: 'flex-start',
                            background: isSelected ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` : '#fff',
                            color: isSelected ? '#fff' : '#333',
                            borderColor: isSelected ? colors.primary : '#eee',
                            boxShadow: isSelected ? `0 10px 20px ${colors.primary}44` : 'none',
                            '&:hover': {
                              borderColor: colors.primary,
                              background: isSelected ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` : `${colors.primary}08`
                            }
                          }}
                        >
                          <Typography sx={{ fontSize: '1.8rem', mr: 2.5 }}>{option.emoji}</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>{option.label}</Typography>
                        </MotionButton>
                      </Grid>
                    );
                  })}
                </Grid>

                <Snackbar
                  open={showAlert}
                  autoHideDuration={4000}
                  onClose={() => setShowAlert(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <Alert
                    onClose={() => setShowAlert(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '12px', fontWeight: 700 }}
                  >
                    {alertMessage}
                  </Alert>
                </Snackbar>
              </Box>
            )}
          </CardContent>
        </MotionCard>

        {activeStep > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5, // Absolute minimum
            pt: 2,
            borderTop: '1px solid #eee'
          }}>
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{
                color: '#999',
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': { background: 'transparent', color: colors.primary }
              }}
            >
              Précédent
            </Button>

            {activeStep === steps.length - 2 ? (
              <MotionButton
                variant="contained"
                onClick={handleNext}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 0 30px ${colors.secondary}, 0 0 60px ${colors.primary}66`,
                }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  px: 8,
                  py: 2.5,
                  borderRadius: '30px',
                  fontWeight: 950,
                  fontSize: '1.4rem',
                  textTransform: 'none',
                  letterSpacing: '1px',
                  color: '#000',
                  background: `linear-gradient(45deg, ${colors.secondary}, #FFE66D, ${colors.primary}, ${colors.blue}, ${colors.secondary})`,
                  backgroundSize: '300% 300%',
                  animation: 'shimmerGradient 4s ease infinite',
                  '@keyframes shimmerGradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'rotate(45deg)',
                    animation: 'shineEffect 3s infinite',
                    pointerEvents: 'none'
                  },
                  '@keyframes shineEffect': {
                    '0%': { transform: 'translateX(-150%) rotate(45deg)' },
                    '100%': { transform: 'translateX(150%) rotate(45deg)' }
                  },
                  border: '3px solid #fff',
                  boxShadow: `0 20px 50px ${colors.primary}44`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AutoAwesome sx={{ animation: 'pulseIcon 2s infinite' }} />
                  DÉCOUVRIR MON AVENIR
                  <AutoAwesome sx={{ animation: 'pulseIcon 2s infinite alternate-reverse' }} />
                </Box>
                <style>
                  {`
                    @keyframes pulseIcon {
                      0% { transform: scale(1) rotate(0deg); opacity: 0.7; }
                      50% { transform: scale(1.3) rotate(15deg); opacity: 1; }
                      100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
                    }
                  `}
                </style>
              </MotionButton>
            ) : (
              <MotionButton
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{
                  px: 10,
                  py: 2,
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  borderRadius: '20px',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  textTransform: 'none',
                  color: '#fff',
                  boxShadow: `0 10px 25px ${colors.primary}44`
                }}
              >
                Suivant
              </MotionButton>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
