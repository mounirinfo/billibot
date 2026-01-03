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
  Event as EventIcon
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const salons = [
  {
    name: 'Journée Portes Ouvertes',
    date: '15 Février 2025',
    lieu: 'Campus de Billières',
    description: 'Visite guidée, rencontre enseignants et étudiants',
    color: colors.primary
  },
  {
    name: 'Salon Studyrama',
    date: '8 Mars 2025',
    lieu: 'Parc des Expositions',
    description: 'Stand n°42 - Venez nous rencontrer',
    color: colors.blue
  },
  {
    name: 'Forum de l\'Orientation',
    date: '22 Mars 2025',
    lieu: 'Centre des Congrès',
    description: 'Présentation des formations',
    color: colors.pink
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenSnackbar(true);
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
              Prenez contact avec nous 📅
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.7 }}>
              Visite du campus, rendez-vous personnalisé ou événements : nous sommes là pour vous
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1, pb: 8 }}>
        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <Grid container spacing={4}>

            <Grid size={{ xs: 12, md: 4 }}>
              <MotionCard
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                sx={{ height: '100%', borderRadius: 4, border: `2px solid ${colors.primary}`, overflow: 'hidden' }}
              >
                <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryDark})` }} />
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{
                    width: 70, height: 70, borderRadius: 3,
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, mx: 'auto'
                  }}>
                    <School sx={{ fontSize: 35, color: '#fff' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: colors.primary }}>
                    🏫 Visite du campus
                  </Typography>
                  <Typography sx={{ color: '#666', mb: 3, textAlign: 'center', fontSize: '0.95rem' }}>
                    Découvrez nos locaux et rencontrez nos équipes
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} sx={{ mb: 2 }} required size="small" />
                    <TextField fullWidth label="Nom" name="nom" value={formData.nom} onChange={handleChange} sx={{ mb: 2 }} required size="small" />
                    <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} required size="small" />
                    <TextField fullWidth label="Date souhaitée" name="date" type="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} required size="small" />
                    <TextField fullWidth label="Message (optionnel)" name="message" multiline rows={2} value={formData.message} onChange={handleChange} sx={{ mb: 3 }} size="small" />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={!isFormValid}
                      endIcon={<ArrowForward />}
                      sx={{ py: 1.5, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, fontWeight: 600, borderRadius: 2 }}
                    >
                      Demander une visite
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MotionCard
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                sx={{ height: '100%', borderRadius: 4, border: `2px solid ${colors.pink}`, overflow: 'hidden' }}
              >
                <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.pink}, #E91E63)` }} />
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2, background: `linear-gradient(135deg, ${colors.pink}, #E91E63)`, fontSize: 40 }}>
                      👩‍💼
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: colors.pink }}>
                      Olivia Bouche
                    </Typography>
                    <Chip label="Responsable Admissions" sx={{ background: colors.pink, color: '#fff', fontWeight: 600 }} />
                  </Box>

                  <Typography sx={{ color: '#666', mb: 3, textAlign: 'center', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    Olivia vous accompagne dans votre projet d'orientation et répond à toutes vos questions.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, background: '#FFF3E0', borderRadius: 2 }}>
                      <Email sx={{ color: colors.pink }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Email</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>o.bouche@billieres.com</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, background: '#E8F5E9', borderRadius: 2 }}>
                      <AccessTime sx={{ color: colors.primary }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Disponibilité</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Lun - Ven : 9h - 18h</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    href="mailto:o.bouche@billieres.com"
                    endIcon={<ArrowForward />}
                    sx={{ py: 1.5, mb: 2, background: `linear-gradient(135deg, ${colors.pink}, #E91E63)`, fontWeight: 600, borderRadius: 2 }}
                  >
                    Envoyer un email
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ py: 1.5, borderColor: colors.pink, color: colors.pink, fontWeight: 600, borderRadius: 2 }}
                  >
                    Prendre RDV (Calendly)
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MotionCard
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                sx={{ height: '100%', borderRadius: 4, border: `2px solid ${colors.blue}`, overflow: 'hidden' }}
              >
                <Box sx={{ height: 6, background: `linear-gradient(90deg, ${colors.blue}, #2196F3)` }} />
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{
                    width: 70, height: 70, borderRadius: 3,
                    background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, mx: 'auto'
                  }}>
                    <EventIcon sx={{ fontSize: 35, color: '#fff' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: colors.blue }}>
                    📅 Événements & Salons
                  </Typography>
                  <Typography sx={{ color: '#666', mb: 3, textAlign: 'center', fontSize: '0.95rem' }}>
                    Rencontrez-nous lors de nos prochains événements
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    {salons.map((salon, index) => (
                      <MotionBox
                        key={index}
                        whileHover={{ x: 5 }}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          borderLeft: `4px solid ${salon.color}`,
                          background: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, color: salon.color, fontSize: '0.95rem' }}>
                          {salon.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 14, color: '#999' }} />
                          <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>{salon.date}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: 14, color: '#999' }} />
                          <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>{salon.lieu}</Typography>
                        </Box>
                      </MotionBox>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{ py: 1.5, background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`, fontWeight: 600, borderRadius: 2 }}
                  >
                    S'inscrire à un événement
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </MotionBox>
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
