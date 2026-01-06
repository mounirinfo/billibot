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
  CircularProgress
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, EmojiObjects, Refresh } from '@mui/icons-material';
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
    subtitle: 'Ce qui compte le plus pour toi (0-3)',
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
  const [activeStep, setActiveStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
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

            <Grid size={{ xs: 12 }}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                sx={{ mt: 6 }}
              >
                <ParcoursupJournal />
              </MotionBox>
            </Grid>
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
    <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>
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
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{currentQuestion.title}</Typography>
                <Typography sx={{ color: '#666', mb: 4 }}>{currentQuestion.subtitle}</Typography>
                {(currentQuestion as any).sliders.map((s: any) => (
                  <Box key={s.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontWeight: 600 }}>{s.emoji} {s.label}</Typography>
                      <Typography sx={{ color: colors.primary, fontWeight: 700 }}>{answers.step2[s.id as keyof typeof answers.step2]}</Typography>
                    </Box>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={answers.step2[s.id as keyof typeof answers.step2]}
                      onChange={(e) => setAnswers('step2', { ...answers.step2, [s.id]: parseInt(e.target.value) })}
                      style={{ width: '100%', accentColor: colors.primary, cursor: 'pointer' }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{currentQuestion.title}</Typography>
                <Typography sx={{ color: '#666', mb: 3 }}>{currentQuestion.subtitle}</Typography>
                <Grid container spacing={2}>
                  {(currentQuestion as any).options?.map((option: any) => {
                    const stepAnswers = answers[currentStepKey as keyof typeof answers];
                    const isSelected = Array.isArray(stepAnswers)
                      ? stepAnswers.includes(option.id)
                      : stepAnswers === option.id;
                    return (
                      <Grid size={{ xs: 12, sm: 6 }} key={option.id}>
                        <MotionButton
                          fullWidth
                          variant={isSelected ? 'contained' : 'outlined'}
                          onClick={() => {
                            if (Array.isArray(stepAnswers)) {
                              const newArr = isSelected
                                ? stepAnswers.filter((id: string) => id !== option.id)
                                : [...stepAnswers, option.id];
                              setAnswers(currentStepKey, newArr);
                            } else {
                              setAnswers(currentStepKey, option.id);
                            }
                          }}
                          sx={{
                            py: 2, px: 2, borderRadius: 3, textTransform: 'none', justifyContent: 'flex-start',
                            background: isSelected ? colors.primary : 'transparent',
                            color: isSelected ? '#fff' : '#333',
                            borderColor: isSelected ? colors.primary : '#ddd'
                          }}
                        >
                          <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>{option.emoji}</Typography>
                          <Typography>{option.label}</Typography>
                        </MotionButton>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </CardContent>
        </MotionCard>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBack />}>Précédent</Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForward />}
            sx={{ px: 4, background: colors.primary, borderRadius: 2 }}
          >
            {activeStep === steps.length - 2 ? 'Découvrir mes résultats' : 'Suivant'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
