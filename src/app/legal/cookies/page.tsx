'use client';

import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { ArrowBack, Cookie, Shield, Analytics, Settings } from '@mui/icons-material';
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

const cookieTypes = [
    {
        type: "Essentiels",
        icon: <Shield />,
        desc: "Nécessaires au fonctionnement du site et à la sécurité de votre compte.",
        duration: "Session"
    },
    {
        type: "Préférences",
        icon: <Settings />,
        desc: "Mémorisent vos choix pour personnaliser votre navigation (langue, thèmes).",
        duration: "12 mois"
    },
    {
        type: "Analytiques",
        icon: <Analytics />,
        desc: "Nous permettent de comprendre comment BilliBot est utilisé pour l'améliorer.",
        duration: "6 mois"
    }
];

export default function CookiesPage() {
    const router = useRouter();

    return (
        <Box sx={{ minHeight: '100vh', background: colors.bg, pb: 8 }}>
            <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, pt: 2, pb: 16, color: '#white', position: 'relative', overflow: 'hidden' }}>
                <MotionBox
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    sx={{ position: 'absolute', top: '-20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(50px)' }}
                />
                <Container maxWidth="md">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        sx={{ color: '#fff', mb: 4, textTransform: 'none', fontWeight: 600 }}
                    >
                        Retour
                    </Button>
                    <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', mb: 2, display: 'flex', alignItems: 'center', gap: 2, fontSize: { xs: '2.2rem', md: '3rem' } }}>
                            <Cookie sx={{ fontSize: '3.5rem' }} /> Gestion des Cookies
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: 600 }}>
                            Nous utilisons des cookies pour optimiser votre expérience d'orientation et assurer la sécurité du service.
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
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Qu'est-ce qu'un cookie ?</Typography>
                    <Typography sx={{ color: '#444', lineHeight: 1.8, mb: 6 }}>
                        Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site. Il permet de conserver des données utilisateur afin de faciliter la navigation et de permettre certaines fonctionnalités. Chez BilliBot, nous les utilisons de manière responsable et transparente.
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Détail des cookies utilisés</Typography>
                    <TableContainer component={Box} sx={{ mb: 6, borderRadius: 3, overflow: 'hidden', border: '1px solid #eee' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Catégorie</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Durée</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cookieTypes.map((cookie, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
                                            <Box sx={{ color: colors.primary }}>{cookie.icon}</Box>
                                            {cookie.type}
                                        </TableCell>
                                        <TableCell sx={{ color: '#666' }}>{cookie.desc}</TableCell>
                                        <TableCell>
                                            <Chip label={cookie.duration} size="small" variant="outlined" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Comment gérer vos choix ?</Typography>
                    <Typography sx={{ color: '#444', lineHeight: 1.8, mb: 4 }}>
                        Vous pouvez à tout moment configurer votre navigateur pour bloquer les cookies. Notez cependant que la désactivation des cookies essentiels pourrait impédier votre accès à certaines parties de BilliBot (notamment l'espace sécurisé).
                    </Typography>

                    <Box sx={{ p: 4, bgcolor: `${colors.primary}05`, borderRadius: 4, border: `1px dashed ${colors.primary}` }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Configuration par navigateur :</Typography>
                        <ul style={{ paddingLeft: '20px', color: '#666', lineHeight: 2 }}>
                            <li><strong>Chrome :</strong> Paramètres {'>'} Confidentialité et sécurité</li>
                            <li><strong>Firefox :</strong> Options {'>'} Vie privée et sécurité</li>
                            <li><strong>Safari :</strong> Préférences {'>'} Confidentialité</li>
                        </ul>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
}
