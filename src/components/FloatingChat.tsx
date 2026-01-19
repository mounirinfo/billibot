'use client';

import { Box, Typography, Tooltip, Zoom } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MotionBox = motion.create(Box);

export default function FloatingChat() {
    const router = useRouter();
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
            }}
        >
            <AnimatePresence>
                {showTooltip && (
                    <MotionBox
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        sx={{
                            bgcolor: '#fff',
                            px: 2,
                            py: 1,
                            borderRadius: '20px 20px 0 20px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '2px solid #2D9B94',
                            position: 'relative',
                            mb: 1
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, color: '#2D9B94', fontSize: '0.9rem' }}>
                            “ clique sur mon chat ”
                        </Typography>
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -10,
                                right: 20,
                                width: 0,
                                height: 0,
                                borderLeft: '10px solid transparent',
                                borderRight: '10px solid transparent',
                                borderTop: '10px solid #2D9B94'
                            }}
                        />
                    </MotionBox>
                )}
            </AnimatePresence>

            <MotionBox
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push('/chat')}
                sx={{
                    width: 80,
                    height: 80,
                    cursor: 'pointer',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(45, 155, 148, 0.3)',
                    bgcolor: '#fff',
                    border: '4px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    component="img"
                    src="/mascot/billibot_cat.png"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    alt="BiliBot Cat"
                />
            </MotionBox>
        </Box>
    );
}
