'use client';

import { Container, Box, Typography, Paper, Divider, Button, Chip } from '@mui/material';
import { ArrowBack, Gavel, Security, Person, ListAlt } from '@mui/icons-material';
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

const sections = [
    {
        title: "1. Présentation du Service",
        icon: <ListAlt />,
        content: "BilliBot est une plateforme d'orientation et d'accompagnement éducatif utilisant l'intelligence artificielle pour guider les étudiants dans leur parcours scolaire et professionnel en France. Le service est édité par l'école Billières."
    },
    {
        title: "2. Acceptation des CGU",
        icon: <Gavel />,
        content: "L'utilisation de BilliBot implique l'acceptation pleine et entière des présentes conditions générales d'utilisation. Ces conditions peuvent être modifiées à tout moment pour s'adapter aux évolutions du service."
    },
    {
        title: "3. Accès au Service",
        icon: <Security />,
        content: "Le service est normalement accessible 24h/24, 7j/7. Toutefois, l'éditeur se réserve le droit de suspendre l'accès pour maintenance ou mise à jour technique. L'accès nécessite un compte validé par l'administration."
    },
    {
        title: "4. Données Personnelles (RGPD)",
        icon: <Person />,
        content: "Conformément au RGPD, BilliBot s'engage à protéger vos données. Les informations collectées lors du quiz d'orientation servent exclusivement à fournir des recommandations personnalisées. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données."
    },
    {
        title: "5. Propriété Intellectuelle",
        icon: <Security />,
        content: "L'ensemble des contenus (textes, graphismes, logos, algorithmes IA) est la propriété exclusive de l'éditeur. Toute reproduction sans autorisation est strictement interdite."
    }
];

export default function CGUPage() {
    const router = useRouter();

    return (
        <Box sx={{ minHeight: '100vh', background: colors.bg, pb: 8 }}>
            <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, pt: 4, pb: 16, color: '#white', position: 'relative', overflow: 'hidden' }}>
                <MotionBox
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                    sx={{ position: 'absolute', top: '-50%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}
                />
                <Container maxWidth="md">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        sx={{ color: '#fff', mb: 4, textTransform: 'none', fontWeight: 600 }}
                    >
                        Retour
                    </Button>
                    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', mb: 2, fontSize: { xs: '2.2rem', md: '3rem' }, lineHeight: 1.2 }}>
                            Conditions Générales d'Utilisation
                        </Typography>
                        <Chip label="Dernière mise à jour : 6 Janvier 2026" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
                    </MotionBox>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: 2 }}>
                <MotionPaper
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}
                >
                    <Typography variant="body1" sx={{ color: '#666', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
                        Bienvenue sur <strong>BilliBot</strong>. Merci de lire attentivement ces conditions avant d'utiliser notre plateforme. Notre objectif est de vous offrir une expérience d'orientation transparente, sécurisée et éthique.
                    </Typography>

                    {sections.map((section, index) => (
                        <Box key={index} sx={{ mb: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                                <Box sx={{ width: 45, height: 45, borderRadius: 2, bgcolor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary }}>
                                    {section.icon}
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
                                    {section.title}
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8, pl: { md: 7.5 } }}>
                                {section.content}
                            </Typography>
                            {index < sections.length - 1 && <Divider sx={{ mt: 6, opacity: 0.5 }} />}
                        </Box>
                    ))}

                    <Box sx={{ mt: 8, p: 4, bgcolor: '#f8f9fa', borderRadius: 4, textAlign: 'center' }}>
                        <Typography sx={{ mb: 2, fontWeight: 700 }}>Une question sur nos conditions ?</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Notre équipe juridique est à votre disposition pour toute clarification.
                        </Typography>
                        <Button variant="contained" sx={{ bgcolor: colors.primary, borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontWeight: 700 }}>
                            Contacter le support
                        </Button>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
}
