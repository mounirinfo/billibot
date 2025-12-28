'use client';

import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  SmartToy,
  School,
  Phone,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface School {
  id: string;
  name: string;
  type: string;
  school_group_id?: string;
}

interface SchoolGroup {
  id: string;
  name: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolGroups, setSchoolGroups] = useState<SchoolGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Étape 1 : Informations de base
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Étape 2 : Profil
    role: '',
    schoolId: '',
    schoolGroupId: '',
    gradeLevel: '',
    subjects: [] as string[],
  });

  const steps = ['Informations de base', 'Type de profil', 'Confirmation'];

  // Charger les écoles et groupes scolaires
  useEffect(() => {
    loadSchools();
    loadSchoolGroups();
  }, []);

  const loadSchools = async () => {
    try {
      console.log("11111111111")
      const res = await fetch('/api/schools');
      if (res.ok) {
        const data = await res.json();
        setSchools(data.schools || []);
      }
    } catch (error) {
      console.error('Erreur chargement écoles:', error);
    }
  };

  const loadSchoolGroups = async () => {
    try {
      const res = await fetch('/api/school-groups');
      if (res.ok) {
        const data = await res.json();
        setSchoolGroups(data.schoolGroups || []);
      }
    } catch (error) {
      console.error('Erreur chargement groupes:', error);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const validateStep = (step: number): boolean => {
    setError('');

    if (step === 0) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs obligatoires');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return false;
      }
    }

    if (step === 1) {
      if (!formData.role) {
        setError('Veuillez sélectionner un type de profil');
        return false;
      }
      if (!formData.schoolId && formData.role !== 'super_admin') {
        setError('Veuillez sélectionner un établissement');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          role: formData.role,
          schoolId: formData.schoolId,
          schoolGroupId: formData.schoolGroupId,
          gradeLevel: formData.gradeLevel,
          subjects: formData.subjects,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'inscription');
        setLoading(false);
        return;
      }

      setSuccess('Compte créé avec succès ! Votre compte est en attente de validation par un administrateur.');
      setTimeout(() => {
        router.push('/pending');
      }, 2000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Nom complet"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              required
              disabled={loading}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
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
              label="Téléphone (optionnel)"
              value={formData.phone}
              onChange={handleChange('phone')}
              disabled={loading}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              required
              disabled={loading}
              sx={{ mb: 2.5 }}
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

            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );

      case 1:
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Type de profil *</InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange('role')}
                required
                disabled={loading}
                label="Type de profil *"
              >
                <MenuItem value="student">Élève</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="teacher">Enseignant</MenuItem>
                <MenuItem value="school_admin">Administrateur d'établissement</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Établissement *</InputLabel>
              <Select
                value={formData.schoolId}
                onChange={handleChange('schoolId')}
                required
                disabled={loading}
                label="Établissement *"
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name} - {school.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.role === 'student' && (
              <TextField
                fullWidth
                label="Niveau scolaire"
                placeholder="Ex: 6ème, Terminale S, Licence 1..."
                value={formData.gradeLevel}
                onChange={handleChange('gradeLevel')}
                disabled={loading}
                sx={{ mb: 2.5 }}
              />
            )}

            {formData.role === 'teacher' && (
              <TextField
                fullWidth
                label="Matières enseignées"
                placeholder="Ex: Mathématiques, Physique..."
                value={formData.subjects.join(', ')}
                onChange={(e) => {
                  const subjects = e.target.value.split(',').map(s => s.trim());
                  setFormData({ ...formData, subjects });
                }}
                disabled={loading}
                helperText="Séparez les matières par des virgules"
              />
            )}
          </>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Récapitulatif
            </Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Nom :</strong> {formData.fullName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email :</strong> {formData.email}
              </Typography>
              {formData.phone && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Téléphone :</strong> {formData.phone}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Type de profil :</strong>{' '}
                {formData.role === 'student' && 'Élève'}
                {formData.role === 'parent' && 'Parent'}
                {formData.role === 'teacher' && 'Enseignant'}
                {formData.role === 'school_admin' && 'Admin d\'établissement'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>École :</strong>{' '}
                {schools.find(s => s.id === formData.schoolId)?.name || '-'}
              </Typography>
              {formData.gradeLevel && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Niveau :</strong> {formData.gradeLevel}
                </Typography>
              )}
            </Box>
            <Alert severity="info" sx={{ mt: 2 }}>
              Votre compte sera en attente de validation par un administrateur.
            </Alert>
          </Box>
        );

      default:
        return null;
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
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo et titre */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#FFD93D',
                mb: 2,
              }}
            >
              <SmartToy sx={{ fontSize: 48, color: '#2D9B94' }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              Créer un compte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejoignez BilliBot pour commencer votre apprentissage
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            {/* Boutons de navigation */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Retour
                </Button>
              )}
              
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'S\'inscrire'}
                </Button>
              )}
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/login"
                underline="hover"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                Se connecter
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}