'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

interface ProfileData {
  account_status: string;
  rejection_reason: string | null;
  email: string;
  full_name: string;
}

export default function RejectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/rejection-status', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Erreur lors de la récupération du profil');
        }

        const data = await response.json();
        const profile: ProfileData = data.profile;

        if (!profile) {
          router.push('/login');
          return;
        }

        // Si le compte n'est pas rejeté, rediriger
        if (profile.account_status !== 'rejected') {
          if (profile.account_status === 'approved') {
            router.push('/chat');
          } else if (profile.account_status === 'pending') {
            router.push('/pending');
          } else {
            router.push('/login');
          }
          return;
        }

        setRejectionReason(profile.rejection_reason);
        setUserEmail(profile.email);
        setUserName(profile.full_name);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      window.location.href = '/login';
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Compte rejeté - ${userEmail}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nMon compte a été rejeté et je souhaiterais obtenir plus d'informations.\n\nNom: ${userName}\nEmail: ${userEmail}\nRaison du rejet: ${rejectionReason || 'Non spécifiée'}\n\nCordialement`
    );
    window.location.href = `mailto:support@billibot.com?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
        }}
      >
        <CircularProgress sx={{ color: '#2D9B94' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          {/* Icône d'erreur */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#ffebee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <ErrorIcon sx={{ fontSize: 48, color: '#d32f2f' }} />
          </Box>

          {/* Titre */}
          <Typography variant="h4" fontWeight={700} gutterBottom color="#d32f2f">
            Compte Refusé
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Nous sommes désolés, mais votre demande de compte a été refusée.
          </Typography>

          {/* Raison du rejet */}
          {rejectionReason && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Raison du refus :
              </Typography>
              <Typography variant="body2">{rejectionReason}</Typography>
            </Alert>
          )}

          {/* Informations */}
          <Box
            sx={{
              bgcolor: '#f9f9f9',
              p: 2,
              borderRadius: 2,
              mb: 3,
              textAlign: 'left',
            }}
          >
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Que faire maintenant ?</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
              <li>Vérifiez que les informations fournies étaient correctes</li>
              <li>Contactez le support pour plus de détails</li>
              <li>Vous pouvez créer un nouveau compte avec des informations valides</li>
            </Typography>
          </Box>

          {/* Boutons d'action */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
              onClick={handleContactSupport}
              sx={{
                bgcolor: '#2D9B94',
                '&:hover': { bgcolor: '#257d77' },
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Contacter le Support
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  bgcolor: '#ffebee',
                },
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Se Déconnecter
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 3 }}>
            {userName && (
              <Typography variant="caption" color="text.secondary" display="block">
                {userName}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block">
              {userEmail}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}