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
  Chip,
  Tooltip
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
  ArrowForward,
  AssignmentTurnedIn
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';

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
    name: 'Raconter une expérience (en 4 étapes)',
    coachTip: '🌟 "Salut ! Je t\'aide à structurer une expérience vécue pour qu\'elle soit percutante."',
    miniExample: 'Ex. : J’ai mené un projet de vente (Situation) / Objectif : convaincre 10 clients (Tâche) / J’ai organisé des démonstrations (Action) / Résultat : 12 ventes ! (Résultat)',
    steps: [
      { label: 'Situation', desc: '🪄 Décris-moi ta situation récente (où, quand ?)', icon: '📍' },
      { label: 'Task', desc: '🎯 Quel était ton objectif ou le problème à régler ?', icon: '🎯' },
      { label: 'Action', desc: '⚡ Raconte-moi exactement ce que TU as fait.', icon: '⚡' },
      { label: 'Result', desc: '🏆 Quel a été le résultat et qu\'en as-tu appris ?', icon: '🏆' }
    ]
  },
  '3C': {
    name: 'Se présenter (en 3 axes)',
    coachTip: '🎯 "Idéale pour te présenter ! On va faire court, humain et mémorable."',
    miniExample: 'Parle-moi de toi, de tes compétences et de ton objectif pro pour demain.',
    steps: [
      { label: 'Contexte', desc: '📽️ Qui es-tu et d\'où viens-tu en quelques mots ?', icon: '📽️' },
      { label: 'Compétences', desc: '🛠️ Quelles sont tes 3 forces pour cette école ?', icon: '🛠️' },
      { label: 'Cible', desc: '🎯 Pourquoi veux-tu nous rejoindre demain ?', icon: '🎯' }
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

  // Wizard States
  const [wizardStep, setWizardStep] = useState(0); // 0: Mode, 1: Guidance, 2: Action
  const [selectedMode, setSelectedMode] = useState<'simulation' | 'pitch30' | 'pitch60' | null>(null);
  const [needsGuidance, setNeedsGuidance] = useState<boolean | null>(null);

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
      <Breadcrumbs />
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
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1rem', md: '1.2rem' }, mb: 2 }}>
              Coaching personnalisé pour réussir ton entretien de motivation
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              🎯 L'entraînement régulier réduit le stress de 80%. BilliBot est là pour vous faire progresser.
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

        <Box sx={{ mb: 10 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>📝 Ton "Projet Motivé" Express</Typography>
                <Typography sx={{ color: '#666', mb: 4 }}>Prépare ton entretien en structurant tes motivations. Choisis ta filière pour t'en inspirer :</Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                  {['Business/Vente', 'Communication', 'International'].map(topic => (
                    <Button
                      key={topic}
                      variant="outlined"
                      onClick={() => alert(`Génération du template pour ${topic}... (Ceci est une simulation)`)}
                      sx={{ borderRadius: 3, border: `2px solid ${colors.primary}`, color: colors.primary, fontWeight: 700 }}
                    >
                      {topic}
                    </Button>
                  ))}
                </Box>

                <Card sx={{ bgcolor: '#f9f9f9', border: '1px dashed #ccc', p: 3, borderRadius: 4 }}>
                  <Typography variant="subtitle2" sx={{ color: colors.primary, fontWeight: 800, mb: 1 }}>STRUCTURE CONSEILLÉE :</Typography>
                  <Box component="ul" sx={{ pl: 2, color: '#555' }}>
                    <li><strong>Moi :</strong> Mon parcours actuel et mes passions.</li>
                    <li><strong>Vous :</strong> Pourquoi cette école précisément ?</li>
                    <li><strong>Nous :</strong> Ce que je vais apporter à la classe.</li>
                  </Box>
                </Card>
              </MotionBox>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>📁 Dossier de motivation</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    'Bulletins de 1ère et Terminale',
                    'CV à jour (utilisez nos conseils !)',
                    'Pièce d\'identité',
                    'Avis de poursuite d\'études'
                  ].map((doc, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#FAFBFF', borderRadius: 3, border: '1px solid #eee' }}>
                      <AssignmentTurnedIn sx={{ color: colors.primary }} />
                      <Typography sx={{ fontWeight: 600 }}>{doc}</Typography>
                    </Box>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Box>

        <AnimatePresence mode="wait">
          {wizardStep === 0 && (
            <MotionBox key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Box sx={{ p: 4, borderRadius: 6, bgcolor: 'rgba(45, 155, 148, 0.05)', border: '2px dashed rgba(45, 155, 148, 0.2)', mb: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>🎯 ÉTAPE 1 : Ton Mode d'Entraînement</Typography>
                <Typography sx={{ textAlign: 'center', color: '#666', mb: 4 }}>Quelle interface te rassure le plus pour aujourd'hui ?</Typography>

                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <MotionCard
                      whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      onClick={() => { setSelectedMode('simulation'); setWizardStep(1); }}
                      sx={{ p: 3, cursor: 'pointer', height: '100%', borderRadius: 4, textAlign: 'center', border: selectedMode === 'simulation' ? `2px solid ${colors.primary}` : '2px solid transparent' }}
                    >
                      <Typography sx={{ fontSize: '3rem', mb: 2 }}>🎭</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Entraînement réel</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>Simulation complète avec caméra pour une immersion totale.</Typography>
                    </MotionCard>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <MotionCard
                      whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      onClick={() => { setSelectedMode('pitch30'); setWizardStep(1); }}
                      sx={{ p: 3, cursor: 'pointer', height: '100%', borderRadius: 4, textAlign: 'center', border: selectedMode === 'pitch30' ? `2px solid ${colors.primary}` : '2px solid transparent' }}
                    >
                      <Typography sx={{ fontSize: '3rem', mb: 2 }}>⚡</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Présentation rapide</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>30 secondes pour aller à l'essentiel sans stress.</Typography>
                    </MotionCard>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <MotionCard
                      whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      onClick={() => { setSelectedMode('pitch60'); setWizardStep(1); }}
                      sx={{ p: 3, cursor: 'pointer', height: '100%', borderRadius: 4, textAlign: 'center', border: selectedMode === 'pitch60' ? `2px solid ${colors.primary}` : '2px solid transparent' }}
                    >
                      <Typography sx={{ fontSize: '3rem', mb: 2 }}>📚</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Présentation complète</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>1 minute pour détailler ton parcours et ton projet.</Typography>
                    </MotionCard>
                  </Grid>
                </Grid>
              </Box>
            </MotionBox>
          )}

          {wizardStep === 1 && (
            <MotionBox key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Box sx={{ p: 4, borderRadius: 6, bgcolor: '#fff', border: '1px solid #eee', mb: 8, textAlign: 'center', position: 'relative' }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => setWizardStep(0)}
                  sx={{
                    position: { xs: 'relative', md: 'absolute' },
                    left: 20,
                    top: 20,
                    mb: { xs: 2, md: 0 },
                    bgcolor: 'rgba(0,0,0,0.05)',
                    px: 2,
                    borderRadius: 2,
                    fontWeight: 700,
                    color: '#666',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
                  }}
                >
                  Changer de mode
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, mt: { xs: 0, md: 4 } }}>🤖 ÉTAPE 2 : Veux-tu être guidé(e) ?</Typography>
                <Typography sx={{ color: '#666', mb: 4 }}>Je peux t'aider à structurer ta pensée avant de te lancer.</Typography>

                <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                  <MotionCard
                    whileHover={{ scale: 1.05 }}
                    onClick={() => { setNeedsGuidance(true); setWizardStep(2); }}
                    sx={{ p: 4, cursor: 'pointer', width: 250, borderRadius: 4, border: `2px solid ${colors.primary}`, bgcolor: 'rgba(45, 155, 148, 0.05)' }}
                  >
                    <CheckCircle sx={{ fontSize: '3rem', color: colors.primary, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Oui, aide-moi !</Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>Utilise mes guides pas-à-pas (Récit ou Pitch).</Typography>
                  </MotionCard>

                  <MotionCard
                    whileHover={{ scale: 1.05 }}
                    onClick={() => { setNeedsGuidance(false); setWizardStep(2); setActiveTemplate(null); }}
                    sx={{ p: 4, cursor: 'pointer', width: 250, borderRadius: 4, border: '2px solid #eee' }}
                  >
                    <PlayArrow sx={{ fontSize: '3rem', color: '#666', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Non, je gère !</Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>Passe directement à l'entraînement libre.</Typography>
                  </MotionCard>
                </Box>
              </Box>
            </MotionBox>
          )}

          {wizardStep === 2 && (
            <MotionBox key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Box sx={{ p: 4, borderRadius: 6, bgcolor: '#fff', border: '1px solid #eee', mb: 8, position: 'relative' }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => setWizardStep(1)}
                  sx={{
                    position: { xs: 'relative', md: 'absolute' },
                    left: 20,
                    top: 20,
                    mb: { xs: 2, md: 0 },
                    bgcolor: 'rgba(0,0,0,0.05)',
                    px: 2,
                    borderRadius: 2,
                    fontWeight: 700,
                    color: '#666',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
                  }}
                >
                  Retour
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', mt: { xs: 0, md: 4 } }}>🔥 ÉTAPE 3 : Passage à l'acte</Typography>
                <Typography sx={{ textAlign: 'center', color: '#666', mb: 4 }}>
                  {needsGuidance ? "Choisis ton guide et suis BilliBot !" : "Tu es prêt(e). Respire un grand coup et lance-toi !"}
                </Typography>

                {needsGuidance && (
                  <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
                      {Object.keys(templates).map(t => (
                        <Tooltip key={t} title={templates[t as keyof typeof templates].miniExample} arrow placement="top">
                          <Button
                            variant={activeTemplate === t ? 'contained' : 'outlined'}
                            onClick={() => setActiveTemplate(t as any)}
                            sx={{ minWidth: 200, py: 1.5, borderRadius: 3, fontWeight: 800, textTransform: 'none' }}
                          >
                            {templates[t as keyof typeof templates].name}
                          </Button>
                        </Tooltip>
                      ))}
                    </Box>

                    {activeTemplate && (
                      <MotionBox initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} sx={{ p: 3, bgcolor: '#FAFBFF', borderRadius: 4, border: `2px solid ${colors.primary}33` }}>
                        <Typography sx={{ textAlign: 'center', mb: 4, fontSize: '1.2rem', fontWeight: 800, color: colors.primaryDark }}>
                          {templates[activeTemplate].coachTip}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, justifyContent: 'center' }}>
                          {templates[activeTemplate].steps.map((s, i) => (
                            <Box key={i} sx={{ minWidth: 160, p: 3, bgcolor: '#fff', borderRadius: 4, textAlign: 'center', border: `2px solid ${colors.primary}11`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                              <Typography sx={{ fontSize: '2rem', mb: 1 }}>{s.icon}</Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: colors.primary, mb: 0.5 }}>{s.label}</Typography>
                              <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.3, fontWeight: 500 }}>{s.desc}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </MotionBox>
                    )}
                  </Box>
                )}

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  {selectedMode === 'simulation' ? (
                    <Button variant="contained" size="large" onClick={startSimulation} sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, px: 8, py: 2, borderRadius: 4, fontWeight: 900, fontSize: '1.2rem' }}>
                      LANCER L'ENTRAÎNEMENT RÉEL 🎯
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={selectedMode === 'pitch30' ? (timer30 / 30) * 100 : (timer60 / 60) * 100}
                          size={120}
                          thickness={6}
                          sx={{ color: selectedMode === 'pitch30' ? getTimerColor(timer30, 30) : getTimerColor(timer60, 60) }}
                        />
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 900 }}>{selectedMode === 'pitch30' ? timer30 : timer60}s</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={selectedMode === 'pitch30' ? () => setIsRunning30(!isRunning30) : () => setIsRunning60(!isRunning60)}
                          sx={{ background: (selectedMode === 'pitch30' ? isRunning30 : isRunning60) ? colors.pink : colors.primary, px: 6, borderRadius: 3 }}
                        >
                          {(selectedMode === 'pitch30' ? isRunning30 : isRunning60) ? 'STOPPER' : 'DÉMARRER LE CHRONO'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={selectedMode === 'pitch30' ? () => setTimer30(30) : () => setTimer60(60)}
                          sx={{ borderRadius: 3 }}
                        >
                          RESET
                        </Button>
                      </Box>
                      {((selectedMode === 'pitch30' && timer30 === 0) || (selectedMode === 'pitch60' && timer60 === 0)) && (
                        <Button variant="contained" sx={{ mt: 2, bgcolor: colors.secondary, color: '#000' }} onClick={() => setFeedbackOpen(true)}>Voir l'analyse 🏆</Button>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

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
