'use client';

import { Container, Box, Typography, Paper, Divider, Button, Grid, LinearProgress, Chip } from '@mui/material';
import { ArrowBack, AccessibilityNew, Visibility, Hearing, Mouse, Speed } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const colors = {
    primary: '#2D9B94',
    secondary: '#FFD93D',
    primaryDark: '#1F7A72',
    bg: '#FAFBFF'
};

const criteria = [
    { label: "Contrastes visuels", icon: <Visibility />, progress: 95 },
    { label: "Navigation clavier", icon: <Mouse />, progress: 90 },
    { label: "Contenus alternatifs", icon: <Hearing />, progress: 85 },
    { label: "Lecture vocale", icon: <Speed />, progress: 80 }
];

export default function AccessibilitePage() {
    const router = useRouter();

    return (
        <Box sx={{ minHeight: '100vh', background: colors.bg, pb: 8 }}>
            <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, pt: 2, pb: 16, color: '#white', position: 'relative', overflow: 'hidden' }}>
                <MotionBox
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    sx={{ position: 'absolute', top: '10%', left: '5%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Container maxWidth="md">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        sx={{ color: '#fff', mb: 4, textTransform: 'none', fontWeight: 600 }}
                    >
                        Retour
                    </Button>
                    <MotionBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', mb: 2, display: 'flex', alignItems: 'center', gap: 2, fontSize: { xs: '2.2rem', md: '3rem' } }}>
                            <AccessibilityNew sx={{ fontSize: '4rem' }} /> Accessibilité
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                            BilliBot s'engage pour une inclusion numérique totale, en suivant les directives du RGAA.
                        </Typography>
                    </MotionBox>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: 2 }}>
                <MotionPaper
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Déclaration de conformité</Typography>
                    <Typography sx={{ color: '#444', lineHeight: 1.8, mb: 6 }}>
                        BilliBot s'engage à rendre ses services numériques accessibles conformément à l'article 47 de la loi n°2005-102 du 11 février 2005. Nous travaillons activement pour que chaque étudiant, quelque soit sa situation, puisse s'orienter sans barrière.
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Indicateurs de performance</Typography>
                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        {criteria.map((item, index) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#f8f9fa', height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Box sx={{ color: colors.primary }}>{item.icon}</Box>
                                        <Typography fontWeight={700}>{item.label}</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.progress}
                                        sx={{ height: 8, borderRadius: 4, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: colors.primary } }}
                                    />
                                    <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right', color: colors.primary, fontWeight: 800 }}>
                                        {item.progress}% de conformité
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ mb: 6 }} />

                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Amélioration continue</Typography>
                    <Typography sx={{ color: '#444', lineHeight: 1.8, mb: 4 }}>
                        Malgré nos efforts, certains contenus peuvent encore présenter des difficultés. Nous mettons régulièrement à jour nos interfaces pour corriger les anomalies signalées.
                    </Typography>

                    <Box sx={{ p: 4, bgcolor: `${colors.secondary}15`, borderRadius: 4, border: `2px solid ${colors.secondary}` }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            💡 Besoin d'assistance ?
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                            Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez nous contacter pour être orienté vers une alternative accessible.
                        </Typography>
                        <Chip label="accessibilite@billieres.com" sx={{ fontWeight: 700, bgcolor: '#fff', border: `1px solid ${colors.secondary}` }} />
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
}
