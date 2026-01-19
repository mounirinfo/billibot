'use client';

import { Container, Grid, Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { Explore, School, Mic, Phone, ArrowForward, CheckCircle, KeyboardArrowDown, Description } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

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

const BilliBot = ({ size = 60 }: { size?: number }) => {
  return (
    <MotionBox
      initial={{ y: 20, opacity: 0 }}
      animate={{
        y: [0, -15, 0],
        rotate: [0, -3, 3, 0],
      }}
      transition={{
        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }}
      whileInView={{ opacity: 1 }}
      sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <MotionBox
        animate={{ scale: [1, 1.05, 1], y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        sx={{
          background: '#fff',
          px: 2,
          py: 1,
          borderRadius: '20px 20px 20px 0',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          mb: 2,
          position: 'relative',
          ml: 10,
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #fff',
          }
        }}
      >
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: colors.primaryDark, whiteSpace: 'nowrap' }}>
          On construit ton avenir ensemble ? 🚀
        </Typography>
      </MotionBox>

      <svg width={size * 1.5} height={size * 1.5} viewBox="0 0 100 100">
        <motion.line
          x1="50" y1="20" x2="50" y2="10"
          stroke={colors.secondary} strokeWidth="4"
          animate={{ rotate: [0, 20, -20, 0], originX: '50px', originY: '20px' }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <circle cx="50" cy="8" r="4" fill={colors.secondary} />
        <rect x="25" y="20" width="50" height="45" rx="12" fill={colors.primary} />
        <motion.circle
          cx="40" cy="38" r="4" fill="white"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.circle
          cx="60" cy="38" r="4" fill="white"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.path
          d="M 40 52 Q 50 58 60 52"
          stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"
          animate={{ d: ["M 40 52 Q 50 58 60 52", "M 40 52 Q 50 62 60 52", "M 40 52 Q 50 58 60 52"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <rect x="35" y="68" width="30" height="25" rx="8" fill={colors.primaryDark} />
        <motion.path
          d="M 25 75 L 12 85"
          stroke={colors.primary} strokeWidth="8" strokeLinecap="round"
          animate={{ rotate: [0, 45, 0], originX: '25px', originY: '75px' }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M 75 75 L 88 85"
          stroke={colors.primary} strokeWidth="8" strokeLinecap="round"
          animate={{ rotate: [0, -45, 0], originX: '75px', originY: '75px' }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </MotionBox>
  );
};

const modules = [
  {
    icon: Description,
    title: 'Ton Projet Motivé',
    emoji: '📝',
    description: 'Structurez votre lettre de motivation avec nos modèles intelligents.',
    features: ['Templates par filière', 'Structure conseillée', 'Checklist dossier'],
    color: colors.primary,
    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    glowColor: 'rgba(45, 155, 148, 0.4)',
    link: '/candidat/entretien',
    hint: 'Générez une lettre de motivation percutante pour votre dossier.'
  },
  {
    icon: School,
    title: 'Journal de bord Admission',
    emoji: '📈',
    description: 'Suivez votre calendrier Parcoursup et vos candidatures en temps réel.',
    features: ['Calendrier interactif', 'Journal de bord Parcoursup', 'Suivi des étapes'],
    color: colors.secondary,
    gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`,
    glowColor: 'rgba(255, 217, 61, 0.4)',
    textColor: '#1a1a2e',
    link: '/candidat/admission',
    hint: 'Ne ratez aucune étape clé de votre calendrier d\'admission.'
  },
  {
    icon: Explore,
    title: 'Orientation Express',
    emoji: '🧭',
    description: 'Découvrez votre formation idéale en 3 minutes grâce à notre algorithme intelligent.',
    features: ['Test de personnalité', 'Recommandations IA', 'Matching formations'],
    color: colors.primary,
    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    glowColor: 'rgba(45, 155, 148, 0.4)',
    link: '/candidat/orientation',
    hint: 'Découvrez les métiers qui vous correspondent en quelques clics.'
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
    link: '/candidat/contact',
    hint: 'Besoin d\'aide ? Nos conseillers vous répondent rapidement.'
  }
];

function TiltCard({ module, index }: { module: typeof modules[0]; index: number }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseEnter = () => scale.set(1.05);
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const delays = [0, 0.1, 0.2, 0.3];

  return (
    <MotionBox
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delays[index] }}
      viewport={{ once: true }}
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
          borderRadius: '32px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          overflow: 'visible',
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transformStyle: 'preserve-3d',
          '&:hover': {
            background: '#fff',
            boxShadow: `0 30px 60px ${module.glowColor}`,
            '& .card-icon': {
              transform: 'translateZ(30px) scale(1.1)',
            }
          }
        }}
        onClick={() => router.push(module.link)}
      >
        <MotionBox
          sx={{
            height: 8,
            background: module.gradient,
            borderRadius: '20px 20px 0 0',
            opacity: 0.8,
          }}
        />

        <CardContent
          sx={{
            p: { xs: 3, md: 4 },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            flexGrow: 1
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <MotionBox
              className="card-icon"
              sx={{
                width: 70,
                height: 70,
                borderRadius: '20px',
                background: module.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 15px 35px ${module.glowColor}`,
                color: '#fff',
                transition: 'transform 0.4s ease',
              }}
            >
              <module.icon sx={{ fontSize: 32 }} />
            </MotionBox>
            <Typography sx={{ fontSize: '3rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
              {module.emoji}
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              mb: 2,
              color: '#1a1a2e',
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              lineHeight: 1.1,
              letterSpacing: '-1px'
            }}
          >
            {module.title}
          </Typography>

          <Typography
            sx={{
              color: '#555',
              mb: 3,
              lineHeight: 1.6,
              fontSize: '0.95rem',
              opacity: 0.9,
              flexGrow: 1 // This helps push things down
            }}
          >
            {module.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            {module.features.map((feat, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle sx={{ fontSize: 18, color: module.color, opacity: 0.8 }} />
                <Typography sx={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>
                  {feat}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', mb: 3 }}>
            {module.hint}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              background: module.gradient,
              color: module.textColor || '#fff',
              fontWeight: 800,
              py: 2,
              borderRadius: '16px',
              textTransform: 'none',
              fontSize: '1rem',
              mt: 'auto', // Perfectly aligned buttons!
              boxShadow: `0 15px 35px ${module.glowColor}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 45px ${module.glowColor}`,
                filter: 'brightness(1.1)'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            {module.title === 'Contact Admissions' ? 'Prendre RDV' : 'C\'est parti !'}
          </Button>
        </CardContent>
      </Card>
    </MotionBox>
  );
}

export default function CandidatDashboard() {
  const containerRef = useRef(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Box ref={containerRef} sx={{ background: '#FAFBFF', minHeight: '100vh', overflow: 'hidden' }}>
      <Breadcrumbs />
      <Box
        sx={{
          minHeight: { xs: 'auto', md: '45vh' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 40%, ${colors.secondary} 100%)`,
          overflow: 'hidden',
          pt: { xs: 14, md: 16 },
          pb: { xs: 6, md: 4 },
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, #FAFBFF, transparent)',
            zIndex: 1
          }
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

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                <Chip
                  label="✨ BIENVENUE SUR VOTRE ESPACE"
                  sx={{
                    mb: 3,
                    px: 1.5,
                    py: 2,
                    fontSize: '0.8rem',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontWeight: 800,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    letterSpacing: '1px'
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                    color: '#fff',
                    lineHeight: 1.1,
                    mb: 2,
                    textShadow: '0 4px 20px rgba(0,0,0,0.1)'
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
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 400,
                    maxWidth: 600,
                    mb: 4,
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.2rem' }
                  }}
                >
                  Orientation, admission, préparation... Choisissez votre parcours parmi nos outils intelligents.
                </Typography>
              </MotionBox>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <BilliBot size={150} />

                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={scrollToServices}
                  transition={{
                    opacity: { delay: 1, duration: 0.5 },
                    y: { delay: 1, duration: 0.5 }
                  }}
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                  }}
                >
                  <MotionButton
                    variant="contained"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 20px 40px ${colors.primary}60`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      background: '#fff',
                      color: colors.primaryDark,
                      px: 5,
                      py: 2,
                      borderRadius: '50px',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                    }}
                  >
                    Découvrir mes parcours
                  </MotionButton>
                  <MotionBox
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>Scroll</Typography>
                    <KeyboardArrowDown sx={{ fontSize: 24 }} />
                  </MotionBox>
                </MotionBox>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>

      </Box>

      <Box ref={servicesRef} sx={{ py: { xs: 4, md: 5 }, background: '#FAFBFF' }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.3 }}
            sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}
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
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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

    </Box >
  );
}
