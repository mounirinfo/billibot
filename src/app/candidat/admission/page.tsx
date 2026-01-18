'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Slider
} from '@mui/material';
import {
  CheckCircle,
  ArrowBack,
  School,
  Description,
  Event,
  EmojiEvents,
  ArrowForward,
  AccessTime,
  Verified,
  Speed,
  SentimentVerySatisfied,
  SentimentSatisfiedAlt,
  Psychology,
  AssignmentTurnedIn
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ParcoursupJournal from '@/components/candidat/ParcoursupJournal';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionTypography = motion.create(Typography);

const colors = {
  primary: '#2D9B94',
  secondary: '#FFD93D',
  primaryDark: '#1F7A72',
  secondaryDark: '#E5C235',
  blue: '#4A90E2',
  purple: '#9C27B0'
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const parcoursupSteps = [
  {
    icon: Event,
    title: 'Inscription',
    date: 'Janvier - Février',
    description: 'Créez votre compte Parcoursup et complétez votre profil',
    details: ['Création du compte', 'Informations personnelles', 'Validation email']
  },
  {
    icon: School,
    title: 'Vœux',
    date: 'Mars - Avril',
    description: 'Formulez jusqu\'à 10 vœux et rédigez vos motivations',
    details: ['Recherche formations', 'Projet motivé', 'Confirmation']
  },
  {
    icon: Description,
    title: 'Tests & Entretien',
    date: 'Avril - Mai',
    description: 'Passez les tests et l\'entretien de motivation',
    details: ['Tests en ligne', 'Entretien 30 min', 'Projet professionnel']
  },
  {
    icon: EmojiEvents,
    title: 'Admission',
    date: 'Juin - Juillet',
    description: 'Recevez votre réponse et finalisez l\'inscription',
    details: ['Proposition', 'Acceptation', 'Inscription définitive']
  }
];

const horsParcoursupSteps = [
  {
    icon: Description,
    title: 'Dossier en ligne',
    date: 'Toute l\'année',
    description: 'Candidature rapide via notre plateforme',
    details: ['Formulaire en ligne', 'CV + Lettre motivation', 'Bulletins récents']
  },
  {
    icon: School,
    title: 'Évaluation',
    date: 'Sous 7 jours',
    description: 'Tests et entretien personnalisé',
    details: ['Tests 1h', 'Entretien 45 min', 'Présentation formations']
  },
  {
    icon: CheckCircle,
    title: 'Réponse express',
    date: 'Sous 48h',
    description: 'Admission rapide et inscription immédiate',
    details: ['Notification email', 'Dossier inscription', 'Confirmation cours']
  }
];

const formations = [
  { name: 'BTS MCO', type: 'parcoursup', desc: 'Management Commercial Opérationnel' },
  { name: 'BTS NDRC', type: 'parcoursup', desc: 'Négociation et Digitalisation' },
  { name: 'BTS COM', type: 'parcoursup', desc: 'Communication' },
  { name: 'BTS SAM', type: 'parcoursup', desc: 'Support à l\'Action Managériale' },
  { name: 'Bachelor Business', type: 'direct', desc: 'Bac+3 Management' },
  { name: 'Bachelor Marketing', type: 'direct', desc: 'Bac+3 Marketing Digital' }
];

const funCopy = {
  parcoursup: [
    { title: 'Level 1: Le Dossier', desc: 'On remplit la paperasse sans pleurer.', emoji: '📂' },
    { title: 'Level 2: Les Vœux', desc: 'On choisit sa vie (pas de pression !).', emoji: '🤞' },
    { title: 'Level 3: L\'Attente', desc: 'On rafraîchit la page 542 fois par jour.', emoji: '🔄' },
    { title: 'Victory!', desc: 'Champomy pour tout le monde !', emoji: '🥂' }
  ],
  direct: [
    { title: 'Speedrun: Le Formulaire', desc: 'Aussi rapide qu\'un post Insta.', emoji: '⚡' },
    { title: 'Boss Fight: L\'Entretien', desc: 'Un café, un sourire, et c\'est gagné.', emoji: '☕' },
    { title: 'GG WP: Admission', desc: 'Welcome to the team, champion(ne).', emoji: '💎' }
  ]
};

const advantages = [
  { icon: Speed, title: 'Réponse rapide', desc: 'Sous 48h pour candidature directe' },
  { icon: Verified, title: 'Formations certifiées', desc: 'Diplômes reconnus par l\'État' },
  { icon: AccessTime, title: 'Toute l\'année', desc: 'Admissions ouvertes en continu' }
];

export default function AdmissionPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<'parcoursup' | 'direct' | null>(null);
  const [isFunMode, setIsFunMode] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(true);
  const [diagResult, setDiagResult] = useState<'parcoursup' | 'direct' | null>(null);
  const [scrubStep, setScrubStep] = useState(0);
  const parcoursupRef = useRef<HTMLDivElement>(null);
  const directRef = useRef<HTMLDivElement>(null);

  const handleSetPath = (path: 'parcoursup' | 'direct' | null) => {
    setSelectedPath(path);
    setScrubStep(0);
    if (path) {
      setTimeout(() => {
        const ref = path === 'parcoursup' ? parcoursupRef : directRef;
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleDiagnostic = (reponse: string) => {
    if (reponse === 'bac') {
      setDiagResult('parcoursup');
      setSelectedPath('parcoursup');
    } else {
      setDiagResult('direct');
      setSelectedPath('direct');
    }
    setShowDiagnostic(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>

      <Box
        sx={{
          background: isFunMode
            ? `linear-gradient(135deg, ${colors.purple} 0%, ${colors.primary} 100%)`
            : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 50%, ${colors.secondary} 100%)`,
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.5s ease'
        }}
      >
        <Box sx={{ position: 'absolute', top: 100, right: 20, zIndex: 10 }}>
          <Button
            variant="contained"
            onClick={() => setIsFunMode(!isFunMode)}
            sx={{
              background: isFunMode ? colors.secondary : 'rgba(255,255,255,0.2)',
              color: isFunMode ? '#1a1a2e' : '#fff',
              fontWeight: 800,
              borderRadius: 4
            }}
            startIcon={isFunMode ? <SentimentVerySatisfied /> : <SentimentSatisfiedAlt />}
          >
            {isFunMode ? 'Mode Fun : ON 🚀' : 'Activer Mode Fun ?'}
          </Button>
        </Box>
        <MotionBox
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 40, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity } }}
          sx={{
            position: 'absolute',
            top: '-30%',
            right: '-15%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/candidat')}
              sx={{
                color: '#fff',
                mb: 4,
                '&:hover': { background: 'rgba(255,255,255,0.1)' }
              }}
            >
              Retour
            </Button>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}
          >
            <Chip
              label="Parcours d'admission"
              sx={{
                mb: 3,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                color: '#fff',
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 2,
                textShadow: '0 2px 20px rgba(0,0,0,0.15)'
              }}
            >
              {isFunMode ? 'On t\'embarque dans l\'aventure ! 🎢' : 'Deux voies d\'accès à votre avenir 🎓'}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.7
              }}
            >
              {isFunMode
                ? 'Pas de stress, on va t\'expliquer comment ça marche sans jargon pompeux.'
                : 'Choisissez le parcours qui correspond à votre situation : via Parcoursup ou en candidature directe'}
            </Typography>

            {showDiagnostic && (
              <MotionCard
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                sx={{ mt: 4, borderRadius: 6, p: 3, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: colors.primary }}>🧠 Aide-moi à te guider :</Typography>
                <Typography sx={{ mb: 3 }}>Quel est ton profil actuel ?</Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="outlined" onClick={() => handleDiagnostic('bac')} sx={{ borderRadius: 3, py: 1.5, px: 3 }}>Je passe mon Bac (Terminale)</Button>
                  <Button variant="outlined" onClick={() => handleDiagnostic('reorient')} sx={{ borderRadius: 3, py: 1.5, px: 3 }}>Je suis déjà diplômé ou en réorientation</Button>
                </Box>
              </MotionCard>
            )}

            {diagResult && !showDiagnostic && (
              <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ mt: 3 }}>
                <Chip
                  icon={<Psychology sx={{ color: '#fff !important' }} />}
                  label={diagResult === 'parcoursup' ? "On te conseille la voie Parcoursup !" : "Le parcours direct est fait pour toi !"}
                  sx={{ background: colors.secondary, color: '#1a1a2e', fontWeight: 700, p: 2 }}
                />
                <Button
                  size="small"
                  onClick={() => { setShowDiagnostic(true); setDiagResult(null); }}
                  sx={{ ml: 2, color: '#fff', textDecoration: 'underline', fontWeight: 700 }}
                >
                  Changer mon profil ?
                </Button>
              </MotionBox>
            )}
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionCard
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, boxShadow: `0 25px 60px ${colors.blue}30` }}
              onClick={() => handleSetPath(selectedPath === 'parcoursup' ? null : 'parcoursup')}
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                border: selectedPath === 'parcoursup' ? `3px solid ${colors.blue}` : '3px solid transparent',
                background: '#fff',
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
            >
              <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.blue}, #2196F3)` }} />
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}
                  >
                    📋
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.blue }}>
                      Via Parcoursup
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                      Formations post-bac ESB
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ color: '#555', mb: 3, lineHeight: 1.7 }}>
                  Pour les bacheliers souhaitant intégrer nos BTS en formation initiale via la plateforme nationale.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {formations.filter(f => f.type === 'parcoursup').map((f, i) => (
                    <Chip
                      key={i}
                      label={f.name}
                      size="small"
                      sx={{ background: `${colors.blue}15`, color: colors.blue, fontWeight: 600 }}
                    />
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant={selectedPath === 'parcoursup' ? 'contained' : 'outlined'}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    ...(selectedPath === 'parcoursup' ? {
                      background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`,
                      color: '#fff'
                    } : {
                      borderColor: colors.blue,
                      color: colors.blue
                    })
                  }}
                >
                  {selectedPath === 'parcoursup' ? 'Masquer les étapes' : 'Voir les étapes'}
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MotionCard
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, boxShadow: `0 25px 60px ${colors.primary}30` }}
              onClick={() => handleSetPath(selectedPath === 'direct' ? null : 'direct')}
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                border: selectedPath === 'direct' ? `3px solid ${colors.primary}` : '3px solid transparent',
                background: '#fff',
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
            >
              <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }} />
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}
                  >
                    🎓
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary }}>
                      Candidature directe
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                      Formations BF & BBS
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ color: '#555', mb: 3, lineHeight: 1.7 }}>
                  Processus simplifié avec réponse sous 48h. Idéal pour les reconversions et étudiants hors Parcoursup.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {formations.filter(f => f.type === 'direct').map((f, i) => (
                    <Chip
                      key={i}
                      label={f.name}
                      size="small"
                      sx={{ background: `${colors.primary}15`, color: colors.primary, fontWeight: 600 }}
                    />
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant={selectedPath === 'direct' ? 'contained' : 'outlined'}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    ...(selectedPath === 'direct' ? {
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      color: '#fff'
                    } : {
                      borderColor: colors.primary,
                      color: colors.primary
                    })
                  }}
                >
                  {selectedPath === 'direct' ? 'Masquer les étapes' : 'Voir les étapes'}
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {selectedPath === 'parcoursup' && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            sx={{ mt: 4 }}
            ref={parcoursupRef}
          >
            <Card sx={{ borderRadius: 4, border: `2px solid ${colors.blue}`, overflow: 'hidden' }}>
              <Box sx={{ background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`, py: 3, px: 4 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  📈 Journal de bord Parcoursup
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <ParcoursupJournal />

                <Box sx={{ mt: 6, pt: 6, borderTop: '1px solid #eee' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.blue, textAlign: 'center', mb: 2 }}>
                    {isFunMode ? 'GLISSE BILLIBOT POUR VOIR LA SUITE ! 🤖' : 'GLISSEZ POUR DÉCOUVRIR LES ÉTAPES DÉTAILLÉES ! 🤖'}
                  </Typography>
                  <Box sx={{ px: 4, position: 'relative', mb: 6 }}>
                    <Slider
                      defaultValue={0}
                      step={1}
                      marks={(isFunMode ? funCopy.parcoursup : parcoursupSteps).map((_, i) => ({ value: i, label: `${i + 1}` }))}
                      min={0}
                      max={(isFunMode ? funCopy.parcoursup : parcoursupSteps).length - 1}
                      onChange={(_, val) => setScrubStep(val as number)}
                      sx={{
                        color: colors.blue,
                        height: 6,
                        '& .MuiSlider-thumb': {
                          width: 50,
                          height: 50,
                          backgroundColor: '#fff',
                          border: `4px solid ${colors.blue}`,
                          '&:hover': { boxShadow: `0 0 0 10px ${colors.blue}22` },
                          '&::after': {
                            content: `"${scrubStep + 1} 🤖"`,
                            fontSize: '1.2rem',
                            fontWeight: 900,
                            color: colors.blue
                          }
                        },
                        '& .MuiSlider-markLabel': {
                          fontWeight: 800,
                          color: colors.blue,
                          top: 45
                        }
                      }}
                    />
                  </Box>

                  <AnimatePresence mode="wait">
                    <MotionBox
                      key={scrubStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.5)',
                        border: `1px solid ${colors.blue}33`
                      }}
                    >
                      {(() => {
                        const step = (isFunMode ? funCopy.parcoursup : parcoursupSteps)[scrubStep];
                        if (!step) return null;
                        return (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{
                                width: 50, height: 50, borderRadius: 3,
                                background: isFunMode ? colors.purple : `linear-gradient(135deg, ${colors.blue}, #2196F3)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                {(() => {
                                  const stepAny = step as any;
                                  if (isFunMode) return stepAny.emoji;
                                  const StepIcon = stepAny.icon;
                                  return StepIcon ? <StepIcon sx={{ color: '#fff' }} /> : null;
                                })()}
                              </Box>
                              <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{step.title}</Typography>
                                {(step as any).date && <Chip label={(step as any).date} size="small" sx={{ background: `${colors.blue}30`, fontWeight: 700 }} />}
                              </Box>
                            </Box>
                            <Typography sx={{ color: '#444', fontSize: '1.1rem', mb: 3 }}>
                              {(step as any).description || (step as any).desc}
                            </Typography>
                            {!isFunMode && (step as any).details && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                {(step as any).details.map((d: string, i: number) => (
                                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, px: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #eee' }}>
                                    <CheckCircle sx={{ fontSize: 18, color: colors.blue }} />
                                    <Typography sx={{ fontWeight: 600, color: '#555' }}>{d}</Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Box>
                        );
                      })()}
                    </MotionBox>
                  </AnimatePresence>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    href="https://www.parcoursup.fr"
                    target="_blank"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: isFunMode ? colors.purple : `linear-gradient(135deg, ${colors.blue}, #2196F3)`,
                      fontWeight: 700,
                      px: 5,
                      py: 1.5,
                      borderRadius: 3
                    }}
                  >
                    {isFunMode ? 'On y va ? Go !' : 'Accéder à Parcoursup'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </MotionBox>
        )}

        {selectedPath === 'direct' && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            sx={{ mt: 4 }}
            ref={directRef}
          >
            <Card sx={{ borderRadius: 4, border: isFunMode ? `2px solid ${colors.purple}` : `2px solid ${colors.primary}`, overflow: 'hidden' }}>
              <Box sx={{ background: isFunMode ? colors.purple : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, py: 3, px: 4 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  {isFunMode ? '🏃‍♂️ Le Speedrun Direct' : '🎓 Processus de candidature directe'}
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ mb: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.primary, textAlign: 'center', mb: 2 }}>
                    GLISSE BILLIBOT POUR DÉCOUVRIR LES ÉTAPES ! 🤖
                  </Typography>
                  <Box sx={{ px: 4, position: 'relative' }}>
                    <Slider
                      defaultValue={0}
                      step={1}
                      marks={(isFunMode ? funCopy.direct : horsParcoursupSteps).map((_, i) => ({ value: i, label: `${i + 1}` }))}
                      min={0}
                      max={(isFunMode ? funCopy.direct : horsParcoursupSteps).length - 1}
                      onChange={(_, val) => setScrubStep(val as number)}
                      sx={{
                        color: colors.primary,
                        height: 6,
                        '& .MuiSlider-thumb': {
                          width: 50,
                          height: 50,
                          backgroundColor: '#fff',
                          border: `4px solid ${colors.primary}`,
                          '&:hover': { boxShadow: `0 0 0 10px ${colors.primary}22` },
                          '&::after': {
                            content: `"${scrubStep + 1} 🤖"`,
                            fontSize: '1.2rem',
                            fontWeight: 900,
                            color: colors.primary
                          }
                        },
                        '& .MuiSlider-markLabel': {
                          fontWeight: 800,
                          color: colors.primary,
                          top: 45
                        }
                      }}
                    />
                  </Box>
                </Box>

                <AnimatePresence mode="wait">
                  <MotionBox
                    key={scrubStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.5)',
                      border: `1px solid ${colors.primary}33`
                    }}
                  >
                    {(() => {
                      const step = (isFunMode ? funCopy.direct : horsParcoursupSteps)[scrubStep];
                      return (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{
                              width: 50, height: 50, borderRadius: 3,
                              background: isFunMode ? colors.purple : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {(() => {
                                const stepAny = step as any;
                                if (isFunMode) return stepAny.emoji;
                                const StepIcon = stepAny.icon;
                                return StepIcon ? <StepIcon sx={{ color: '#fff' }} /> : null;
                              })()}
                            </Box>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 800 }}>{step.title}</Typography>
                              {(step as any).date && <Chip label={(step as any).date} size="small" sx={{ background: `${colors.secondary}30`, fontWeight: 700 }} />}
                            </Box>
                          </Box>
                          <Typography sx={{ color: '#444', fontSize: '1.1rem', mb: 3 }}>
                            {(step as any).description || (step as any).desc}
                          </Typography>
                          {!isFunMode && (step as any).details && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              {(step as any).details.map((d: string, i: number) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, px: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #eee' }}>
                                  <CheckCircle sx={{ fontSize: 18, color: colors.primary }} />
                                  <Typography sx={{ fontWeight: 600, color: '#555' }}>{d}</Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      );
                    })()}
                  </MotionBox>
                </AnimatePresence>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/candidat/contact')}
                    endIcon={<ArrowForward />}
                    sx={{
                      background: isFunMode ? colors.purple : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      fontWeight: 700,
                      px: 5,
                      py: 1.5,
                      borderRadius: 3
                    }}
                  >
                    {isFunMode ? 'Start Now !' : 'Candidater maintenant'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </MotionBox>
        )}
      </Container>


      <Box sx={{ py: { xs: 6, md: 10 }, background: '#F4F7F6' }}>
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1a1a2e' }}>
              {isFunMode ? 'Pourquoi la Billi-Team est au top ? ✨' : 'Pourquoi nous choisir ?'}
            </Typography>
          </MotionBox>

          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={4}>
              {advantages.map((adv, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <MotionBox
                    variants={fadeInUp}
                    whileHover={{ y: -5, scale: 1.02 }}
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      borderRadius: 4,
                      background: '#fff',
                      border: '1px solid #eee',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Box sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <adv.icon sx={{ fontSize: 35, color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{adv.title}</Typography>
                    <Typography sx={{ color: '#666' }}>{adv.desc}</Typography>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        </Container>
      </Box>

      <Box sx={{
        py: { xs: 6, md: 8 },
        background: isFunMode
          ? `linear-gradient(135deg, ${colors.purple}, ${colors.primaryDark})`
          : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>
              {isFunMode ? 'On discute de ton avenir ? 📞' : '💬 Besoin d\'aide pour choisir ?'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontSize: '1.1rem' }}>
              {isFunMode ? 'Nos coachs sont là pour toi (et ils ne mordent pas !)' : 'Notre équipe vous accompagne dans votre parcours'}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/candidat/contact')}
              endIcon={<ArrowForward />}
              sx={{
                background: colors.secondary,
                color: '#1a1a2e',
                fontWeight: 700,
                px: 5,
                py: 1.5,
                borderRadius: 3,
                '&:hover': { background: colors.secondaryDark }
              }}
            >
              Candidater / Poser une question
            </Button>
          </MotionBox>
        </Container>
      </Box>

    </Box>
  );
}
