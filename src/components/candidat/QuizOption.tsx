'use client';

import { Button, Typography } from '@mui/material';

interface QuizOptionProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function QuizOption({
  emoji,
  label,
  isSelected,
  onClick
}: QuizOptionProps) {
  return (
    <Button
      variant={isSelected ? 'contained' : 'outlined'}
      fullWidth
      onClick={onClick}
      sx={{
        py: 3,
        px: 2,
        borderRadius: 3,
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        justifyContent: 'flex-start',
        background: isSelected
          ? 'linear-gradient(135deg, #2D9B94 0%, #1F7A72 100%)'
          : 'transparent',
        borderColor: isSelected ? '#2D9B94' : '#DDD',
        color: isSelected ? '#FFF' : '#333',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
          borderColor: '#2D9B94',
          background: isSelected
            ? 'linear-gradient(135deg, #2D9B94 0%, #1F7A72 100%)'
            : '#F0F8FF'
        }
      }}
    >
      <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>
        {emoji}
      </Typography>
      <Typography sx={{ fontSize: '0.95rem', textAlign: 'left' }}>
        {label}
      </Typography>
    </Button>
  );
}
