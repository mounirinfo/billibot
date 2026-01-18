'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Chip, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import {
    InfoOutlined,
    EditCalendarOutlined,
    CheckCircleOutline,
    AlarmOn,
    ArrowForwardIos,
    EmojiObjectsOutlined,
    NotificationsActive
} from '@mui/icons-material';
import { Slider } from '@mui/material';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

interface EventItem {
    date: string;
    label: string;
    highlight?: boolean;
}

interface Phase {
    id: number;
    title: string;
    period: string;
    color: string;
    bgColor: string;
    description: string;
    startDate: Date;
    endDate: Date;
    events: EventItem[];
}

const PARCOURSUP_PHASES: Phase[] = [
    {
        id: 1,
        title: "Phase 1 : Information & Découverte",
        period: "Octobre 2025 > Janvier 2026",
        color: "#FF7043",
        bgColor: "#FFF3E0",
        description: "Découvrez les formations et préparez votre projet. Une seule procédure, un seul dossier.",
        startDate: new Date(2025, 9, 1),
        endDate: new Date(2026, 0, 18),
        events: [
            { date: "17 Décembre 2025", label: "Ouverture de la carte des formations 2026 sur parcoursup.gouv.fr", highlight: true },
            { date: "Janvier 2026", label: "Consultez MonProjetSup pour préparer vos choix" },
            { date: "Janvier 2026", label: "Échangez avec vos professeurs et conseillers d'orientation" }
        ]
    },
    {
        id: 2,
        title: "Phase 2 : Inscription & Vœux",
        period: "19 Janvier > 1er Avril 2026",
        color: "#283593",
        bgColor: "#E8EAF6",
        description: "Inscrivez-vous, formulez jusqu'à 10 vœux et finalisez votre dossier avec soin.",
        startDate: new Date(2026, 0, 19),
        endDate: new Date(2026, 3, 1),
        events: [
            { date: "19 Janvier 2026", label: "Ouverture des inscriptions et formulation des vœux (max 10 vœux)" },
            { date: "12 Mars 2026", label: "Dernier jour pour formuler vos vœux", highlight: true },
            { date: "1er Avril 2026", label: "Dernier jour pour confirmer les vœux et finaliser le dossier", highlight: true },
            { date: "Après 1er Avril", label: "Apprentissage : vœux possibles tout l'été", highlight: false }
        ]
    },
    {
        id: 3,
        title: "Phase 3 : Réponses & Admission",
        period: "2 Juin > 10 Septembre 2026",
        color: "#FBC02D",
        bgColor: "#FFFDE7",
        description: "Recevez les réponses des formations, répondez aux propositions et faites vos choix définitifs.",
        startDate: new Date(2026, 5, 2),
        endDate: new Date(2026, 8, 10),
        events: [
            { date: "2 Juin 2026", label: "Début de la phase d'admission principale", highlight: true },
            { date: "5 - 8 Juin 2026", label: "Classement des vœux en attente" },
            { date: "11 Juin 2026", label: "Ouverture de la phase complémentaire", highlight: true },
            { date: "11 Juillet 2026", label: "Fin de la phase principale", highlight: true },
            { date: "10 Septembre 2026", label: "Clôture de la phase complémentaire" }
        ]
    }
];

export default function ParcoursupJournal() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const today = new Date();
    const [scrubPhase, setScrubPhase] = React.useState(0);

    const currentDatePhaseIndex = useMemo(() => {
        const index = PARCOURSUP_PHASES.findIndex(phase => today >= phase.startDate && today <= phase.endDate);
        return index !== -1 ? index : 0;
    }, [today]);

    // Initialize slider with the real current phase if not already set manually
    React.useEffect(() => {
        setScrubPhase(currentDatePhaseIndex);
    }, [currentDatePhaseIndex]);

    const activePhase = PARCOURSUP_PHASES[scrubPhase] || PARCOURSUP_PHASES[0];

    const getPhaseIcon = (id: number) => {
        switch (id) {
            case 1: return <InfoOutlined />;
            case 2: return <EditCalendarOutlined />;
            case 3: return <CheckCircleOutline />;
            default: return <EmojiObjectsOutlined />;
        }
    };

    return (
        <Box sx={{ py: 4, width: '100%' }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a1a2e', mb: 1, letterSpacing: '-0.5px' }}>
                        📅 Journal de bord Parcoursup
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '1.1rem' }}>
                        Suivez l'évolution de votre calendrier 2025-2026 en temps réel
                    </Typography>

                    <Box sx={{ mt: 3, display: 'inline-flex', alignItems: 'center', gap: 1.5, px: 3, py: 1, borderRadius: 10, bgcolor: 'rgba(45, 155, 148, 0.1)', border: '1px solid rgba(45, 155, 148, 0.2)' }}>
                        <NotificationsActive sx={{ color: '#2D9B94', fontSize: '1.2rem' }} />
                        <Typography sx={{ fontWeight: 700, color: '#2D9B94' }}>
                            Aujourd'hui : {today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                    </Box>
                </MotionBox>
            </Box>

            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!isMobile && (
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '40px',
                            top: '40px',
                            bottom: '40px',
                            width: '4px',
                            background: 'linear-gradient(to bottom, #FF7043, #283593, #FBC02D)',
                            borderRadius: 2,
                            zIndex: 0,
                            opacity: 0.3
                        }}
                    />
                )}

                <Box sx={{ px: isMobile ? 2 : 10, mb: 2 }}>
                    <Slider
                        value={scrubPhase}
                        step={1}
                        marks={PARCOURSUP_PHASES.map((p, i) => ({ value: i, label: `${i + 1}` }))}
                        min={0}
                        max={PARCOURSUP_PHASES.length - 1}
                        onChange={(_, val) => setScrubPhase(val as number)}
                        sx={{
                            color: activePhase.color,
                            height: 6,
                            '& .MuiSlider-thumb': {
                                width: 50,
                                height: 50,
                                backgroundColor: '#fff',
                                border: `4px solid ${activePhase.color}`,
                                transition: 'all 0.3s ease',
                                '&:hover': { boxShadow: `0 0 0 10px ${activePhase.color}22` },
                                '&::after': {
                                    content: `"${scrubPhase + 1} 🤖"`,
                                    fontSize: '1.2rem',
                                    fontWeight: 900,
                                    color: activePhase.color
                                }
                            },
                            '& .MuiSlider-markLabel': {
                                fontWeight: 800,
                                color: activePhase.color,
                                top: 45
                            }
                        }}
                    />
                </Box>

                {PARCOURSUP_PHASES.map((phase, index) => {
                    const isActive = activePhase.id === phase.id;
                    const isPast = index < scrubPhase;

                    return (
                        <MotionBox
                            key={phase.id}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            sx={{
                                position: 'relative',
                                pl: isMobile ? 0 : '100px',
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: 3,
                                zIndex: 1
                            }}
                        >
                            {!isMobile && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '22px',
                                        top: '30px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        bgcolor: isActive ? '#fff' : phase.color,
                                        border: `4px solid ${phase.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isActive ? `0 0 20px ${phase.color}44` : 'none',
                                        transition: 'all 0.3s ease',
                                        zIndex: 2
                                    }}
                                >
                                    <Typography sx={{ color: isActive ? phase.color : '#fff', fontWeight: 900 }}>
                                        {phase.id}
                                    </Typography>

                                    {isActive && (
                                        <Box
                                            component={motion.div}
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            sx={{
                                                position: 'absolute',
                                                inset: -10,
                                                borderRadius: '50%',
                                                border: `2px solid ${phase.color}`,
                                                zIndex: -1
                                            }}
                                        />
                                    )}
                                </Box>
                            )}

                            <MotionCard
                                whileHover={{ scale: isActive ? 1.01 : 1 }}
                                sx={{
                                    flex: 1,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    border: isActive ? `2px solid ${phase.color}` : '1px solid #eee',
                                    boxShadow: isActive ? `0 20px 40px ${phase.color}15` : '0 10px 30px rgba(0,0,0,0.03)',
                                    opacity: isPast ? 0.7 : 1,
                                    filter: isPast ? 'grayscale(0.3)' : 'none',
                                    background: phase.bgColor,
                                    position: 'relative'
                                }}
                            >
                                {isActive && (
                                    <Chip
                                        label="PHASE ACTUELLE"
                                        icon={<AlarmOn sx={{ fontSize: '1.2rem', color: '#fff !important' }} />}
                                        sx={{
                                            position: 'absolute',
                                            top: 20,
                                            right: 20,
                                            background: phase.color,
                                            color: '#fff',
                                            fontWeight: 800,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                )}

                                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: 3,
                                            bgcolor: '#fff',
                                            color: phase.color,
                                            display: 'flex',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                        }}>
                                            {getPhaseIcon(phase.id)}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: phase.color, lineHeight: 1.2 }}>
                                                {phase.title}
                                            </Typography>
                                            <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 600, mt: 0.5 }}>
                                                {phase.period}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography sx={{ color: '#444', mb: 4, lineHeight: 1.6, fontSize: '1rem' }}>
                                        {phase.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {phase.events.map((event, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 2,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: event.highlight ? '#fff' : 'rgba(255,255,255,0.4)',
                                                    border: event.highlight ? `1px solid ${phase.color}33` : '1px solid transparent',
                                                    boxShadow: event.highlight ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                                }}
                                            >
                                                <Box sx={{
                                                    minWidth: 100,
                                                    fontWeight: 800,
                                                    color: phase.color,
                                                    fontSize: '0.9rem',
                                                    pt: 0.2
                                                }}>
                                                    {event.date}
                                                </Box>
                                                <Typography sx={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: event.highlight ? 700 : 500,
                                                    color: '#1a1a2e'
                                                }}>
                                                    {event.label}
                                                </Typography>
                                                {event.highlight && (
                                                    <ArrowForwardIos sx={{ ml: 'auto', fontSize: '1rem', color: phase.color, opacity: 0.5 }} />
                                                )}
                                            </Box>
                                        ))}
                                    </Box>

                                    {isActive && (
                                        <Box sx={{ mt: 4, p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.6)', border: `1px dashed ${phase.color}` }}>
                                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1.2, fontWeight: 700, color: phase.color }}>
                                                <EmojiObjectsOutlined /> Conseil BilliBot
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1, color: '#555', lineHeight: 1.5 }}>
                                                {phase.id === 1 ? "C'est le moment idéal pour finaliser ta liste de vœux ! N'oublie pas de consulter tes professeurs lors des journées de l'orientation." :
                                                    phase.id === 2 ? "Fais attention aux dates limites ! Valide tes vœux bien avant le 12 mars pour éviter le rush de dernière minute." :
                                                        "Réponds rapidement aux propositions d'admission, surtout si tu es en liste d'attente pour d'autres vœux."}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </MotionCard>
                        </MotionBox>
                    );
                })}
            </Box>
        </Box>
    );
}
