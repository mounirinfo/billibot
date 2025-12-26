'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
} from '@mui/material';
import {
  HourglassEmpty,
  Email,
  CheckCircleOutline,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function PendingPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2D9B94 0%, #FFD93D 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        }}
      >
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          {/* Icône animée */}
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: '#FFD93D',
              margin: '0 auto',
              mb: 3,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}
          >
            <HourglassEmpty sx={{ fontSize: 56, color: '#2D9B94' }} />
          </Avatar>

          {/* Titre */}
          <Typography
            variant="h4"
            fontWeight={800}
            color="#2D9B94"
            gutterBottom
          >
            Compte en attente de validation
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            Votre compte a été créé avec succès ! Un administrateur va vérifier
            votre inscription et vous recevrez un email dès que votre compte sera validé.
          </Typography>

          {/* Étapes */}
          <Stack spacing={2} sx={{ mb: 4, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#4CAF50', width: 40, height: 40 }}>
                <CheckCircleOutline />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Inscription complétée
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vos informations ont été enregistrées
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#FFB300', width: 40, height: 40 }}>
                <HourglassEmpty />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  En attente de validation
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Un administrateur va vérifier votre compte
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#E0E0E0', width: 40, height: 40 }}>
                <Email />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Notification par email
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vous recevrez un email de confirmation
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* Info */}
          <Box
            sx={{
              bgcolor: '#E3F2FD',
              p: 2,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography variant="body2" color="#1976D2">
              💡 <strong>Temps d'attente habituel :</strong> 24 à 48 heures
            </Typography>
          </Box>

          {/* Bouton retour */}
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/login')}
            sx={{
              borderColor: '#2D9B94',
              color: '#2D9B94',
              '&:hover': {
                borderColor: '#1F7872',
                bgcolor: 'rgba(45,155,148,0.04)',
              },
            }}
          >
            Retour à la connexion
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}