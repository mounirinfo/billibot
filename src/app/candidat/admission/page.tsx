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
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent
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
  Speed
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionTypography = motion.create(Typography);

const colors = {
  primary: '#2D9B94',
  secondary: '#FFD93D',
  primaryDark: '#1F7A72',
  secondaryDark: '#E5C235',
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

const advantages = [
  { icon: Speed, title: 'Réponse rapide', desc: 'Sous 48h pour candidature directe' },
  { icon: Verified, title: 'Formations certifiées', desc: 'Diplômes reconnus par l\'État' },
  { icon: AccessTime, title: 'Toute l\'année', desc: 'Admissions ouvertes en continu' }
];

export default function AdmissionPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<'parcoursup' | 'direct' | null>(null);

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFBFF', overflow: 'hidden' }}>

      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 50%, ${colors.secondary} 100%)`,
          pt: { xs: 4, md: 6 },
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
              Deux voies d'accès à votre avenir 🎓
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.7
              }}
            >
              Choisissez le parcours qui correspond à votre situation : via Parcoursup ou en candidature directe
            </Typography>
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
              onClick={() => setSelectedPath(selectedPath === 'parcoursup' ? null : 'parcoursup')}
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
              onClick={() => setSelectedPath(selectedPath === 'direct' ? null : 'direct')}
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
          >
            <Card sx={{ borderRadius: 4, border: `2px solid ${colors.blue}`, overflow: 'hidden' }}>
              <Box sx={{ background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`, py: 3, px: 4 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  📋 Étapes Parcoursup
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Stepper orientation="vertical">
                  {parcoursupSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                      <Step key={index} active expanded>
                        <StepLabel
                          StepIconComponent={() => (
                            <Box sx={{
                              width: 45,
                              height: 45,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <IconComponent sx={{ color: '#fff', fontSize: 24 }} />
                            </Box>
                          )}
                        >
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                            <Chip label={step.date} size="small" sx={{ mt: 0.5 }} />
                          </Box>
                        </StepLabel>
                        <StepContent>
                          <Typography sx={{ color: '#555', mb: 2 }}>{step.description}</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {step.details.map((d, i) => (
                              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircle sx={{ fontSize: 16, color: colors.blue }} />
                                <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>{d}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </StepContent>
                      </Step>
                    );
                  })}
                </Stepper>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    href="https://www.parcoursup.fr"
                    target="_blank"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: `linear-gradient(135deg, ${colors.blue}, #2196F3)`,
                      fontWeight: 700,
                      px: 5,
                      py: 1.5,
                      borderRadius: 3
                    }}
                  >
                    Accéder à Parcoursup
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
          >
            <Card sx={{ borderRadius: 4, border: `2px solid ${colors.primary}`, overflow: 'hidden' }}>
              <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, py: 3, px: 4 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  🎓 Processus de candidature directe
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Stepper orientation="vertical">
                  {horsParcoursupSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                      <Step key={index} active expanded>
                        <StepLabel
                          StepIconComponent={() => (
                            <Box sx={{
                              width: 45,
                              height: 45,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <IconComponent sx={{ color: '#fff', fontSize: 24 }} />
                            </Box>
                          )}
                        >
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                            <Chip label={step.date} size="small" sx={{ mt: 0.5, background: `${colors.secondary}30` }} />
                          </Box>
                        </StepLabel>
                        <StepContent>
                          <Typography sx={{ color: '#555', mb: 2 }}>{step.description}</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {step.details.map((d, i) => (
                              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircle sx={{ fontSize: 16, color: colors.primary }} />
                                <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>{d}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </StepContent>
                      </Step>
                    );
                  })}
                </Stepper>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/candidat/contact')}
                    endIcon={<ArrowForward />}
                    sx={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      fontWeight: 700,
                      px: 5,
                      py: 1.5,
                      borderRadius: 3
                    }}
                  >
                    Candidater maintenant
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </MotionBox>
        )}
      </Container>

      <Box sx={{ py: { xs: 6, md: 10 }, background: '#fff', mt: 6 }}>
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1a1a2e' }}>
              Pourquoi nous choisir ?
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
                      background: 'linear-gradient(180deg, #FAFBFF, #fff)',
                      border: '1px solid #eee',
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
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>
              💬 Besoin d'aide pour choisir ?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontSize: '1.1rem' }}>
              Notre équipe vous accompagne dans votre parcours
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
              Contacter un conseiller
            </Button>
          </MotionBox>
        </Container>
      </Box>

    </Box>
  );
}
