'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton, Menu, MenuItem, Tooltip, CircularProgress, Button, Divider } from '@mui/material';
import { Logout, Person, VerifiedUser, AdminPanelSettings, School, KeyboardArrowDown, AutoAwesome, SmartToy } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface UserProfile {
    id: string;
    full_name: string;
    role: string;
    avatar_url: string;
    email: string;
}

const colors = {
    primary: '#2D9B94',
    secondary: '#FFD93D',
    tertiary: '#FF6B9D',
    lightBg: '#F0F9F8',
    textDark: '#1a1a2e',
    gradient: 'linear-gradient(135deg, #2D9B94 0%, #20726C 100%)',
    goldGradient: 'linear-gradient(135deg, #FFD93D 0%, #FFC107 100%)',
};

const MotionBox = motion.create(Box);
const MotionAvatar = motion.create(Avatar);

const getRoleLabel = (role: string) => {
    switch (role?.toLowerCase()) {
        case 'admin': return 'Administrateur';
        case 'etudiant': return 'Étudiant';
        case 'candidat': return 'Candidat';
        case 'prof':
        case 'teacher':
        case 'enseignant': return 'Professeur';
        default: return role || 'Utilisateur';
    }
};

const roleColor = (role: string) => {
    switch (role?.toLowerCase()) {
        case 'admin': return 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)'; // Red
        case 'etudiant': return 'linear-gradient(135deg, #2D9B94 0%, #20726C 100%)'; // Teal
        case 'candidat': return 'linear-gradient(135deg, #FFD93D 0%, #FFC107 100%)'; // Yellow
        case 'prof':
        case 'teacher':
        case 'enseignant': return 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)'; // Purple
        default: return 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)'; // Grey
    }
};

const roleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
        case 'admin': return <AdminPanelSettings sx={{ fontSize: 16, color: '#fff' }} />;
        case 'etudiant': return <School sx={{ fontSize: 16, color: '#fff' }} />;
        case 'prof':
        case 'teacher':
        case 'enseignant': return <School sx={{ fontSize: 16, color: '#fff' }} />;
        default: return <VerifiedUser sx={{ fontSize: 16, color: '#fff' }} />;
    }
};

export default function UserHeader() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.profile) {
                        setProfile(data.profile);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    if (loading) {
        return (
            <Box sx={{ position: 'fixed', top: 30, right: 40, zIndex: 1200 }}>
                <CircularProgress size={30} sx={{ color: colors.primary }} thickness={5} />
            </Box>
        );
    }

    if (!profile) return null;

    const open = Boolean(anchorEl);

    return (
        <MotionBox
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            sx={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '100%',
                padding: '24px 40px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 2,
                zIndex: 1200,
                pointerEvents: 'none',
            }}
        >
            <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    background: 'white',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    boxShadow: '0 8px 20px rgba(45, 155, 148, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    border: `1px solid ${colors.primary}30`,
                    color: colors.primary,
                    fontWeight: 700
                }}
                onClick={() => router.push('/chat')}
            >
                <SmartToy />
                Chat BilliBot
            </MotionBox>

            <MotionBox
                onClick={handleMenuOpen}
                whileHover={{ scale: 1.02, y: 2 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    padding: '12px 24px 12px 16px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    minWidth: 280,
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <MotionBox
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        sx={{
                            position: 'absolute',
                            top: -4,
                            left: -4,
                            right: -4,
                            bottom: -4,
                            borderRadius: '50%',
                            background: `conic-gradient(from 0deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
                            zIndex: 0,
                            opacity: 0.7
                        }}
                    />
                    <MotionAvatar
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        sx={{
                            width: 56,
                            height: 56,
                            border: '4px solid white',
                            zIndex: 1,
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }}
                    >
                        {profile.full_name?.charAt(0).toUpperCase()}
                    </MotionAvatar>
                    <Box sx={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 16,
                        height: 16,
                        bgcolor: '#4CAF50',
                        border: '3px solid white',
                        borderRadius: '50%',
                        zIndex: 2
                    }} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{
                            color: colors.textDark,
                            lineHeight: 1.2,
                            fontSize: '1.1rem',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        {profile.full_name}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Box
                            sx={{
                                px: 1.2,
                                py: 0.3,
                                borderRadius: '12px',
                                background: roleColor(profile.role),
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            {roleIcon(profile.role)}
                            <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                    color: '#fff',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {getRoleLabel(profile.role)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <KeyboardArrowDown
                    sx={{
                        color: colors.primary,
                        fontSize: 28,
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                    }}
                />

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    disableScrollLock
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 20px 50px rgba(0,0,0,0.15))',
                            mt: 2,
                            ml: 2,
                            borderRadius: '24px',
                            minWidth: 280,
                            border: '1px solid rgba(0,0,0,0.05)',
                            padding: 1,
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 28,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: colors.lightBg, borderRadius: '16px', mb: 1, mx: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Connecté en tant que
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} color={colors.primary}>
                            {profile.email}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1, mx: 2 }} />

                    <MenuItem sx={{ borderRadius: '12px', mx: 1, mb: 0.5, py: 1.5, '&:hover': { bgcolor: colors.lightBg } }}>
                        <Person sx={{ mr: 2, color: colors.primary }} />
                        <Typography fontWeight={600}>Mon Profil</Typography>
                    </MenuItem>

                    <MenuItem onClick={handleLogout} sx={{ borderRadius: '12px', mx: 1, color: '#ff4757', py: 1.5, '&:hover': { bgcolor: '#ffe0e3' } }}>
                        <Logout sx={{ mr: 2 }} />
                        <Typography fontWeight={600}>Se déconnecter</Typography>
                    </MenuItem>
                </Menu>
            </MotionBox>
        </MotionBox>
    );
}


