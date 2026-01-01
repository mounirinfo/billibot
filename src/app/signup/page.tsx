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
  FormHelperText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  SmartToy,
  Phone,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface School {
  id: string;
  name: string;
  type: string;
  school_group_id?: string;
}

interface FieldErrors {
  [key: string]: string | null;
}

export default function SignupPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
    schoolId: '',
    subjects: [] as string[],
  });

  const steps = ['Informations de base', 'Type de profil', 'Confirmation'];

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const res = await fetch('/api/schools');
      if (res.ok) {
        const data = await res.json();
        setSchools(data.schools || []);
      }
    } catch (error) {
      console.error('Erreur chargement écoles:', error);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: null });
    }
  };

  // ✅ Fonction pour vérifier si le rôle nécessite un établissement
  const roleNeedsSchool = (role: string) => {
    return role === 'teacher' || role === 'school_admin';
  };

  const clearErrors = () => {
    setError('');
    setFieldErrors({});
  };

  const validateStep = (step: number): boolean => {
    clearErrors();

    if (step === 0) {
      const errors: FieldErrors = {};

      if (!formData.fullName.trim()) {
        errors.fullName = 'Le nom complet est requis';
      }

      if (!formData.email.trim()) {
        errors.email = 'L\'email est requis';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errors.email = 'Format d\'email invalide';
        }
      }

      if (formData.phone && formData.phone.trim()) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          errors.phone = 'Le numéro de téléphone doit contenir 10 chiffres';
        }
      }

      if (!formData.password) {
        errors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError('Veuillez corriger les erreurs dans le formulaire');
        return false;
      }
    }

    if (step === 1) {
      const errors: FieldErrors = {};

      if (!formData.role) {
        errors.role = 'Veuillez sélectionner un type de profil';
      }

      // ✅ Établissement requis uniquement pour enseignant et admin
      if (roleNeedsSchool(formData.role) && !formData.schoolId) {
        errors.schoolId = 'Veuillez sélectionner un établissement';
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError('Veuillez corriger les erreurs dans le formulaire');
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
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) return;

    setLoading(true);
    clearErrors();

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          phone: formData.phone || null,
          role: formData.role,
          school_id: roleNeedsSchool(formData.role) ? formData.schoolId : null,
          subjects: formData.subjects.length > 0 ? formData.subjects : null,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Erreur lors de l\'inscription');
        
        if (data.details) {
          const errors: FieldErrors = {};
          Object.entries(data.details).forEach(([key, value]) => {
            if (value) {
              const fieldMap: { [key: string]: string } = {
                full_name: 'fullName',
                school_id: 'schoolId',
              };
              const fieldKey = fieldMap[key] || key;
              errors[fieldKey] = value as string;
            }
          });
          setFieldErrors(errors);

          if (errors.email || errors.password || errors.fullName || errors.phone) {
            setActiveStep(0);
          } else if (errors.role || errors.schoolId) {
            setActiveStep(1);
          }
        }
        
        setLoading(false);
        return;
      }

      setSuccess(data.message || 'Compte créé avec succès ! Votre compte est en attente de validation.');
      setTimeout(() => {
        router.push(data.redirectTo || '/pending');
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
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
              error={!!fieldErrors.fullName}
              helperText={fieldErrors.fullName}
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
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
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
              error={!!fieldErrors.phone}
              helperText={fieldErrors.phone || '10 chiffres'}
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
              error={!!fieldErrors.password}
              helperText={fieldErrors.password || 'Au moins 6 caractères'}
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
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
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
            <FormControl fullWidth sx={{ mb: 2.5 }} error={!!fieldErrors.role}>
              <InputLabel>Type de profil *</InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange('role')}
                required
                disabled={loading}
                label="Type de profil *"
              >
                <MenuItem value="student">Étudiant</MenuItem>
                <MenuItem value="candidat">Candidat</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="teacher">Enseignant</MenuItem>
                <MenuItem value="school_admin">Administrateur d'établissement</MenuItem>
              </Select>
              {fieldErrors.role && <FormHelperText>{fieldErrors.role}</FormHelperText>}
            </FormControl>

            {/* ✅ Établissement uniquement pour enseignant et admin */}
            {roleNeedsSchool(formData.role) && (
              <FormControl fullWidth sx={{ mb: 2.5 }} error={!!fieldErrors.schoolId}>
                <InputLabel>Établissement *</InputLabel>
                <Select
                  value={formData.schoolId}
                  onChange={handleChange('schoolId')}
                  required
                  disabled={loading || schools.length === 0}
                  label="Établissement *"
                >
                  {schools.length === 0 && (
                    <MenuItem value="" disabled>
                      Chargement des établissements...
                    </MenuItem>
                  )}
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.id}>
                      {school.name} - {school.type}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.schoolId && <FormHelperText>{fieldErrors.schoolId}</FormHelperText>}
              </FormControl>
            )}

            {formData.role === 'teacher' && (
              <TextField
                fullWidth
                label="Matières enseignées"
                placeholder="Ex: Mathématiques, Physique..."
                value={formData.subjects.join(', ')}
                onChange={(e) => {
                  const subjects = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                  setFormData({ ...formData, subjects });
                }}
                disabled={loading}
                error={!!fieldErrors.subjects}
                helperText={fieldErrors.subjects || "Séparez les matières par des virgules"}
              />
            )}
          </>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="primary" fontWeight={700}>
              📋 Récapitulatif
            </Typography>
            <Box sx={{ bgcolor: '#F5F7FA', p: 3, borderRadius: 2, border: '2px solid #E0F2F1' }}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                <strong>Nom :</strong> {formData.fullName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                <strong>Email :</strong> {formData.email}
              </Typography>
              {formData.phone && (
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  <strong>Téléphone :</strong> {formData.phone}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                <strong>Type de profil :</strong>{' '}
                {formData.role === 'student' && 'Étudiant'}
                {formData.role === 'candidat' && 'Candidat'}
                {formData.role === 'parent' && 'Parent'}
                {formData.role === 'teacher' && 'Enseignant'}
                {formData.role === 'school_admin' && 'Admin d\'établissement'}
              </Typography>
              {roleNeedsSchool(formData.role) && (
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  <strong>École :</strong>{' '}
                  {schools.find(s => s.id === formData.schoolId)?.name || '-'}
                </Typography>
              )}
              {formData.subjects.length > 0 && (
                <Typography variant="body2">
                  <strong>Matières :</strong> {formData.subjects.join(', ')}
                </Typography>
              )}
            </Box>
            <Alert severity="info" sx={{ mt: 3 }}>
              ⏳ Votre compte sera en attente de validation par un administrateur. Vous recevrez un email une fois validé.
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
                boxShadow: 3,
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

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => clearErrors()}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  disabled={loading}
                  sx={{ flex: 1 }}
                  variant="outlined"
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