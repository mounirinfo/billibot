'use client';

import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
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

interface ModuleCardProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
  color: string;
  gradient: string;
  onClick: () => void;
  delay?: number;
}

export default function ModuleCard({
  icon: IconComponent,
  title,
  description,
  color,
  gradient,
  onClick,
  delay = 0
}: ModuleCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        animation: `${fadeSlideUp} 0.6s ease-out ${delay}s backwards`,
        background: '#FFFFFF',
        borderRadius: 4,
        border: '2px solid transparent',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          borderColor: color,
          '& .module-icon': {
            transform: 'rotate(10deg) scale(1.1)',
            background: gradient
          }
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          className="module-icon"
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            transition: 'all 0.4s ease-in-out'
          }}
        >
          <IconComponent sx={{ fontSize: 40, color: '#FFFFFF' }} />
        </Box>

        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, mb: 1.5, color: '#333' }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}
        >
          {description}
        </Typography>

        <Button
          variant="contained"
          sx={{
            background: gradient,
            color: '#FFFFFF',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0 4px 12px ${color}50`,
              transform: 'scale(1.05)'
            }
          }}
        >
          Commencer →
        </Button>
      </CardContent>
    </Card>
  );}