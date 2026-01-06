'use client';

import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';
import { SmartToy, Copyright } from '@mui/icons-material';
import NextLink from 'next/link';

const colors = {
    primary: '#2D9B94',
    text: '#666',
    bg: '#FAFBFF'
};

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: '#fff', borderTop: '1px solid #eee', pt: 8, pb: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <SmartToy sx={{ color: '#fff' }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                                BilliBot
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: colors.text, lineHeight: 1.8, mb: 3, maxWidth: 300 }}>
                            L'assistant d'orientation intelligent de l'école Billières. Trouvez votre voie idéale grâce à l'IA.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2.5, color: '#1a1a2e' }}>Légal</Typography>
                        <Stack spacing={1.5}>
                            <Link component={NextLink} href="/legal/cgu" underline="none" sx={{ color: colors.text, fontSize: '0.9rem', '&:hover': { color: colors.primary } }}>CGU</Link>
                            <Link component={NextLink} href="/legal/cookies" underline="none" sx={{ color: colors.text, fontSize: '0.9rem', '&:hover': { color: colors.primary } }}>Cookies</Link>
                            <Link component={NextLink} href="/legal/accessibilite" underline="none" sx={{ color: colors.text, fontSize: '0.9rem', '&:hover': { color: colors.primary } }}>Accessibilité</Link>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2.5, color: '#1a1a2e' }}>Navigation</Typography>
                        <Stack spacing={1.5}>
                            <Link component={NextLink} href="/login" underline="none" sx={{ color: colors.text, fontSize: '0.9rem', '&:hover': { color: colors.primary } }}>Connexion</Link>
                            <Link component={NextLink} href="/candidat/orientation" underline="none" sx={{ color: colors.text, fontSize: '0.9rem', '&:hover': { color: colors.primary } }}>Orientation</Link>
                            <Link component={NextLink} href="/chat" underline="none" sx={{ color: colors.text, fontSize: '0.9rem', '&:hover': { color: colors.primary } }}>BilliBot Chat</Link>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2.5, color: '#1a1a2e' }}>École Billières</Typography>
                        <Typography variant="body2" sx={{ color: colors.text, mb: 1.5 }}>
                            123 Avenue de Billières, Toulouse
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text }}>
                            admissions@billieres.com
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.text }}>
                        <Copyright sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            2026 BilliBot. Tous droits réservés. Design by MounirInfo.
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                        Fait avec passion 🚀
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
