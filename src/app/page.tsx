'use client';

import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirection immédiate vers /login
    router.push('/login');
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2D9B94 0%, #1F7872 100%)',
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: 'white' }} size={60} />
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
        Redirection...
      </Typography>
    </Box>
  );
}