'use client';

import { Container, Grid, Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { Explore, School, Mic, Phone, ArrowForward, CheckCircle, KeyboardArrowDown } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef, MouseEvent } from 'react';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button);

const colors = {
  primary: '#2D9B94',
  secondary: '#FFD93D',
  primaryDark: '#1F7A72',
  secondaryDark: '#E5C235',
  gradient: 'linear-gradient(135deg, #2D9B94 0%, #FFD93D 100%)',
  gradientReverse: 'linear-gradient(135deg, #FFD93D 0%, #2D9B94 100%)'
};

const modules = [
  {
    icon: Explore,
    title: 'Orientation Express',
    emoji: '🧭',
    description: 'Découvrez votre formation idéale en 3 minutes grâce à notre algorithme intelligent.',
    features: ['Test de personnalité', 'Recommandations IA', 'Matching formations'],
    color: colors.primary,
    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    glowColor: 'rgba(45, 155, 148, 0.4)',
    link: '/candidat/orientation'
  },
  {
    icon: School,
    title: 'Parcours d\'admission',
    emoji: '🧾',
    description: 'Naviguez sereinement entre Parcoursup et les procédures hors plateforme.',
    features: ['Guide Parcoursup', 'Candidature simplifiée', 'Suivi en temps réel'],
    color: colors.secondary,
    gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`,
    glowColor: 'rgba(255, 217, 61, 0.4)',
    textColor: '#1a1a2e',
    link: '/candidat/admission'
  },
  {
    icon: Mic,
    title: 'Préparation Entretien',
    emoji: '🎤',
    description: 'Entraînez-vous avec notre simulateur d\'entretien alimenté par l\'IA.',
    features: ['Simulation IA', 'Feedback instantané', 'Questions types'],
    color: colors.primary,
    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    glowColor: 'rgba(45, 155, 148, 0.4)',
    link: '/candidat/entretien'
  },
  {
    icon: Phone,
    title: 'Contact Admissions',
    emoji: '📅',
    description: 'Planifiez une visite du campus ou un rendez-vous avec notre équipe.',
    features: ['Visite campus', 'RDV personnalisé', 'Chat en direct'],
    color: colors.secondary,
    gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`,
    glowColor: 'rgba(255, 217, 61, 0.4)',
    textColor: '#1a1a2e',
    link: '/candidat/contact'
  }
];

function TiltCard({ module, index }: { module: typeof modules[0]; index: number }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseEnter = () => scale.set(1.03);
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const delays = [0, 0.15, 0.3, 0.45];

  return (
    <MotionBox
      ref={cardRef}
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          duration: 0.8,
          delay: delays[index],
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      viewport={{ once: true, amount: 0.2 }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          borderRadius: 5,
          border: '2px solid transparent',
          background: '#fff',
          overflow: 'visible',
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          transition: 'border-color 0.3s, box-shadow 0.5s',
          transformStyle: 'preserve-3d',
          '&:hover': {
            borderColor: module.color,
            boxShadow: `0 35px 80px ${module.glowColor}`
          }
        }}
        onClick={() => router.push(module.link)}
      >
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: delays[index] + 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${module.glowColor} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />

        <MotionBox
          sx={{
            height: 6,
            background: module.gradient,
            borderRadius: '20px 20px 0 0'
          }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: delays[index] + 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        />

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <MotionBox
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{
              delay: delays[index] + 0.3,
              duration: 0.6,
              type: 'spring',
              stiffness: 200
            }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.15,
              rotate: [0, -10, 10, -5, 0],
              transition: { duration: 0.5 }
            }}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 4,
              background: module.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: `0 15px 40px ${module.glowColor}`,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: -4,
                borderRadius: 5,
                background: module.gradient,
                opacity: 0.3,
                filter: 'blur(10px)',
                zIndex: -1
              }
            }}
          >
            <module.icon sx={{ fontSize: 40, color: module.textColor || '#fff' }} />
          </MotionBox>

          <MotionTypography
            variant="h5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delays[index] + 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: '#1a1a2e',
              fontSize: { xs: '1.2rem', md: '1.4rem' }
            }}
          >
            {module.emoji} {module.title}
          </MotionTypography>

          <MotionTypography
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: delays[index] + 0.5, duration: 0.5 }}
            viewport={{ once: true }}
            sx={{
              color: '#666',
              mb: 3,
              lineHeight: 1.7,
              fontSize: { xs: '0.9rem', md: '0.95rem' }
            }}
          >
            {module.description}
          </MotionTypography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
            {module.features.map((feat, i) => (
              <MotionBox
                key={i}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: delays[index] + 0.5 + i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <MotionBox
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: delays[index] + 0.6 + i * 0.1, type: 'spring' }}
                  viewport={{ once: true }}
                >
                  <CheckCircle sx={{ fontSize: 20, color: module.color }} />
                </MotionBox>
                <Typography sx={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>
                  {feat}
                </Typography>
              </MotionBox>
            ))}
          </Box>

          <MotionButton
            fullWidth
            variant="contained"
            endIcon={<ArrowForward />}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: delays[index] + 0.7, duration: 0.4 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 15px 40px ${module.glowColor}`,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
            sx={{
              background: module.gradient,
              color: module.textColor || '#fff',
              fontWeight: 700,
              py: 1.8,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transition: 'left 0.5s'
              },
              '&:hover::before': {
                left: '100%'
              }
            }}
          >
            Commencer
          </MotionButton>
        </CardContent>
      </Card>
    </MotionBox>
  );
}

export default function CandidatDashboard() {
  const containerRef = useRef(null);

  return (
    <Box ref={containerRef} sx={{ background: '#FAFBFF', minHeight: '100vh', overflow: 'hidden' }}>

      <Box
        sx={{
          minHeight: '55vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 50%, ${colors.secondary} 100%)`,
          overflow: 'hidden',
          pt: 16,
          pb: 10
        }}
      >
        <MotionBox
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
          }}
          sx={{
            position: 'absolute',
            top: '-30%',
            right: '-15%',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%)',
            pointerEvents: 'none',
            filter: 'blur(2px)'
          }}
        />
        <MotionBox
          animate={{
            rotate: -360,
            scale: [1, 1.15, 1],
            y: [0, -30, 0]
          }}
          transition={{
            rotate: { duration: 50, repeat: Infinity, ease: 'linear' },
            scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
          }}
          sx={{
            position: 'absolute',
            bottom: '-40%',
            left: '-15%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}
        />

        {[...Array(12)].map((_, i) => (
          <MotionBox
            key={i}
            animate={{
              y: [0, -50 - i * 8, 0],
              x: [0, Math.sin(i * 0.7) * 40, 0],
              opacity: [0.15, 0.7, 0.15],
              scale: [0.8, 1.3, 0.8]
            }}
            transition={{
              duration: 4 + i * 0.6,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut'
            }}
            sx={{
              position: 'absolute',
              top: `${10 + (i % 4) * 25}%`,
              left: `${5 + i * 8}%`,
              width: 8 + (i % 3) * 6,
              height: 8 + (i % 3) * 6,
              borderRadius: '50%',
              background: i % 3 === 0
                ? `${colors.secondary}`
                : i % 2 === 0
                  ? 'rgba(255,255,255,0.7)'
                  : `${colors.primary}80`,
              pointerEvents: 'none',
              boxShadow: i % 2 === 0
                ? `0 0 20px ${colors.secondary}80`
                : '0 0 15px rgba(255,255,255,0.5)'
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox sx={{ textAlign: 'center' }}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.5, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 200 }}
            >
              <Chip
                label="✨ Bienvenue sur votre espace candidat"
                sx={{
                  mb: 4,
                  px: 2,
                  py: 2.5,
                  fontSize: '0.95rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            </MotionBox>

            <MotionTypography
              variant="h1"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem', lg: '4.2rem' },
                color: '#fff',
                lineHeight: 1.15,
                mb: 3,
                textShadow: '0 4px 30px rgba(0,0,0,0.15)'
              }}
            >
              Construisez votre avenir
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: `linear-gradient(90deg, #fff, ${colors.secondary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mt: 1
                }}
              >
                dès aujourd'hui 🎓
              </Box>
            </MotionTypography>

            <MotionTypography
              variant="h5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              sx={{
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 400,
                maxWidth: 650,
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              Orientation, admission, préparation... Choisissez votre parcours
            </MotionTypography>
          </MotionBox>
        </Container>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 15, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }
          }}
          sx={{
            position: 'absolute',
            bottom: 25,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Découvrir</Typography>
          <KeyboardArrowDown sx={{ fontSize: 30 }} />
        </MotionBox>
      </Box>

      <Box sx={{ py: { xs: 8, md: 10 }, background: '#FAFBFF' }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.3 }}
            sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}
          >
            <MotionBox
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              viewport={{ once: true }}
            >
              <Chip
                label="Nos Services"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  background: `${colors.primary}15`,
                  color: colors.primary,
                  fontSize: '0.85rem'
                }}
              />
            </MotionBox>
            <MotionTypography
              variant="h3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              sx={{
                fontWeight: 800,
                mb: 2,
                color: '#1a1a2e',
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}
            >
              Choisissez votre parcours
            </MotionTypography>
            <MotionTypography
              variant="h6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{
                color: '#666',
                maxWidth: 550,
                mx: 'auto',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Des outils puissants et un accompagnement personnalisé pour réussir
            </MotionTypography>
          </MotionBox>

          <Grid container spacing={4}>
            {modules.map((module, index) => (
              <Grid size={6} key={index}>
                <TiltCard module={module} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <MotionBox
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        sx={{ py: 4, background: colors.primary, textAlign: 'center' }}
      >
        <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
          💬 Besoin d'aide ? Notre équipe est disponible 7j/7
        </Typography>
      </MotionBox>

    </Box>
  );
}
