'use client';

import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

interface FormationCardProps {
  name: string;
  fullName: string;
  emoji: string;
  description: string;
  color: string;
  matchPercentage?: number;
  delay?: number;
}

export default function FormationCard({
  name,
  fullName,
  emoji,
  description,
  color,
  matchPercentage = 90,
  delay = 0
}: FormationCardProps) {
  return (
    <Card
      sx={{
        animation: `${fadeIn} 0.6s ease-out ${delay}s backwards`,
        borderRadius: 4,
        border: `3px solid ${color}`,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: `0 8px 24px ${color}40`
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h2" sx={{ mr: 2 }}>
            {emoji}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color }}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {fullName}
            </Typography>
          </Box>
          <Chip
            label={`Match ${matchPercentage}%`}
            sx={{
              background: color,
              color: '#FFF',
              fontWeight: 700
            }}
          />
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: color,
              color: '#FFF',
              flex: 1,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: color,
                opacity: 0.9
              }
            }}
          >
            En savoir plus
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: color,
              color: color,
              flex: 1,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Candidater maintenant
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
