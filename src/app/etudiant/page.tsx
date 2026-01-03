'use client';

import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Autocomplete,
    TextField,
    IconButton,
    Collapse,
    Step,
    StepLabel,
    Stepper,
} from '@mui/material';
import {
    School,
    ArrowForward,
    ArrowBack,
    CheckCircle,
    Calculate,
    Science,
    Biotech,
    Leaderboard,
    Public,
    Language,
    Computer,
    Engineering,
    Book,
    Place,
    Celebration,
    AutoAwesome,
    Rocket,
    Stars
} from '@mui/icons-material';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { etablissements, niveaux, specialites, programmes } from '../../data/mock-programmes';

const iconMap: any = {
    Calculate, Science, Biotech, Leaderboard, Public, Language, Computer, Engineering
};

const colors = {
    primary: '#2D9B94',
    secondary: '#FFD93D',
    tertiary: '#FF6B9D',
    purple: '#9C27B0',
    blue: '#2196F3',
    primaryDark: '#1F7A72',
    lightBg: '#F0F9F8',
};

const steps = ['Établissement', 'Niveau', 'Spécialité', 'Programme'];

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionTypography = motion.create(Typography);

function ParticlesBackground() {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const newParticles = [...Array(30)].map((_, i) => ({
            id: i,
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animateX: [0, Math.random() * 20 - 10, 0],
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 2
        }));
        setParticles(newParticles);
    }, []);

    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        width: p.width,
                        height: p.height,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
                        left: p.left,
                        top: p.top,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: p.animateX,
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay
                    }}
                />
            ))}
        </Box>
    );
}

function ConfettiExplosion({ trigger }: { trigger: boolean }) {
    if (!trigger) return null;

    return (
        <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 9999 }}>
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        background: [colors.primary, colors.secondary, colors.tertiary, colors.purple][i % 4],
                        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                        x: (Math.random() - 0.5) * 800,
                        y: (Math.random() - 0.5) * 800,
                        opacity: 0,
                        scale: 0,
                        rotate: Math.random() * 720
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeOut"
                    }}
                />
            ))}
        </Box>
    );
}

function MagneticButton({ children, onClick, disabled }: any) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = (e.clientX - centerX) * 0.3;
        const distY = (e.clientY - centerY) * 0.3;
        x.set(distX);
        y.set(distY);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={onClick}
            disabled={disabled}
            style={{ x: springX, y: springY, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );
}

function HolographicCard({ children, onClick, active, delay = 0 }: any) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 400, damping: 40 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 400, damping: 40 });
    const glowX = useTransform(x, [-100, 100], ['0%', '100%']);
    const glowY = useTransform(y, [-100, 100], ['0%', '100%']);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    return (
        <MotionBox
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
            style={{ rotateX, rotateY, perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={onClick}
            whileHover={{ scale: 1.08, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            sx={{ h: '100%', cursor: 'pointer', position: 'relative' }}
        >
            <Card
                sx={{
                    height: '100%',
                    borderRadius: 4,
                    border: active ? `3px solid ${colors.primary}` : '2px solid transparent',
                    boxShadow: active
                        ? `0 20px 60px rgba(45, 155, 148, 0.4), 0 0 0 1px ${colors.primary}40`
                        : '0 15px 45px rgba(0,0,0,0.08)',
                    background: active
                        ? `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`
                        : 'white',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(45, 155, 148, 0.15), transparent 50%)`,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                    },
                    '&:hover::before': {
                        opacity: 1,
                    }
                }}
            >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
                    {children}
                </CardContent>

                {/* Shimmer effect */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                        pointerEvents: 'none',
                    }}
                    animate={{
                        left: ['100%', '-100%']
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: "linear"
                    }}
                />
            </Card>
        </MotionBox>
    );
}

function FloatingIcons() {
    const icons = [Stars, Rocket, AutoAwesome, Celebration];

    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
            {icons.map((Icon, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${20 + i * 20}%`,
                        top: `${10 + i * 15}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Icon sx={{ fontSize: 40, color: `${colors.primary}30`, filter: 'blur(1px)' }} />
                </motion.div>
            ))}
        </Box>
    );
}

export default function EtudiantPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedSchool, setSelectedSchool] = useState<any>(null);
    const [selectedLevel, setSelectedLevel] = useState<any>(null);
    const [selectedSpec, setSelectedSpec] = useState<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleNext = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleReset = () => {
        setActiveStep(0);
        setSelectedSchool(null);
        setSelectedLevel(null);
        setSelectedSpec(null);
    };

    const renderSchoolSelection = () => (
        <MotionBox
            key="step1"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        >
            <Box sx={{ position: 'relative' }}>
                <FloatingIcons />

                {/* Animated Title */}
                <MotionTypography
                    variant="h3"
                    fontWeight={900}
                    textAlign="center"
                    mb={2}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    sx={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '2rem', md: '3rem' }
                    }}
                >
                    🎓 Où étudiez-vous ?
                </MotionTypography>

                <MotionTypography
                    textAlign="center"
                    color="text.secondary"
                    fontSize="1.2rem"
                    mb={6}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Découvrez votre parcours personnalisé
                </MotionTypography>

                {/* Animated Decorations */}
                <Box sx={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: '50%' }}>
                    <motion.div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: `radial-gradient(circle, ${colors.primary}20, transparent)`,
                            borderRadius: '50%',
                        }}
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </Box>

                <Box sx={{ maxWidth: 700, mx: 'auto', position: 'relative', zIndex: 1 }}>
                    <MotionBox
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                    >
                        <Autocomplete
                            options={etablissements}
                            getOptionLabel={(option) => `${option.name} (${option.city})`}
                            onChange={(_, newValue) => setSelectedSchool(newValue)}
                            value={selectedSchool}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="🔍 Rechercher votre lycée..."
                                    variant="outlined"
                                    placeholder="Ex: Lycée Louis-le-Grand"
                                    sx={{
                                        bgcolor: 'white',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 4,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                boxShadow: '0 15px 50px rgba(45, 155, 148, 0.15)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }
                                    }}
                                />
                            )}
                            renderOption={(props, option) => {
                                const { key, ...otherProps } = props as any;
                                return (
                                    <motion.li
                                        key={key}
                                        {...otherProps}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        whileHover={{ scale: 1.02, backgroundColor: colors.lightBg }}
                                        style={{ padding: '12px 16px', cursor: 'pointer' }}
                                    >
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Box sx={{
                                                    bgcolor: colors.lightBg,
                                                    p: 1.5,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <School sx={{ color: colors.primary, fontSize: 24 }} />
                                                </Box>
                                            </motion.div>
                                            <Box>
                                                <Typography fontWeight={700} fontSize="1.05rem">{option.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" fontSize="0.9rem">
                                                    📍 {option.city}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </motion.li>
                                )
                            }}
                        />
                    </MotionBox>

                    <AnimatePresence>
                        {selectedSchool && (
                            <MotionBox
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                mt={6}
                                textAlign="center"
                            >
                                <MagneticButton onClick={handleNext}>
                                    <MotionBox
                                        sx={{
                                            bgcolor: colors.primary,
                                            color: 'white',
                                            px: 8,
                                            py: 2,
                                            borderRadius: 50,
                                            fontSize: '1.3rem',
                                            fontWeight: 700,
                                            boxShadow: `0 15px 40px ${colors.primary}60`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
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
                                                transition: 'left 0.5s ease-in-out'
                                            },
                                            '&:hover::before': {
                                                left: '100%'
                                            }
                                        }}
                                        whileHover={{
                                            boxShadow: `0 20px 50px ${colors.primary}80`,
                                        }}
                                    >
                                        Continuer <ArrowForward />
                                    </MotionBox>
                                </MagneticButton>
                            </MotionBox>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>
        </MotionBox>
    );

    const renderLevelSelection = () => (
        <MotionBox
            key="step2"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.6 }}
        >
            <MotionTypography
                variant="h3"
                fontWeight={900}
                textAlign="center"
                mb={6}
                sx={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '3rem' }
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            >
                🎯 Quelle est votre classe ?
            </MotionTypography>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                {niveaux.map((niveau, i) => (
                    <HolographicCard
                        key={niveau.id}
                        onClick={() => { setSelectedLevel(niveau); handleNext(); }}
                        active={selectedLevel?.id === niveau.id}
                        delay={i * 0.15}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <Typography fontSize="5rem" lineHeight={1}>{niveau.emoji}</Typography>
                        </motion.div>
                        <Typography variant="h5" fontWeight={800}>{niveau.label}</Typography>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Chip
                                label="Sélectionner"
                                sx={{
                                    mt: 2,
                                    bgcolor: colors.primary,
                                    color: 'white',
                                    fontWeight: 700,
                                    px: 3,
                                    fontSize: '0.95rem'
                                }}
                            />
                        </motion.div>
                    </HolographicCard>
                ))}
            </Box>
        </MotionBox>
    );

    const renderSpecSelection = () => (
        <MotionBox
            key="step3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
        >
            <MotionTypography
                variant="h3"
                fontWeight={900}
                textAlign="center"
                mb={6}
                sx={{
                    background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.secondary})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '3rem' }
                }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
            >
                ✨ Choisissez une matière
            </MotionTypography>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={3}>
                {specialites.map((spec, i) => {
                    const IconComp = iconMap[spec.icon] || Book;
                    return (
                        <HolographicCard
                            key={spec.id}
                            onClick={() => { setSelectedSpec(spec); handleNext(); }}
                            active={selectedSpec?.id === spec.id}
                            delay={i * 0.08}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 2
                                }}
                            >
                                <Box sx={{
                                    p: 2.5,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                                    mb: 2
                                }}>
                                    <IconComp sx={{ fontSize: 40, color: colors.primary }} />
                                </Box>
                            </motion.div>
                            <Typography fontWeight={800} fontSize="1.1rem">{spec.label}</Typography>
                        </HolographicCard>
                    );
                })}
            </Box>
        </MotionBox>
    );

    const renderProgrammes = () => {
        const defaultModules = ["Programme en cours d'actualisation...", "Consultez le site officiel pour plus de détails."];
        const currentModules = (programmes[selectedLevel?.id]?.[selectedSpec?.id] || defaultModules);

        return (
            <MotionBox
                key="step4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Celebration Header */}
                <Box textAlign="center" mb={6}>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Celebration sx={{ fontSize: 80, color: colors.secondary, mb: 2 }} />
                    </motion.div>

                    <MotionTypography
                        variant="h3"
                        fontWeight={900}
                        sx={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.blue})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '2rem', md: '3.5rem' }
                        }}
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        🎊 Votre Programme 2024
                    </MotionTypography>
                </Box>

                {/* Chips Summary */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
                    {[
                        { icon: <Place />, label: selectedSchool?.name, color: colors.primary },
                        { icon: undefined, label: selectedLevel?.label, color: colors.purple },
                        { icon: undefined, label: selectedSpec?.label, color: colors.secondary }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.2, type: "spring", bounce: 0.6 }}
                        >
                            <Chip
                                icon={item.icon}
                                label={item.label}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    py: 3,
                                    px: 2,
                                    bgcolor: `${item.color}20`,
                                    border: `2px solid ${item.color}`,
                                    color: item.color
                                }}
                            />
                        </motion.div>
                    ))}
                </Box>

                {/* Modules List */}
                <Box display="flex" flexDirection="column" gap={3} alignItems="center">
                    {currentModules.map((module, i) => (
                        <MotionCard
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100, rotateY: -30 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{
                                delay: i * 0.15,
                                type: "spring",
                                bounce: 0.4
                            }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: `0 20px 60px ${colors.primary}30`,
                                rotateY: 5
                            }}
                            sx={{
                                width: { xs: '100%', md: '70%' },
                                borderRadius: 4,
                                borderLeft: `6px solid ${colors.primary}`,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                background: 'white',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 3, position: 'relative', zIndex: 1 }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                                >
                                    <CheckCircle sx={{ color: colors.primary, fontSize: 36 }} />
                                </motion.div>
                                <Typography fontWeight={600} fontSize="1.15rem">{module}</Typography>
                            </CardContent>

                            {/* Animated background */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 200,
                                    height: 200,
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle, ${colors.primary}10, transparent)`,
                                    opacity: 0.5,
                                    zIndex: 0
                                }}
                                component={motion.div}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    x: [0, 20, 0],
                                    y: [0, -20, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </MotionCard>
                    ))}
                </Box>

                {/* Reset Button */}
                <Box textAlign="center" mt={8}>
                    <MagneticButton onClick={handleReset}>
                        <Box
                            sx={{
                                bgcolor: colors.tertiary,
                                color: 'white',
                                px: 6,
                                py: 2,
                                borderRadius: 50,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                boxShadow: `0 10px 30px ${colors.tertiary}40`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Rocket /> Nouveau parcours
                        </Box>
                    </MagneticButton>
                </Box>
            </MotionBox>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFF', pt: 16, pb: 10, position: 'relative', overflow: 'hidden' }}>
            <ParticlesBackground />
            <ConfettiExplosion trigger={showConfetti} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Animated Stepper */}
                {activeStep < 4 && (
                    <MotionBox
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        mb={8}
                    >
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconProps={{
                                            sx: {
                                                fontSize: '2rem',
                                                '&.Mui-active': {
                                                    color: colors.primary,
                                                    transform: 'scale(1.3)',
                                                    transition: 'all 0.3s'
                                                },
                                                '&.Mui-completed': {
                                                    color: colors.primary
                                                }
                                            }
                                        }}
                                        sx={{
                                            '& .MuiStepLabel-label': {
                                                fontWeight: 700,
                                                fontSize: '1rem'
                                            }
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </MotionBox>
                )}

                {/* Dynamic Content */}
                <Box sx={{ minHeight: 500, position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {activeStep === 0 && renderSchoolSelection()}
                        {activeStep === 1 && renderLevelSelection()}
                        {activeStep === 2 && renderSpecSelection()}
                        {activeStep === 3 && renderProgrammes()}
                    </AnimatePresence>
                </Box>

                {/* Floating Back Button */}
                <AnimatePresence>
                    {activeStep > 0 && activeStep < 3 && (
                        <MotionBox
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", bounce: 0.6 }}
                            sx={{
                                position: 'fixed',
                                bottom: 40,
                                left: 40,
                                zIndex: 1000
                            }}
                        >
                            <motion.div whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                    onClick={handleBack}
                                    sx={{
                                        bgcolor: 'white',
                                        width: 70,
                                        height: 70,
                                        boxShadow: `0 10px 40px ${colors.primary}40`,
                                        '&:hover': {
                                            bgcolor: colors.primary,
                                            '& svg': { color: 'white' }
                                        }
                                    }}
                                >
                                    <ArrowBack sx={{ fontSize: 32 }} />
                                </IconButton>
                            </motion.div>
                        </MotionBox>
                    )}
                </AnimatePresence>
            </Container>
        </Box>
    );
}