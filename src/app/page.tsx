'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers la page de login
    // Plus tard, on vérifiera si l'utilisateur est connecté
    router.push('/login');
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2D9B94 0%, #1F7872 100%)',
      }}
    >
      <CircularProgress sx={{ color: 'white' }} />
    </Box>
  );
}