'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Snackbar,
  Alert,
  Avatar,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  School,
  Email,
  CalendarToday,
  LocationOn,
  Phone,
  AccessTime,
  ArrowForward,
  CheckCircle,
  Event as EventIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const salons = [
  {
    name: 'Forum des Métiers',
    date: '15 Janvier 2026',
    lieu: 'Toulouse',
    description: 'Rencontre avec les professionnels de l\'orientation',
    color: colors.pink
  },
  {
    name: 'Journée Portes Ouvertes',
    date: '24 Janvier 2026',
    lieu: 'Campus de Billières',
    description: 'Visite guidée, rencontre enseignants et étudiants',
    color: colors.primary
  },
  {
    name: 'Salon Studyrama',
    date: '7 Février 2026',
    lieu: 'Toulouse',
    description: 'Stand BilliBot - Venez nous rencontrer',
    color: colors.blue
  }
];

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    date: '',
    message: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Wizard States
  const [wizardStep, setWizardStep] = useState(0); // 0: Need Selection, 1: Action, 2: Confirmation
  const [selectedNeed, setSelectedNeed] = useState<'visite' | 'discuter' | 'evenements' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWizardStep(2); // Jump to confirmation step
    setFormData({ prenom: '', nom: '', email: '', date: '', message: '' });
  };

  const isFormValid = formData.prenom && formData.nom && formData.email && formData.date;

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>

      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 50%, ${colors.secondary} 100%)`,
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
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
          <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/candidat')}
              sx={{ color: '#fff', mb: 4, '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
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
              label="Contact Admissions"
              sx={{ mb: 3, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)' }}
            />
            <Typography
              variant="h2"
              sx={{ fontWeight: 900, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
            >
              On reste en contact ? 🤝
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.7 }}>
              Salut ! C'est Candice. Besoin de nous parler ? Je te guide vers la meilleure option pour ton projet.
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1, pb: 8 }}>
        <AnimatePresence mode="wait">
          {wizardStep === 0 && (
            <MotionBox key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Grid container spacing={4} justifyContent="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <MotionCard
                    sx={{ height: '100%', borderRadius: 4, opacity: 0.6, cursor: 'not-allowed', filter: 'grayscale(1)', border: '2px solid #eee' }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <School sx={{ fontSize: 50, color: '#999', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Venir nous voir</Typography>
                      <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>Bientôt disponible ! (Visite du campus)</Typography>
                      <Chip label="Prochainement" size="small" />
                    </CardContent>
                  </MotionCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <MotionCard
                    whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    onClick={() => { setSelectedNeed('discuter'); setWizardStep(1); }}
                    sx={{ height: '100%', borderRadius: 4, cursor: 'pointer', border: `2px solid ${colors.pink}` }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Email sx={{ fontSize: 50, color: colors.pink, mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Discuter avec Candice</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>Une question ? Je te réponds sous 48h (CEO BilliBot).</Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <MotionCard
                    whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    onClick={() => { setSelectedNeed('evenements'); setWizardStep(1); }}
                    sx={{ height: '100%', borderRadius: 4, cursor: 'pointer', border: `2px solid ${colors.blue}` }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <EventIcon sx={{ fontSize: 50, color: colors.blue, mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Nous croiser en vrai</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>Salons et journées portes ouvertes en 2026.</Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
              </Grid>
            </MotionBox>
          )}

          {wizardStep === 1 && (
            <MotionBox key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: '#fff', borderRadius: 6, border: '1px solid #eee', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', position: 'relative' }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => setWizardStep(0)}
                  sx={{
                    position: { xs: 'relative', md: 'absolute' },
                    left: 20, top: 20, mb: { xs: 2, md: 0 },
                    bgcolor: 'rgba(0,0,0,0.05)', px: 2, borderRadius: 2, fontWeight: 700
                  }}
                >
                  Changer d'option
                </Button>

                {selectedNeed === 'discuter' && (
                  <Grid container spacing={6} alignItems="center" sx={{ mt: { xs: 0, md: 2 } }}>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 3, background: `linear-gradient(135deg, ${colors.pink}, #E91E63)`, border: '4px solid #fff', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                          👩‍💼
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: colors.pink }}>Candice Martin</Typography>
                        <Chip label="CEO BilliBot" sx={{ background: colors.pink, color: '#fff', fontWeight: 800, mb: 3 }} />
                        <Typography sx={{ color: '#666', lineHeight: 1.8, mb: 4 }}>
                          Salut ! C'est moi qui ai créé BilliBot. Si tu as une question sur ton orientation ou sur l'app, je suis là pour toi. Je te réponds personnellement sous 48h.
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, background: '#FFF3E0', borderRadius: 3, mb: 2 }}>
                          <Email sx={{ color: colors.pink }} />
                          <Typography sx={{ fontWeight: 700 }}>candice.f.m@gmail.com</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, bgcolor: '#FAFBFF', borderRadius: 4, border: '1px solid #eee' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Envoie-moi ton message 💬</Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Ton prénom" name="prenom" value={formData.prenom} onChange={handleChange} required />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Ton nom" name="nom" value={formData.nom} onChange={handleChange} required />
                          </Grid>
                        </Grid>
                        <TextField fullWidth label="Ton email" name="email" type="email" value={formData.email} onChange={handleChange} sx={{ mt: 2 }} required />
                        <TextField fullWidth label="Ton secret / Ta question" name="message" multiline rows={4} value={formData.message} onChange={handleChange} sx={{ mt: 2, mb: 3 }} required />
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={!isFormValid}
                          fullWidth
                          size="large"
                          endIcon={<ArrowForward />}
                          sx={{ py: 2, borderRadius: 3, background: `linear-gradient(135deg, ${colors.pink}, #E91E63)`, fontWeight: 800 }}
                        >
                          Lancer la discussion 🚀
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {selectedNeed === 'evenements' && (
                  <Box sx={{ mt: { xs: 0, md: 2 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, textAlign: 'center', mb: 1 }}>📅 Nos prochains rendez-vous</Typography>
                    <Typography sx={{ textAlign: 'center', color: '#666', mb: 6 }}>Viens nous dire bonjour sur les salons ou sur le campus !</Typography>

                    <Grid container spacing={3} justifyContent="center">
                      {salons.map((salon, index) => (
                        <Grid key={index} size={{ xs: 12, md: 4 }}>
                          <MotionCard whileHover={{ y: -5 }} sx={{ p: 3, borderRadius: 3, borderLeft: `6px solid ${salon.color}`, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: salon.color, mb: 1 }}>{salon.name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CalendarToday sx={{ fontSize: 18, color: '#999' }} />
                              <Typography sx={{ fontWeight: 700 }}>{salon.date}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <LocationOn sx={{ fontSize: 18, color: '#999' }} />
                              <Typography sx={{ color: '#666' }}>{salon.lieu}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#888' }}>{salon.description}</Typography>
                          </MotionCard>
                        </Grid>
                      ))}
                    </Grid>

                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                      <Button variant="outlined" sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700 }}>Je veux être prévenu(e) du prochain salon 🔔</Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </MotionBox>
          )}

          {wizardStep === 2 && (
            <MotionBox key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ p: 8, textAlign: 'center', bgcolor: '#fff', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                <CheckCircle sx={{ fontSize: 100, color: colors.primary, mb: 4 }} />
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>C'est parti ! 🚀</Typography>
                <Typography variant="h6" sx={{ color: '#666', mb: 6 }}>Candice a bien reçu ton message. Elle va le lire attentivement et te répondre sous 48h sur ton email.</Typography>
                <Button variant="contained" size="large" onClick={() => { setWizardStep(0); setSelectedNeed(null); }} sx={{ px: 6, py: 2, borderRadius: 4, bgcolor: colors.primary, fontWeight: 800 }}>Retour à l'accueil contact</Button>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, textAlign: 'center' }}>
        <Container maxWidth="md">
          <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>
              💬 D'autres questions ?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontSize: '1.1rem' }}>
              N'hésitez pas à nous contacter par email ou téléphone
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip icon={<Email sx={{ color: '#fff !important' }} />} label="admissions@billieres.com" sx={{ py: 2.5, px: 1, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)' }} />
              <Chip icon={<Phone sx={{ color: '#fff !important' }} />} label="05 61 00 00 00" sx={{ py: 2.5, px: 1, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)' }} />
              <Chip icon={<LocationOn sx={{ color: '#fff !important' }} />} label="123 Avenue de Billières, Toulouse" sx={{ py: 2.5, px: 1, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)' }} />
            </Box>
          </MotionBox>
        </Container>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          🎉 Demande envoyée ! Nous vous contactons très bientôt.
        </Alert>
      </Snackbar>
    </Box>
  );
}
