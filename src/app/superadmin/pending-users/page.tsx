'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Person,
  School,
  Email,
  Phone,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  school_id: string;
  grade_level: string;
  subjects: string[];
  created_at: string;
  school?: {
    name: string;
    type: string;
  };
}

export default function SuperAdminPendingUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [actionDialog, setActionDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      checkSuperAdminAccess();
    }
  }, [user, authLoading]);

  const checkSuperAdminAccess = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      
      if (data.profile?.role !== 'super_admin') {
        router.push('/chat');
        return;
      }
      
      loadPendingUsers();
    } catch (error) {
      console.error('Erreur:', error);
      router.push('/chat');
    }
  };

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pending-users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user: PendingUser, actionType: 'approve' | 'reject') => {
    setSelectedUser(user);
    setAction(actionType);
    setRejectionReason('');
    setActionDialog(true);
  };

  const handleCloseDialog = () => {
    setActionDialog(false);
    setSelectedUser(null);
    setRejectionReason('');
  };

  const handleValidateUser = async () => {
    if (!selectedUser) return;
    
    if (action === 'reject' && !rejectionReason.trim()) {
      setMessage('Veuillez indiquer la raison du rejet');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/validate-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          action,
          rejectionReason: action === 'reject' ? rejectionReason : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        loadPendingUsers();
        handleCloseDialog();
      } else {
        setMessage(data.error || 'Erreur lors de la validation');
      }
    } catch (error) {
      setMessage('Une erreur est survenue');
    } finally {
      setProcessing(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      student: 'Élève',
      parent: 'Parent',
      teacher: 'Enseignant',
      school_admin: 'Admin École',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: any } = {
      student: 'primary',
      parent: 'secondary',
      teacher: 'success',
      school_admin: 'warning',
    };
    return colors[role] || 'default';
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#2D9B94" gutterBottom>
            Utilisateurs en attente de validation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Validez ou rejetez les nouvelles inscriptions
          </Typography>
        </Box>

        {/* Message */}
        {message && (
          <Alert severity={message.includes('succès') ? 'success' : 'error'} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell><strong>Utilisateur</strong></TableCell>
                <TableCell><strong>Rôle</strong></TableCell>
                <TableCell><strong>École</strong></TableCell>
                <TableCell><strong>Informations</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Aucun utilisateur en attente
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#2D9B94' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.full_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.school?.name || '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.school?.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {user.grade_level && (
                        <Typography variant="caption" display="block">
                          📚 {user.grade_level}
                        </Typography>
                      )}
                      {user.subjects?.length > 0 && (
                        <Typography variant="caption" display="block">
                          📖 {user.subjects.join(', ')}
                        </Typography>
                      )}
                      {user.phone && (
                        <Typography variant="caption" display="block">
                          📞 {user.phone}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleOpenDialog(user, 'approve')}
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDialog(user, 'reject')}
                        >
                          <Cancel />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog de confirmation */}
        <Dialog open={actionDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {action === 'approve' ? '✅ Valider l\'inscription' : '❌ Rejeter l\'inscription'}
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Utilisateur :</strong> {selectedUser.full_name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email :</strong> {selectedUser.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Rôle :</strong> {getRoleLabel(selectedUser.role)}
                </Typography>
              </Box>
            )}

            {action === 'reject' && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Raison du rejet"
                placeholder="Expliquez pourquoi cette inscription est rejetée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            )}

            {action === 'approve' && (
              <Alert severity="info">
                L'utilisateur recevra un email de confirmation et pourra se connecter.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={processing}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleValidateUser}
              disabled={processing}
              color={action === 'approve' ? 'success' : 'error'}
            >
              {processing ? <CircularProgress size={24} /> : action === 'approve' ? 'Valider' : 'Rejeter'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}