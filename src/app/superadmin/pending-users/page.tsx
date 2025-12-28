'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
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
  AppBar,
  Toolbar,
  Divider,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Person,
  School,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Logout,
  SmartToy,
  MenuBook,
  Class,
  SupervisorAccount,
  Search,
  FilterList,
  Groups,
  PendingActions,
  VerifiedUser,
  Block,
  Info,
} from '@mui/icons-material';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  account_status: string;
  school_id: string;
  grade_level: string;
  subjects: string[];
  bio: string;
  created_at: string;
  school?: {
    id: string;
    name: string;
    type: string;
    city: string;
  };
}

interface UserProfile {
  role: string;
  full_name: string;
  email: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function SuperAdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadProfile();
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [allUsers, searchQuery, statusFilter, roleFilter]);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (res.ok) {
        setProfile(data.profile);
        if (data.profile?.role !== 'super_admin') {
          window.location.href = '/chat';
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les utilisateurs en attente
      const pendingRes = await fetch('/api/admin/pending-users');
      const pendingData = await pendingRes.json();
      if (pendingRes.ok) {
        setPendingUsers(pendingData.users || []);
      }

      // Charger tous les utilisateurs
      const allRes = await fetch('/api/admin/all-users');
      const allData = await allRes.json();
      if (allRes.ok) {
        setAllUsers(allData.users || []);
        calculateStats(allData.users || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (users: User[]) => {
    setStats({
      total: users.length,
      pending: users.filter(u => u.account_status === 'pending').length,
      approved: users.filter(u => u.account_status === 'approved').length,
      rejected: users.filter(u => u.account_status === 'rejected').length,
    });
  };

  const filterUsers = () => {
    let filtered = [...allUsers];

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.account_status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
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
      console.error('Erreur:', error);
    } finally {
      setLoggingOut(false);
      setAnchorEl(null);
    }
  };

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsDialog(true);
  };

  const handleOpenAction = (user: User, actionType: 'approve' | 'reject') => {
    setSelectedUser(user);
    setAction(actionType);
    setRejectionReason('');
    setDetailsDialog(false);
    setActionDialog(true);
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
        loadData();
        setActionDialog(false);
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
      admin: 'Administrateur',
      super_admin: 'Super Admin',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      student: '#2196F3',
      parent: '#9C27B0',
      teacher: '#4CAF50',
      school_admin: '#FF9800',
      admin: '#F44336',
      super_admin: '#D32F2F',
    };
    return colors[role] || '#9E9E9E';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: 'warning' | 'success' | 'error' | 'default' } = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'En attente',
      approved: 'Validé',
      rejected: 'Rejeté',
    };
    return labels[status] || status;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <School sx={{ fontSize: 20 }} />;
      case 'teacher':
        return <MenuBook sx={{ fontSize: 20 }} />;
      case 'school_admin':
      case 'admin':
      case 'super_admin':
        return <SupervisorAccount sx={{ fontSize: 20 }} />;
      default:
        return <Person sx={{ fontSize: 20 }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
        <CircularProgress size={60} sx={{ color: '#2D9B94' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      {/* AppBar moderne */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          background: 'linear-gradient(135deg, #2D9B94 0%, #1F7872 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: '#FFD93D', width: 48, height: 48, mr: 2, boxShadow: 3 }}>
              <SmartToy sx={{ color: '#2D9B94', fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                BilliBot Admin
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Tableau de bord Super Administrateur
              </Typography>
            </Box>
          </Box>

          <IconButton 
            color="inherit" 
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <Avatar sx={{ bgcolor: '#FFD93D', width: 40, height: 40 }}>
              <Person sx={{ color: '#2D9B94' }} />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: 3, minWidth: 250, mt: 1 } }}
          >
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="body1" fontWeight={700}>
                {profile?.full_name || 'Admin'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {profile?.email}
              </Typography>
              <Chip 
                label="Super Admin" 
                size="small" 
                sx={{ mt: 1, bgcolor: '#F44336', color: 'white', fontWeight: 600 }}
              />
            </Box>
            <MenuItem onClick={handleLogout} disabled={loggingOut} sx={{ py: 1.5, color: '#EF5350', mt: 1 }}>
              {loggingOut ? <CircularProgress size={20} sx={{ mr: 1.5 }} /> : <Logout fontSize="small" sx={{ mr: 1.5 }} />}
              {loggingOut ? 'Déconnexion...' : 'Déconnexion'}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 1600, mx: 'auto' }}>
        {/* Message */}
        {message && (
          <Alert 
            severity={message.includes('succès') ? 'success' : 'error'} 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        {/* Statistiques */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight={800} color="white">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Total Utilisateurs
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                  <Groups sx={{ fontSize: 32, color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight={800} color="white">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    En Attente
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                  <PendingActions sx={{ fontSize: 32, color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight={800} color="white">
                    {stats.approved}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Validés
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                  <VerifiedUser sx={{ fontSize: 32, color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight={800} color="white">
                    {stats.rejected}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Rejetés
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                  <Block sx={{ fontSize: 32, color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Onglets */}
        <Paper sx={{ borderRadius: 3, mb: 3, boxShadow: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' }
            }}
          >
            <Tab 
              label={
                <Badge badgeContent={pendingUsers.length} color="error">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PendingActions />
                    En Attente
                  </Box>
                </Badge>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Groups />
                  Tous les Utilisateurs
                </Box>
              } 
            />
          </Tabs>
        </Paper>

        {/* Tab 1: Utilisateurs en attente */}
        {tabValue === 0 && (
          <>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#2D9B94' }}>
              📋 Utilisateurs en attente de validation
            </Typography>

            {pendingUsers.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, boxShadow: 2 }}>
                <CheckCircle sx={{ fontSize: 100, color: '#4CAF50', mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Aucune demande en attente
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Toutes les inscriptions ont été traitées
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3 
              }}>
                {pendingUsers.map((user) => (
                  <Card 
                    key={user.id}
                    sx={{ 
                      borderRadius: 3, 
                      boxShadow: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: getRoleColor(user.role), 
                            width: 56, 
                            height: 56, 
                            mr: 2,
                            boxShadow: 2,
                          }}
                        >
                          {getRoleIcon(user.role)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight={700} noWrap>
                            {user.full_name}
                          </Typography>
                          <Chip
                            label={getRoleLabel(user.role)}
                            size="small"
                            sx={{
                              bgcolor: getRoleColor(user.role),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ fontSize: 18, color: '#757575', mr: 1.5 }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {user.email}
                          </Typography>
                        </Box>

                        {user.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ fontSize: 18, color: '#757575', mr: 1.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {user.phone}
                            </Typography>
                          </Box>
                        )}

                        {user.school && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <School sx={{ fontSize: 18, color: '#757575', mr: 1.5 }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.school.name}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ fontSize: 18, color: '#757575', mr: 1.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Stack direction="row" spacing={1}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDetails(user)}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Détails
                        </Button>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleOpenAction(user, 'approve')}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Valider
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenAction(user, 'reject')}
                          sx={{ border: '1px solid', borderColor: 'error.main' }}
                        >
                          <Cancel />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Tab 2: Tous les utilisateurs */}
        {tabValue === 1 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#2D9B94' }}>
                👥 Tous les utilisateurs
              </Typography>
              
              <Paper sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: 2 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 2 
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#2D9B94' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filtrer par statut"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <MenuItem value="all">Tous les statuts</MenuItem>
                    <MenuItem value="pending">En attente</MenuItem>
                    <MenuItem value="approved">Validé</MenuItem>
                    <MenuItem value="rejected">Rejeté</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Filtrer par rôle"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <MenuItem value="all">Tous les rôles</MenuItem>
                    <MenuItem value="student">Élève</MenuItem>
                    <MenuItem value="teacher">Enseignant</MenuItem>
                    <MenuItem value="school_admin">Admin École</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                  </TextField>
                </Box>
              </Paper>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Utilisateur</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Rôle</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>École</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary" variant="h6">
                          Aucun utilisateur trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: '#F9FAFB' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: getRoleColor(user.role) }}>
                                {getRoleIcon(user.role)}
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
                              size="small"
                              sx={{
                                bgcolor: getRoleColor(user.role),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(user.account_status)}
                              color={getStatusColor(user.account_status)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.school?.name || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(user.created_at).toLocaleDateString('fr-FR')}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetails(user)}
                              sx={{ color: '#2D9B94' }}
                            >
                              <Info />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Lignes par page:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
              />
            </TableContainer>
          </>
        )}

        {/* Dialog Détails */}
        <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: '#F5F7FA', fontWeight: 700, fontSize: '1.5rem' }}>
            👤 Détails de l'utilisateur
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedUser && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getRoleColor(selectedUser.role), 
                        width: 72, 
                        height: 72, 
                        mr: 2,
                        boxShadow: 3,
                      }}
                    >
                      {getRoleIcon(selectedUser.role)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {selectedUser.full_name}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip
                          label={getRoleLabel(selectedUser.role)}
                          sx={{
                            bgcolor: getRoleColor(selectedUser.role),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={getStatusLabel(selectedUser.account_status)}
                          color={getStatusColor(selectedUser.account_status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2 
                }}>
                  <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      📧 Email
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedUser.email}
                    </Typography>
                  </Paper>

                  {selectedUser.phone && (
                    <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        📞 Téléphone
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedUser.phone}
                      </Typography>
                    </Paper>
                  )}

                  {selectedUser.school && (
                    <>
                      <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          🏫 École
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedUser.school.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedUser.school.type}
                        </Typography>
                      </Paper>

                      <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          📍 Ville
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedUser.school.city}
                        </Typography>
                      </Paper>
                    </>
                  )}

                  {selectedUser.grade_level && (
                    <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        📚 Niveau
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedUser.grade_level}
                      </Typography>
                    </Paper>
                  )}

                  {selectedUser.subjects && selectedUser.subjects.length > 0 && (
                    <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        📖 Matières
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {selectedUser.subjects.map((subject, index) => (
                          <Chip key={index} label={subject} size="small" />
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>

                {selectedUser.bio && (
                  <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      💬 Bio
                    </Typography>
                    <Typography variant="body2">
                      {selectedUser.bio}
                    </Typography>
                  </Paper>
                )}

                <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    📅 Date d'inscription
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(selectedUser.created_at).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#F5F7FA' }}>
            <Button onClick={() => setDetailsDialog(false)} sx={{ fontWeight: 600 }}>
              Fermer
            </Button>
            {selectedUser?.account_status === 'pending' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleOpenAction(selectedUser!, 'approve')}
                  sx={{ fontWeight: 600 }}
                >
                  Valider
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleOpenAction(selectedUser!, 'reject')}
                  sx={{ fontWeight: 600 }}
                >
                  Rejeter
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Dialog Action */}
        <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: action === 'approve' ? '#E8F5E9' : '#FFEBEE', fontWeight: 700, fontSize: '1.5rem' }}>
            {action === 'approve' ? '✅ Valider l\'inscription' : '❌ Rejeter l\'inscription'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedUser && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>{selectedUser.full_name}</strong> • {selectedUser.email}
                </Typography>
              </Alert>
            )}

            {action === 'reject' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Raison du rejet"
                placeholder="Expliquez pourquoi cette inscription est rejetée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                sx={{ mt: 1 }}
                helperText="Cette raison sera envoyée à l'utilisateur par email"
              />
            )}

            {action === 'approve' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                L'utilisateur recevra un email de confirmation et pourra se connecter immédiatement.
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setActionDialog(false)} disabled={processing} sx={{ fontWeight: 600 }}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleValidateUser}
              disabled={processing}
              color={action === 'approve' ? 'success' : 'error'}
              sx={{ fontWeight: 600, minWidth: 120 }}
            >
              {processing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                action === 'approve' ? 'Confirmer la validation' : 'Confirmer le rejet'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}