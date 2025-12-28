'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Avatar,
  CircularProgress,
  keyframes,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import Image from 'next/image';

// Animation de rebond pour le logo
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la connexion');
        setLoading(false);
        return;
      }

      // ✅ Redirection selon le statut et le rôle
      window.location.href = data.redirectTo || '/chat';
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2D9B94 0%, #1F7872 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            {/* Logo BilliBot avec animation de rebond */}
            <Box
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${bounce} 2s ease-in-out infinite`,
              }}
            >
              <Image
                src="/mon_billi.png"
                alt="Logo"
                width={200}
                height={200}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
            
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              BilliBot
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Connectez-vous pour continuer votre apprentissage
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{
                  fontSize: '0.875rem',
                  color: 'primary.main',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Pas encore de compte ?{' '}
                <Link
                  href="/signup"
                  underline="hover"
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  S'inscrire
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}