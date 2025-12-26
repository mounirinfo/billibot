'use client';

import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import { SmartToy, Add } from '@mui/icons-material';

interface EmptyStateProps {
  onCreateConversation: () => void;
}

export default function EmptyState({ onCreateConversation }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 3,
      }}
    >
      <Avatar sx={{ width: 100, height: 100, bgcolor: '#FFD93D', mb: 3 }}>
        <SmartToy sx={{ fontSize: 56, color: '#2D9B94' }} />
      </Avatar>
      <Typography variant="h5" fontWeight={700} color="text.secondary" gutterBottom>
        Aucune conversation sélectionnée
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Commence une nouvelle conversation pour démarrer !
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreateConversation}
        sx={{
          bgcolor: '#2D9B94',
          py: 1.5,
          px: 3,
          borderRadius: 3,
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(45,155,148,0.3)',
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#26857E',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(45,155,148,0.4)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        Nouvelle conversation
      </Button>
    </Box>
  );
}