'use client';

import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { keyframes } from '@mui/system';

const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function PageHeader({
  title,
  subtitle,
  showBackButton = true,
  backUrl = '/candidat'
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <>
      {showBackButton && (
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push(backUrl)}
          sx={{ mb: 4 }}
        >
          Retour
        </Button>
      )}

      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          animation: `${fadeSlideUp} 0.6s ease-out`
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 800, mb: 2 }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: '#666', fontWeight: 400 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </>
  );
}
